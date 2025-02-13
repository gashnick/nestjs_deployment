import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { useContainer } from "class-validator";
import { UserController } from "./users.controller";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    controllers: [UserController],
    exports: [UsersService]
}) 
export class UserModule{}