import { BugReportService } from '../../services/bug-report.service';
import { IBugReportRepository } from '../../repositories/bug-report.repository';
import { CreateBugReportDto } from '../../dtos/bug-report.dto';

describe('BugReportService', () => {
    let mockRepository: jest.Mocked<IBugReportRepository>;
    let service: BugReportService;

    beforeEach(() => {
        mockRepository = {
            createAReport: jest.fn(),
            resolveBug: jest.fn(),
            getAllReports: jest.fn(),
            deleteBugReport: jest.fn(),
            getUsersBugReports: jest.fn(),
            getReportById: jest.fn(),
            updateStatus: jest.fn(),
        } as unknown as jest.Mocked<IBugReportRepository>;

        service = new BugReportService(mockRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createReport', () => {
        test('13. should create a bug report successfully', async () => {
            const payload: CreateBugReportDto = {
                reportDescription: 'App crashed',
                problemType: 'Crash',
                reportedBy: 'user@example.com',
                screenshotUrl: 'http://example.com/screenshot.png',
            };

            mockRepository.createAReport.mockResolvedValue(payload as any);

            const result = await service.createReport(payload);

            expect(mockRepository.createAReport).toHaveBeenCalledWith({
                ...payload,
                reportId: 'test-uuid-1234-5678-90ab-cdef',
                isResolved: false,
                status: 'open',
            });
            expect(result).toBeDefined();
        });

        test('14. should throw validation error if reportDescription is missing', async () => {
            const payload = {
                problemType: 'Crash',
                reportedBy: 'user@example.com',
            } as CreateBugReportDto;

            await expect(service.createReport(payload)).rejects.toThrow();
            expect(mockRepository.createAReport).not.toHaveBeenCalled();
        });

        test('15. should throw validation error if problemType is missing', async () => {
            const payload = {
                reportDescription: 'App crashed',
                reportedBy: 'user@example.com',
            } as CreateBugReportDto;

            await expect(service.createReport(payload)).rejects.toThrow();
        });

        test('16. should handle default screenshotUrl if not provided', async () => {
            const payload = {
                reportDescription: 'App crashed',
                problemType: 'Crash',
                reportedBy: 'user@example.com',
            } as CreateBugReportDto;

            mockRepository.createAReport.mockResolvedValue(payload as any);

            await service.createReport(payload);

            expect(mockRepository.createAReport).toHaveBeenCalledWith(expect.objectContaining({
                screenshotUrl: '',
            }));
        });
    });
});
