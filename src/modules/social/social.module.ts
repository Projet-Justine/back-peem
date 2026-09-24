import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import {
  Friendship,
  WallPost,
  Story,
  SocialPage,
  SocialEvent,
  Listing,
  QAQuestion,
  QAAnswer,
  SharedResource,
  User,
  Profile,
} from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Friendship,
      WallPost,
      Story,
      SocialPage,
      SocialEvent,
      Listing,
      QAQuestion,
      QAAnswer,
      SharedResource,
      User,
      Profile,
    ]),
  ],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
