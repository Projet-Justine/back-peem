import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import {
  Evaluation,
  Grade,
  ResultatUE,
  GradeHistory,
  Claim,
  UE,
  User,
} from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Evaluation,
      Grade,
      ResultatUE,
      GradeHistory,
      Claim,
      UE,
      User,
    ]),
  ],
  controllers: [GradesController],
  providers: [GradesService],
  exports: [GradesService],
})
export class GradesModule {}
