import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, Length, Matches, Min, ValidateIf } from 'class-validator';
import { MemberAuthType, MemberCategory, MemberStatus, MemberType } from '../../enums/member.enum';
import { availableAgentSorts, availableMemberSorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import { Type } from 'class-transformer';
const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class MemberInput {
	@ValidateIf((obj) => obj.memberAuthType !== 'EMAIL') 
	@IsNotEmpty()
    @Length(3, 12)
	memberNick: string;

	@IsNotEmpty()
	@ValidateIf((obj) => obj.memberAuthType !== 'EMAIL') 
	@Matches(passwordRegEx, {
		message: `Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.`,
	})
	memberPassword: string;

	@IsNotEmpty()
	@ValidateIf((obj) => obj.memberAuthType !== 'EMAIL') 
	memberPhone: string;

	@IsOptional()
	memberType?: MemberType;

	@IsOptional()
	memberAuthType?: MemberAuthType;
  
	@IsOptional()
     memberCategory?:MemberCategory;

  @IsOptional()
  memberFullName?: string;

  @IsOptional()
  	@IsEmail()
  memberEmail?:string

  @IsOptional()
  memberImage?: string;

  @IsOptional()
  memberAddress?: string;

  @IsOptional()
  memberDesc?: string;

  @IsOptional()
  memberExperience?: string;

  @IsOptional()
  memberLocation?: string;

  @IsOptional()
  memberLinks?: {
	    telegram?: string,
        instagram?: string,
        youtube?: string
  };

}

export class LoginInput {
	@IsNotEmpty()
	@Length(3, 12)
	memberNick: string;

	@IsNotEmpty()
	@Length(5, 12)
	memberPassword: string;
}


class AISearch {
	@IsOptional()
	text?: string
}
export class AgentsInquiry {
	@IsNotEmpty()
	@Type(() => Number)	
	@Min(1)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Type(() => Number)	
	limit: number;

	@IsOptional()
	@IsIn(availableAgentSorts)
	sort?: string;

	@IsOptional()
    @IsEnum(Direction) // `Direction` enum tipi uchun validatsiya
	@Type(() => Number)
    direction?: Direction;

	@IsOptional() 
	search: AISearch


	
}


class MISearch {
	@IsOptional()
	memberStatus?: MemberStatus;

	@IsOptional()
	memberType?: MemberType;

	@IsOptional()
	text?: string;
}
export class MembersInquiry {
	@IsNotEmpty()
	@Type(() => Number)	
	@Min(1)
	page: number;

	@IsNotEmpty()
	@Type(() => Number)	
	@Min(1)
	limit: number;

	@IsOptional()
	@IsIn(availableMemberSorts)
	sort?: string;

	@IsOptional()
	@Type(() => Number)
	direction?: Direction;

	@IsOptional() 
	search: MISearch;
}