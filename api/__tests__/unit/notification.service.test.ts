import { NotificationService } from '../../services/notification.service';
import { NotificationRepository } from '../../repositories/notification.repo';
import { UserRepository } from '../../repositories/user.repository';
import { NotificationTargetAudience } from '../../types/notification.type';

// Mock dependencies
jest.mock('../../repositories/notification.repo');
jest.mock('../../repositories/user.repository');

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('NotificationService', () => {
    let service: NotificationService;
    let mockNotificationRepo: jest.Mocked<NotificationRepository>;
    let mockUserRepo: jest.Mocked<UserRepository>;

    beforeEach(() => {
        service = new NotificationService();
        mockNotificationRepo = (service as any).notificationRepo as jest.Mocked<NotificationRepository>;
        mockUserRepo = (service as any).userRepo as jest.Mocked<UserRepository>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('sendPushNotification', () => {
        const dto = {
            title: 'Test Title',
            message: 'Test Message',
            targetAudience: NotificationTargetAudience.ALL,
        };

        test('28. should log failure if no tokens are found', async () => {
            mockUserRepo.getUsersWithPushyTokens.mockResolvedValue([]);

            await service.sendPushNotification(dto);

            expect(mockUserRepo.getUsersWithPushyTokens).toHaveBeenCalledWith(undefined);
            expect(mockNotificationRepo.createLog).toHaveBeenCalledWith(expect.objectContaining({
                status: 'failed',
                sentCount: 0,
                failureCount: 0,
            }));
            expect(mockFetch).not.toHaveBeenCalled();
        });

        test('29. should fetch correct token depending on ALL audience', async () => {
            mockUserRepo.getUsersWithPushyTokens.mockResolvedValue(['token-1']);
            mockFetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue({}) });

            await service.sendPushNotification(dto);

            expect(mockUserRepo.getUsersWithPushyTokens).toHaveBeenCalledWith(undefined);
        });

        test('30. should fetch correct token depending on SUBSCRIBED audience', async () => {
            mockUserRepo.getUsersWithPushyTokens.mockResolvedValue(['token-1']);
            mockFetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue({}) });

            await service.sendPushNotification({ ...dto, targetAudience: NotificationTargetAudience.SUBSCRIBED });

            expect(mockUserRepo.getUsersWithPushyTokens).toHaveBeenCalledWith(true);
        });

        test('31. should fetch correct token depending on UNSUBSCRIBED audience', async () => {
            mockUserRepo.getUsersWithPushyTokens.mockResolvedValue(['token-1']);
            mockFetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue({}) });

            await service.sendPushNotification({ ...dto, targetAudience: NotificationTargetAudience.UNSUBSCRIBED });

            expect(mockUserRepo.getUsersWithPushyTokens).toHaveBeenCalledWith(false);
        });

        test('32. should log success when push API resolves successfully', async () => {
            mockUserRepo.getUsersWithPushyTokens.mockResolvedValue(['token-1', 'token-2']);
            mockFetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue({ success: true }) });

            await service.sendPushNotification(dto);

            expect(mockFetch).toHaveBeenCalled();
            expect(mockNotificationRepo.createLog).toHaveBeenCalledWith(expect.objectContaining({
                status: 'success',
                sentCount: 2,
                failureCount: 0,
            }));
        });

        test('33. should log failure when push API returns not ok', async () => {
            mockUserRepo.getUsersWithPushyTokens.mockResolvedValue(['token-1', 'token-2']);
            mockFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error', text: jest.fn().mockResolvedValue('Error details') });

            await service.sendPushNotification(dto);

            expect(mockFetch).toHaveBeenCalled();
            expect(mockNotificationRepo.createLog).toHaveBeenCalledWith(expect.objectContaining({
                status: 'failed',
                sentCount: 0,
                failureCount: 2,
            }));
        });

        test('34. should log failure when fetch throws error', async () => {
            mockUserRepo.getUsersWithPushyTokens.mockResolvedValue(['token-1', 'token-2']);
            mockFetch.mockRejectedValue(new Error('Network error'));

            await service.sendPushNotification(dto);

            expect(mockNotificationRepo.createLog).toHaveBeenCalledWith(expect.objectContaining({
                status: 'failed',
                sentCount: 0,
                failureCount: 2,
            }));
        });
    });

    describe('getNotificationLogs', () => {
        test('35. should proxy call to notification repository', async () => {
            mockNotificationRepo.getLogs.mockResolvedValue({ logs: [], total: 0 } as any);

            await service.getNotificationLogs(1, 10);

            expect(mockNotificationRepo.getLogs).toHaveBeenCalledWith(1, 10);
        });
    });

    describe('deleteNotificationLog', () => {
        test('36. should proxy call to notification repository', async () => {
            mockNotificationRepo.deleteLog.mockResolvedValue(true as any);

            const result = await service.deleteNotificationLog('log-id');

            expect(mockNotificationRepo.deleteLog).toHaveBeenCalledWith('log-id');
            expect(result).toBe(true);
        });
    });
});
