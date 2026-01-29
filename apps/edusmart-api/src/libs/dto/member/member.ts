import { ObjectId } from 'mongoose';
import { MemberAuthType, MemberCategory, MemberStatus, MemberType } from '../../enums/member.enum';

export class Member {
	_id: ObjectId;
	memberType: MemberType;
	memberStatus: MemberStatus;
	memberAuthType: MemberAuthType;
	memberCategory?: MemberCategory;
	memberPhone: string;
	memberNick: string;
	memberPassword?: string;
	memberFullName?: string;
	memberEmail: string;
	memberImage: string;
	memberAddress?: string;
	memberDesc?: string;
	memberExperience?: string;
	memberLocation?: string;
	memberLinks?: {
		telegram?: string;
		instagram?: string;
		youtube?: string;
	};
	memberLessons?: string;
	memberArticles?: string;
	deletedAt: Date;
	createdAt: Date;
	accessToken?: string;
}

export class TotalCounter {
	total: number;
}

export class Members {
	list: Member[];
	metaCounter: TotalCounter[];
}
