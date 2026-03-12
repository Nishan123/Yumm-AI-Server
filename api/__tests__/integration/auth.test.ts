import request from 'supertest';
import app from '../../index';
import { UserModel } from '../../models/user.model';

describe('Auth API Integration Tests', () => {
    const testUser = {
        uid: 'test-user-uid-int-auth',
        fullName: 'Test User',
        email: 'testauthint@example.com',
        authProvider: 'local',
        password: 'Password123!',
        confirmPassword: 'Password123!',
    };

    beforeAll(async () => {
        await UserModel.deleteOne({ email: testUser.email });
        await UserModel.deleteOne({ uid: testUser.uid });
    });

    afterAll(async () => {
        await UserModel.deleteOne({ email: testUser.email });
        await UserModel.deleteOne({ uid: testUser.uid });
    });

    describe('POST /api/auth/register', () => {
        test('should validate missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    fullName: testUser.fullName,
                    email: testUser.email,
                });

            expect(res.statusCode).toBe(422); // Based on Zod validation
            expect(res.body.success).toBe(false);
        });

        test('should register new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
        });
    });

    describe('POST /api/auth/login', () => {
        test('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined(); // Based on standard response
        });

        test('should fail with invalid email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrong@example.com',
                    password: testUser.password,
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });
});
