

import { Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { CreateUserDTO } from "./dto/create-user-dto";
import * as bcrypt from 'bcryptjs'
import { throwError } from "rxjs";
import { LoginDTO } from "src/auth/dto/login.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { v4 as uuid4 } from "uuid";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async create(createUserDTO: CreateUserDTO): Promise<Omit<User, 'password'>> {
        const user = new User();
        user.firstName = createUserDTO.firstName
        user.lastName = createUserDTO.lastName
        user.email = createUserDTO.email
        user.apiKey = uuid4();
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(createUserDTO.password, salt);
        await this.userRepository.save(user);
        const { password, ...result } = user; // Exclude the password
        return result; // Return the user without the password field
    }
    

    async findOne(data: LoginDTO): Promise<User> {
        const user = await this.userRepository.findOneBy({email: data.email});
        if(!user) {
            throw new UnauthorizedException('Could not find user')
        }
        return user
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({id: id});
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    async updateSecretKey(userId, secret: string): Promise<UpdateResult> {
        return this.userRepository.update(
            {
                id: userId
            },
            {
                twoFASecret: secret,
                enable2FA: true
            }
        )
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.userRepository.update(
            {id: userId},
            {
                enable2FA: false,
                twoFASecret: ''
            }
        )
    }

    async findUserByApiKey(apiKey: string): Promise<User> {
        const user = await this.userRepository.findOneBy({apiKey});
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
    
}


