import { AuthService } from '../../services/auth.service';
import { IUserRepository } from '../../repositories/user.repository';
import { HttpError } from '../../errors/http-error';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('google-auth-library');
jest.mock('../../config/email', () => ({ sendEmail: jest.fn() }));

describe('AuthService', () => {
    let service: AuthService;
    let mockUserRepo: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        mockUserRepo = {
            createUser: jest.fn(),
            getUser: jest.fn(),
            getUserById: jest.fn(),
            getUserByEmail: jest.fn(),
            updateUser: jest.fn(),
            updateUserById: jest.fn(),
            deleteUser: jest.fn(),
            getAllUsers: jest.fn(),
            getUsersWithPushyTokens: jest.fn(),
        } as unknown as jest.Mocked<IUserRepository>;

        // mock google client verifyIdToken
        (OAuth2Client.prototype.verifyIdToken as jest.Mock) = jest.fn().mockResolvedValue({
            getPayload: () => ({ email: 'google@example.com', name: 'Google User' })
        });

        service = new AuthService(mockUserRepo);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        const payload = {
            uid: 'uid-1',
            fullName: 'Test User',
            email: 'test@example.com',
            authProvider: 'local',
            password: 'Password123!',
            confirmPassword: 'Password123!',
            allergenicIngredients: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        test('46. should register a new user successfully', async () => {
            mockUserRepo.getUser.mockResolvedValue(null);
            mockUserRepo.getUserByEmail.mockResolvedValue(null);
            (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedPassword');
            mockUserRepo.createUser.mockResolvedValue({ ...payload, password: 'hashedPassword', toObject: () => ({ ...payload }) } as any);
            (jwt.sign as jest.Mock).mockReturnValue('token');

            const result = await service.register(payload);
            expect(result.token).toBe('token');
            expect(result.user).toBeDefined();
            expect(mockUserRepo.createUser).toHaveBeenCalled();
        });

        test('47. should throw 409 if user exists by email', async () => {
            mockUserRepo.getUserByEmail.mockResolvedValue({} as any);
            await expect(service.register(payload)).rejects.toThrow(new HttpError(409, 'User already exists'));
        });
    });

    describe('login', () => {
        const payload = { email: 'test@example.com', password: 'Password123!' };

        test('48. should login successfully', async () => {
            mockUserRepo.getUserByEmail.mockResolvedValue({ password: 'hashed', email: 'test@example.com', toObject: () => ({}) } as any);
            (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('token');

            const result = await service.login(payload);
            expect(result.token).toBe('token');
            expect(result.user).toBeDefined();
        });

        test('49. should throw 404 if user not found', async () => {
            mockUserRepo.getUserByEmail.mockResolvedValue(null);
            await expect(service.login(payload)).rejects.toThrow(new HttpError(404, 'No user found'));
        });

        test('50. should throw 401 on invalid password', async () => {
            mockUserRepo.getUserByEmail.mockResolvedValue({ password: 'hashed' } as any);
            (bcryptjs.compare as jest.Mock).mockResolvedValue(false);
            await expect(service.login(payload)).rejects.toThrow(new HttpError(401, 'Invalid password'));
        });
    });

    describe('googleLogin', () => {
        test('51. should create new user for first time google login', async () => {
            mockUserRepo.getUserByEmail.mockResolvedValue(null);
            mockUserRepo.createUser.mockResolvedValue({ email: 'google@example.com', toObject: () => ({}) } as any);
            (jwt.sign as jest.Mock).mockReturnValue('token');

            const result = await service.googleLogin({ idToken: 'valid-token' });
            expect(result.isNewUser).toBe(true);
            expect(result.token).toBe('token');
        });

        test('52. should return existing user token for recurrent google login', async () => {
            mockUserRepo.getUserByEmail.mockResolvedValue({ email: 'google@example.com', toObject: () => ({}) } as any);
            (jwt.sign as jest.Mock).mockReturnValue('token');

            const result = await service.googleLogin({ idToken: 'valid-token' });
            expect(result.isNewUser).toBe(false);
            expect(mockUserRepo.createUser).not.toHaveBeenCalled();
        });
    });

    describe('updateUserProfile', () => {
        test('53. should update user profile without file', async () => {
            mockUserRepo.getUser.mockResolvedValue({} as any);
            mockUserRepo.updateUser.mockResolvedValue({ fullName: 'Updated', toObject: () => ({}) } as any);

            const result = await service.updateUserProfile('uid-1', { fullName: 'Updated' });
            expect(result).toBeDefined();
            expect(mockUserRepo.updateUser).toHaveBeenCalledWith('uid-1', { fullName: 'Updated' });
        });
    });

    describe('sendResetPasswordEmail', () => {
        test('54. should throw 404 if email not found', async () => {
            mockUserRepo.getUserByEmail.mockResolvedValue(null);
            await expect(service.sendResetPasswordEmail('unknown@test.com')).rejects.toThrow(new HttpError(404, "User not found"));
        });
    });

    describe('verifyPassword', () => {
        test('55. should verify valid password', async () => {
            mockUserRepo.getUser.mockResolvedValue({ password: 'hashed' } as any);
            (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
            const isValid = await service.verifyPassword('uid', 'password');
            expect(isValid).toBe(true);
        });

        test('56. should throw 404 if user not found', async () => {
            mockUserRepo.getUser.mockResolvedValue(null);
            await expect(service.verifyPassword('uid', 'password')).rejects.toThrow(new HttpError(404, "User not found"));
        });
    });
});
