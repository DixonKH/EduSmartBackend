import { IsOptional, IsString, IsNotEmpty, Length, Matches, IsEmail } from 'class-validator';
import { ObjectId } from 'mongoose';
import { MemberCategory } from '../../enums/member.enum';

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class MemberUpdate {
	@IsOptional() // Make _id optional since it is already handled in the AuthGuard
	@IsString()
	_id?: ObjectId;

	@IsOptional()
	memberPhone?: string;

	@IsOptional()
	@IsString()
	@Length(3, 12, { message: 'Nickname must be between 3 and 12 characters' })
	memberNick?: string;

	@IsOptional()
	@IsString()
	memberFullName?: string;

	@IsOptional()
	@IsEmail()
	memberEmail?: string;

	@IsOptional()
	@IsString()
	memberCategory?: MemberCategory;

	@IsOptional()
	@IsString()
	memberImage?: string;

	@IsOptional()
	@IsString()
	memberAddress?: string;

	@IsOptional()
	@IsString()
	memberDesc?: string;

	@IsOptional()
	@IsString()
	memberExperience?: string;

	@IsOptional()
	@IsString()
	memberLocation?: string;

	@IsOptional()
	@IsString()
	memberLinks?: {
		telegram?: string,
        instagram?: string,
        youtube?: string
	};

	@IsOptional()
	@IsString()
	memberLessons?: string;

	@IsOptional()
	@IsString()
	memberArticles?: string;

	deletedAt?: Date;
}
