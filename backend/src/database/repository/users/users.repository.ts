import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/controllers/users/dto/create-user.dto";
import { UpdateUserDto } from "src/controllers/users/dto/update-user.dto";
import { User } from "src/controllers/users/entities/user.entity";
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

    async list () : Promise<User[]> {
        const users=await this.userRepository.find();
        return users
    }
}