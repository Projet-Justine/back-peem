import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { entities } from './entities';

import { AuthModule } from './modules/auth/auth.module';
import { AcademicModule } from './modules/academic/academic.module';
import { GradesModule } from './modules/grades/grades.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ChatModule } from './modules/chat/chat.module';
import { PostsModule } from './modules/posts/posts.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { FilesModule } from './modules/files/files.module';
import { SocialModule } from './modules/social/social.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'hackermode'),
        database: configService.get<string>('DB_DATABASE', 'plateforme'),
        entities: entities,
        synchronize: true, // TypeORM auto sync
        logging: false,
      }),
    }),
    AuthModule,
    AcademicModule,
    GradesModule,
    GroupsModule,
    ChatModule,
    PostsModule,
    MeetingsModule,
    FilesModule,
    SocialModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
