import { DeletedUserRepository, IDeletedUserRepository } from "../../repositories/deleted-user.repository";

export class AdminDeletedUserService {
    private deletedUserRepository: IDeletedUserRepository;

    constructor(deletedUserRepository: IDeletedUserRepository = new DeletedUserRepository()) {
        this.deletedUserRepository = deletedUserRepository;
    }

    async getAllDeletedUsers(page?: string, size?: string, searchTerm?: string) {
        const currentPage = page ? parseInt(page, 10) : 1;
        const pageSize = size ? parseInt(size, 10) : 10;

        const { deletedUsers, total } = await this.deletedUserRepository.getAllDeletedUsers(currentPage, pageSize, searchTerm);

        const pagination = {
            page: currentPage,
            size: pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        };

        return { deletedUsers, pagination };
    }
}
