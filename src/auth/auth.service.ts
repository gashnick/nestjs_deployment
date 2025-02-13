
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcryptjs'
import { ArtistsService } from 'src/artists/artists.service';
import { Enable2FAType, PayLoadType } from './types';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy'
import { UpdateResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService, 
        private jwtService: JwtService,
        private artistsService: ArtistsService,
        private configService: ConfigService
    ){}


    async login(loginDTO: LoginDTO): Promise<{accessToken: string}| {validate2FA: string; message: string}> {
        const user = await this.usersService.findOne(loginDTO);
        if (!loginDTO.password || !user.password) {
            throw new Error('Password is missing');
        }
        const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);
        if (passwordMatched) {
            delete user.password
            // create a payload object
            const payload: PayLoadType = { email: user.email, userId: user.id};
            const artist = await this.artistsService.findArtist(user.id)
            // console.log("Artist found:", artist);
            // console.log("Artist's user:", artist?.user);
            if(artist) {
                payload.artistId = artist.id
            }
            if(user.enable2FA && user.twoFASecret) {
                // send the validateToken request link
                //else otherwise sends a json web token in the response

                return {
                    validate2FA: 'http://localhost:3000/auth/validate-2fa',
                    message: 'Please send one time password token from google authenticator app'
                }
            }
            return {
                accessToken: this.jwtService.sign(payload)
            }
        } else {
            throw new UnauthorizedException('Password do not match')
        }
    }

    async enable2FA(userId: number): Promise<Enable2FAType> {
        const user = await this.usersService.findById(userId);
        if(user.enable2FA) {
            return {secret: user.twoFASecret};
        }
        const secret = speakeasy.generateSecret();
        console.log(secret)
        user.twoFASecret = secret.base32
        //user.enable2FA = true
        await this.usersService.updateSecretKey(user.id, user.twoFASecret);
        return {secret: user.twoFASecret}
    }

    async validate2FAToken(userId: number, token: string): Promise<{verified: boolean}> {
        try {
            // find user based on id
            const user = await this.usersService.findById(userId)

            // extract the user 2FA secret

            // Verify the secret with token by calling the speakeasy verify method
            const verified = speakeasy.totp.verify({
                secret: user.twoFASecret,
                token: token,
                encoding: 'base32'
            });

            //if validated then send the json web token in the response
            if(verified){
                return {verified: true}
            } else {
                return {verified: false}
            }
        } catch (error) {
            throw new UnauthorizedException('Error verifying token')
        }
        
    }
    
    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.usersService.disable2FA(userId);
    }

    async validateUserByApiKey(apiKey: string): Promise<User> {
        return this.usersService.findUserByApiKey(apiKey)
    }

    async getEnvVariable() {
        return this.configService.get<number>('port')
    }
}
