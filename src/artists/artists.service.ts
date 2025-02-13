import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
    constructor(
        @InjectRepository(Artist)
        private artistRepo: Repository<Artist>
    ){}

    async findArtist(userId: number): Promise<Artist | null> {
        const artist = await this.artistRepo.findOne({
            where: { user: { id: userId } },
            relations: ['user'], // Ensure it loads the user relation
        });
    
        // console.log("Retrieved artist:", artist); // Debugging
        return artist;
    }
}
