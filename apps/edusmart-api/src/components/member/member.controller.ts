import { Controller, Post, Body, Get, UseGuards, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { MemberService } from './member.service';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/auth.member.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { getMulterUploader } from '../../libs/utils/uploader';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('member')
export class MemberController {
	constructor(private readonly memberService: MemberService) {}

	@Post('signup')
	public async signup(@Body() input: MemberInput): Promise<Member> {
		console.log('POST: memberSignup:');
		return await this.memberService.signup(input);
	}

	@Post('login')
	public async login(@Body() input: LoginInput): Promise<Member> {
		console.log(' POST: memberLogin');
		return await this.memberService.login(input);
	}

	@Post('updateMember')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('memberImage', getMulterUploader('member')))
	public async updateMember(
		@AuthMember('_id') memberId: ObjectId,
		@Body() input: MemberUpdate,
		@UploadedFile() file: Express.Multer.File,
	): Promise<Member> {
		console.log('POST: updateMember');

		delete input._id;
		if (!memberId) {
			throw new Error('Member ID is required!');
		}

		if (file) {
			const cloudinaryFile = file as any;
			input.memberImage = cloudinaryFile.secure_url || cloudinaryFile.path;
		}
		//   console.log(`req:${input}`)
		return await this.memberService.updateMember(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Get('checkAuth')
	public async checkAuth(@AuthMember('_id') authMember: Member): Promise<Member> {
		console.log('GET: checkAuth');
		console.log('memberNick', authMember);

		return await this.memberService.getCurrentMember(authMember._id);
	}
	@Roles(MemberType.STUDENT, MemberType.TEACHER)
	@UseGuards(RolesGuard)
	@Get('checkAuthRoles')
	public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
		console.log('GET: checkAuthRoles');
		return `Hi ${authMember.memberNick} you are ${authMember.memberType} (memberId) ${authMember._id}`;
	}
	@UseGuards(WithoutGuard)
	@Get('getMember')
	public async getMember(@Query() input: string, @AuthMember('_id') memberId: ObjectId): Promise<Member> {
		console.log('GET: getMember');
		const targetId = shapeIntoMongoObjectId(input);
		return await this.memberService.getMember(memberId, targetId);
	}
	@UseGuards(WithoutGuard)
	@Get('getTeachers')
	public async getAgents(@Query() input: AgentsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Members> {
		console.log('GET: getTeachers');
		return await this.memberService.getAgents(memberId, input);
	}

	/**ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Get('getAllMembersAdmin')
	public async getAllMembersByAdmin(@Query() input: MembersInquiry): Promise<Members> {
		console.log('POST: getAllMembersByAdmin');
		return await this.memberService.getAllMembersByAdmin(input);
	}
	//Authorization : ADMIN
	@Roles(MemberType.ADMIN)
	@Post('updateMembersAdmin')
	public async updateMemberByAdmin(@Body() input: any): Promise<Member> {
		console.log('POST: updateMemberByAdmin');
		return await this.memberService.updateMemberByAdmin(input);
	}
}
