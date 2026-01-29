import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller';
import { MemberModule } from '../member/member.module';
import { MemberService } from '../member/member.service';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';

@Module({
	imports: [
		HttpModule,
		JwtModule.register({
			secret: `${process.env.SECRET_TOKEN}`,
			signOptions: { expiresIn: '30d' },
		}),   MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
	],
	providers: [AuthService, GoogleStrategy,MemberService],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
