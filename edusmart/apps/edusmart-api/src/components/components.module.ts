import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { LessonsService } from './lessons/lessons.service';
import { LessonsController } from './lessons/lessons.controller';
import { LessonsModule } from './lessons/lessons.module';
@Module({
  imports: [MemberModule, AuthModule, BoardArticleModule, LessonsModule],
})
export class ComponentsModule {}
