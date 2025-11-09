import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),AuthModule 
],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService]
})
export class MemberModule {
    
}
