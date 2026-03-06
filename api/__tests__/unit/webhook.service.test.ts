import { WebhookService } from '../../services/webhook.service';
import { UserModel } from '../../models/user.model';

jest.mock('../../models/user.model');

describe('WebhookService', () => {
    let service: WebhookService;

    beforeEach(() => {
        service = new WebhookService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('processRevenueCatWebhook', () => {
        test('37. should warn and return if payload is invalid', async () => {
            const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();
            await service.processRevenueCatWebhook(null);
            expect(consoleWarn).toHaveBeenCalledWith('Invalid webhook payload received');
            consoleWarn.mockRestore();
        });

        test('38. should warn and return if event is missing', async () => {
            const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();
            await service.processRevenueCatWebhook({});
            expect(consoleWarn).toHaveBeenCalledWith('Invalid webhook payload received');
            consoleWarn.mockRestore();
        });

        test('39. should warn and return if app_user_id is missing', async () => {
            const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();
            await service.processRevenueCatWebhook({ event: { type: 'INITIAL_PURCHASE' } });
            expect(consoleWarn).toHaveBeenCalledWith('Webhook event missing app_user_id');
            consoleWarn.mockRestore();
        });

        test('40. should set isSubscribed to true for INITIAL_PURCHASE', async () => {
            const mockUpdate = jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValue(true);
            await service.processRevenueCatWebhook({ event: { app_user_id: 'user-1', type: 'INITIAL_PURCHASE' } });
            expect(mockUpdate).toHaveBeenCalledWith(
                { uid: 'user-1' },
                { $set: { isSubscribedUser: true } },
                { new: true }
            );
        });

        test('41. should set isSubscribed to true for RENEWAL', async () => {
            const mockUpdate = jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValue(true);
            await service.processRevenueCatWebhook({ event: { app_user_id: 'user-2', type: 'RENEWAL' } });
            expect(mockUpdate).toHaveBeenCalledWith(
                { uid: 'user-2' },
                { $set: { isSubscribedUser: true } },
                { new: true }
            );
        });

        test('42. should set isSubscribed to false for EXPIRATION', async () => {
            const mockUpdate = jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValue(true);
            await service.processRevenueCatWebhook({ event: { app_user_id: 'user-3', type: 'EXPIRATION' } });
            expect(mockUpdate).toHaveBeenCalledWith(
                { uid: 'user-3' },
                { $set: { isSubscribedUser: false } },
                { new: true }
            );
        });

        test('43. should log and return for CANCELLATION without updating', async () => {
            const mockUpdate = jest.spyOn(UserModel, 'findOneAndUpdate');
            const consoleLog = jest.spyOn(console, 'log').mockImplementation();

            await service.processRevenueCatWebhook({ event: { app_user_id: 'user-4', type: 'CANCELLATION' } });

            expect(mockUpdate).not.toHaveBeenCalled();
            expect(consoleLog).toHaveBeenCalledWith('Received CANCELLATION event for user user-4. No status update needed.');

            consoleLog.mockRestore();
        });

        test('44. should warn if user is not found during update', async () => {
            const mockUpdate = jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValue(null);
            const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();

            await service.processRevenueCatWebhook({ event: { app_user_id: 'user-not-found', type: 'RENEWAL' } });

            expect(consoleWarn).toHaveBeenCalledWith('User with uid user-not-found not found when processing webhook.');
            consoleWarn.mockRestore();
        });

        test('45. should log error if update fails', async () => {
            const mockUpdate = jest.spyOn(UserModel, 'findOneAndUpdate').mockRejectedValue(new Error('DB Error'));
            const consoleError = jest.spyOn(console, 'error').mockImplementation();

            await service.processRevenueCatWebhook({ event: { app_user_id: 'user-1', type: 'RENEWAL' } });

            expect(consoleError).toHaveBeenCalled();
            consoleError.mockRestore();
        });
    });
});
