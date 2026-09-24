import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { entities } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
