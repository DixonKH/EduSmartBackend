import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonsSchema } from '../../schemas/Lesson.model';
import { MemberModule } from '../member/member.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [
		MongooseModule.forFeature([{ name: 'Lessons', schema: LessonsSchema }]),
    AuthModule,
		ViewModule,
		MemberModule,
		LikeModule
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
