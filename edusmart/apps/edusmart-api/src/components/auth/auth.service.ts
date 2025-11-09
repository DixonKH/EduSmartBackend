import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { T } from '../../libs/types/common';
import { Member } from '../../libs/dto/member/member';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberAuthType, MemberStatus } from '../../libs/enums/member.enum';
import { MemberInput } from '../../libs/dto/member/member.input';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		private jwtService: JwtService,
	) {}

	public async hashPassword(memberPassword: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		return await bcrypt.hash(memberPassword, salt);
	}

	public async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
		return await bcrypt.compare(password, hashedPassword);
	}

	public async createToken(member: Member): Promise<string> {
		const payload: T = {};
		Object.keys(member['_doc'] ? member['_doc'] : member).map((ele) => {
			payload[`${ele}`] = member[`${ele}`];
		});

		delete payload.memberPassword;
		return await this.jwtService.signAsync(payload);
	}

	public async verifyToken(token: string): Promise<Member> {
		const member = await this.jwtService.verifyAsync(token);
		member._id = shapeIntoMongoObjectId(member._id);
		return member;
	}

	public async googleLogin(user: MemberInput): Promise<Member> {
		const { memberEmail, memberNick, memberFullName, memberImage, memberType, memberPassword } = user;

		// Foydalanuvchini email orqali tekshirish
		let existingMember = await this.memberModel.findOne({ memberNick }).exec();

		if (!existingMember) {
			// Yangi foydalanuvchini yaratish
			existingMember = await this.memberModel.create({
				memberNick,
				memberEmail,
				memberFullName,
				memberPassword,
				memberImage,
				memberAuthType: MemberAuthType.EMAIL,
				memberStatus: MemberStatus.ACTIVE,
				memberType
			});
		}

		// JWT token yaratish
		const memberWithToken = existingMember.toObject();
		memberWithToken.accessToken = await this.createToken(memberWithToken);

		return memberWithToken;
	}
}
