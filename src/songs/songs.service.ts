import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDTO } from './dto/update-song-dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';

@Injectable()
export class SongsService {
    constructor( 
        @InjectRepository(Song)
        private songRepository: Repository<Song>) {}
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>
        // private readonly songs = []

    async create(createSongDTO: CreateSongDTO): Promise<Song> {
        const song = new Song();
        song.title = createSongDTO.title;
        song.artists = createSongDTO.artists;
        song.duration = createSongDTO.duration;
        song.lyrics = createSongDTO.lyrics;
        song.releasedDate = createSongDTO.releasedDate;
        
        console.log(createSongDTO.artists)
        // find all the artists based on ids
        const artists = await this.artistRepository.findByIds(createSongDTO.artists)
        // set relation with artists and songs
        song.artists = artists
        return await this.songRepository.save(song);
    }

    findAll(): Promise<Song[]> {
        return this.songRepository.find();
    }

    async findOne(id: number): Promise<Song> {
        const song = await this.songRepository.findOneBy({id});
        if (!song) {
            throw new Error(`Song with id ${id} not found`);
        }
        return song;
    }

    async remove(id: number): Promise<DeleteResult> {
        return await this.songRepository.delete(id);
    }

    update(id: number, updateSongDTO: UpdateSongDTO): Promise<UpdateResult> {
        return this.songRepository.update(id, updateSongDTO)
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Song>>{
        const queryBuilder = this.songRepository.createQueryBuilder('c')
        queryBuilder.orderBy('c.releasedDate', 'DESC')
        return paginate<Song>(queryBuilder, options)
    }
}
