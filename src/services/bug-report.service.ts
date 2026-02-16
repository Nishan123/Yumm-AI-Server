import { BugReportRepository, IBugReportRepository } from "../repositories/bug-report.repository";
import { CreateBugReportDto } from "../dtos/bug-report.dto";
import { BugReportType } from "../types/bug-report.type";
import { v4 as uuidv4 } from "uuid";

export class BugReportService {
    private bugReportRepository: IBugReportRepository;

    constructor(bugReportRepository: IBugReportRepository = new BugReportRepository()) {
        this.bugReportRepository = bugReportRepository;
    }

    async createReport(payload: CreateBugReportDto): Promise<BugReportType> {
        const validatedData = CreateBugReportDto.parse(payload);

        const reportToCreate: BugReportType = {
            ...validatedData,
            reportId: uuidv4(),
            isResolved: false
        };

        return this.bugReportRepository.createAReport(reportToCreate);
    }
}
