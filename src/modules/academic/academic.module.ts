import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';
import { UE, MatiereEC, Enrollment } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([UE, MatiereEC, Enrollment])],
  controllers: [AcademicController],
  providers: [AcademicService],
  exports: [AcademicService],
})
export class AcademicModule {}
