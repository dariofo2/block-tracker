import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/controllers/users/dto/create-user.dto";
import { UpdateUserDto } from "src/controllers/users/dto/update-user.dto";
import { User } from "src/controllers/users/entities/user.entity";
import { ListRequestDatatablesDTO } from "src/database/dto/listRequestDatatables.dto";
import { ListResponseDatatablesDTO } from "src/database/dto/listResponseDatatables.dto";
import { DataSource, Equal, Repository } from "typeorm";

@Injectable()
export default class UsersRepository {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    async create (createUserDTO: CreateUserDto) : Promise<User> {
        const userCreated=await this.userRepository.save(createUserDTO);
        return userCreated;
    } 

    async update (updateUserDTO: UpdateUserDto) : Promise<User> {
        const userUpdated= await this.userRepository.save(updateUserDTO);
        return userUpdated
    }

    async delete(id: number) {
        const userDeleted= await this.userRepository.delete({
            id: Equal(id)
        });
        return userDeleted.raw;
    }

    // Selects

    async get(id: number) : Promise<User|null> {
        const user=await this.userRepository.findOne({
            where: {
                id: Equal(id)
            }
        })
        return user;
    }

    async getByEmailOrFail(email: string) : Promise<User> {
        try {
            const user=await this.userRepository.findOneOrFail({
                where: {
                    email: Equal(email)
                }
            })
            return user;
        } catch (error) {
            console.error(error);
            throw new BadRequestException("User Not Found");
        }

    }

    async list(listRequestDatatablesDTO: ListRequestDatatablesDTO): Promise<ListResponseDatatablesDTO<User>> {
            const listTransactions = await this.dataSource.createQueryBuilder()
                .select("users")
                .from(User, "users")
                .where("users.id like :search OR users.name like :search OR users.surname like :search OR users.email like :search OR users.role like :search", { search: listRequestDatatablesDTO.searchValue })
                .orderBy(listRequestDatatablesDTO.orderName, listRequestDatatablesDTO.orderDirection as "ASC" | "DESC")
                .limit(listRequestDatatablesDTO.limit)
                .offset(listRequestDatatablesDTO.offset)
                .getManyAndCount()
    
            const responseListDTO: ListResponseDatatablesDTO<User> = {
                draw: listRequestDatatablesDTO.draw,
                data: listTransactions[0],
                recordsFiltered: listTransactions[1],
                recordsTotal: await this.userRepository.count()
            }
    
            //const listAccountsResponse=await this.accountsRepository.find();
            return responseListDTO;
        }
}