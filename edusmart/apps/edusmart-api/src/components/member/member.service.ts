import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Member, Members } from '../../libs/dto/member/member';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { MemberAuthType, MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { StatisticModifier, T } from '../../libs/types/common';

@Injectable()
export class MemberService {
	constructor(
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		private readonly authService: AuthService,
	) {}
	public async googleSignupOrLogin(input: MemberInput): Promise<Member> {
		try {
			// AuthService orqali Google login yoki signupni boshqarish
			const member = await this.authService.googleLogin(input);
			return member;
		} catch (error) {
			console.error('Google signup/login error:', error);
			throw new InternalServerErrorException('Google login error.');
		}
	}

	public async signup(input: MemberInput): Promise<Member> {
		// TODO: Hash password
		input.memberPassword = await this.authService.hashPassword(input.memberPassword);
		try {
			if (input.memberType === MemberType.ADMIN) {
				const admin = await this.memberModel.findOne({ memberType: input.memberType }).exec();
				if (admin) {
					throw new BadRequestException(Message.USED_ADMIN);
				}
			}
			const result = await this.memberModel.create(input);
			const memberWithToken = result.toObject();
			// `accessToken`ni yaratish
			memberWithToken.accessToken = await this.authService.createToken(memberWithToken);
			// Parolni tozalash
			memberWithToken.memberPassword = '';

			// Javob qaytarish
			return memberWithToken;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
		}
	}
	public async login(input: LoginInput): Promise<any> {
		const { memberNick, memberPassword } = input;
		const response = await this.memberModel.findOne({ memberNick: memberNick }).select('+memberPassword').exec();

		if (!response || response.memberStatus === MemberStatus.DELETE) {
			throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
		} else if (response.memberStatus === MemberStatus.BLOCK) {
			throw new InternalServerErrorException(Message.BLOCKED_USER);
		}

		// Parolni solishtirish
		const isMatch = await this.authService.comparePasswords(input.memberPassword, response.memberPassword);
		if (!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD);

		// accessToken yaratish
		const result = response.toObject();
		result.accessToken = await this.authService.createToken(result);

		// Parolni javobdan o'chirish
		delete result.memberPassword;

		return result; // Faqat kerakli ma'lumot qaytariladi
	}

	public async updateMember(memberId: ObjectId, input: MemberUpdate): Promise<Member> {
		console.log('input:', input);
		console.log('Received member ID in service:', memberId);
		
		if (input.memberLinks && typeof input.memberLinks === 'string') {
			try {
				input.memberLinks = JSON.parse(input.memberLinks);
			} catch (error) {
				console.error('Failed to parse memberLinks:', error);
				throw new InternalServerErrorException('Failed to parse memberLinks');
			}
		}
		console.log('Input data for update:', input);

		const result: Member = await this.memberModel
			.findOneAndUpdate(
				{
					_id: memberId,
					memberStatus: MemberStatus.ACTIVE,
				},
				input,
				{ new: true },
			)
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		result.accessToken = await this.authService.createToken(result);
		return result;
	}

	public async getCurrentMember(memberId: ObjectId): Promise<Member> {
		const result = await this.memberModel
			.findOne({
				_id: memberId,
				memberStatus: MemberStatus.ACTIVE,
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result;
	}

	public async getMember(memberId: ObjectId, targetId: ObjectId): Promise<Member> {
		const search: T = {
			_id: targetId,
			memberStatus: {
				$in: [MemberStatus.ACTIVE, MemberStatus.BLOCK],
			},
		};
		const targetMember = await this.memberModel.findOne(search).exec();
		if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return targetMember;
	}

	public async getAgents(memberId: ObjectId, input: AgentsInquiry): Promise<Members> {
		const { text } = input.search || {};
		const match: T = { memberType: MemberType.TEACHER, memberStatus: MemberStatus.ACTIVE };

		// `Direction` enumdan foydalanish va fallback qiymat
		const sortDirection: Direction =
			input.direction === Direction.ASC || input.direction === Direction.DESC ? input.direction : Direction.DESC;

		const sort: T = { [input?.sort ?? 'createdAt']: sortDirection };

		if (text) match.memberNick = { $regex: new RegExp(text, 'i') };
		console.log('match', match);

		const result = await this.memberModel
			.aggregate([
				{ $match: match },
				{ $sort: sort }, // To'g'ri `sort` qiymati
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async getAllMembersByAdmin(input: MembersInquiry): Promise<Members> {
		const { text, memberStatus, memberType } = input.search || {};
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
		if (memberStatus) match.memberStatus = memberStatus;
		if (memberType) match.memberType = memberType;

		if (text) match.memberNick = { $regex: new RegExp(text, 'i') };
		console.log('match', match);

		const result = await this.memberModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}
	public async updateMemberByAdmin(input: MemberUpdate): Promise<Member> {
		const result: Member = await this.memberModel.findOneAndUpdate({ _id: input._id }, input, { new: true }).exec();
		if(!result) { 
			console.error(`Member not found or update failed for ID: ${input._id}`);
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		 }
		return result;
	}

	public async memberStatsEditor(input: StatisticModifier): Promise<Member> {
		const { _id, targetKey, modifier } = input;
		return await this.memberModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}
}
