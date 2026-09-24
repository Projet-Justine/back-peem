import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostTarget, PostComment, PostLike, User } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostTarget, PostComment, PostLike, User])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
