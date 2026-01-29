import { Schema } from 'mongoose';
import { MemberAuthType, MemberCategory, MemberStatus, MemberType } from '../libs/enums/member.enum';

const MemberSchema = new Schema(
	{
		memberType: {
			type: String,
			enum: MemberType,
			default: MemberType.STUDENT,
		},

		memberStatus: {
			type: String,
			enum: MemberStatus,
			default: MemberStatus.ACTIVE,
		},

		memberAuthType: {
			type: String,
			enum: MemberAuthType,
			default: MemberAuthType.TELEGRAM,
		},
		memberCategory: {
			type: String,
			enum: MemberCategory,
		},

		memberPhone: {
			type: String,
			index: { unique: true, sparse: true },
			required: function () {
				return this.memberAuthType !== 'EMAIL';
			},
		},

		memberNick: {
			type: String,
			index: { unique: true, sparse: true },
			required: function () {
				return this.memberAuthType !== 'EMAIL';
			},
		},

		memberPassword: {
			type: String,
			select: false,
			required: function () {
				return this.memberAuthType !== 'EMAIL';
			},
		},
		memberEmail: {
			type: String,
		},

		memberFullName: {
			type: String,
		},

		memberImage: {
			type: String,
			default: '',
		},

		memberAddress: {
			type: String,
		},

		memberDesc: {
			type: String,
		},

		memberExperience: {
			type: String,
		},

		memberLocation: {
			type: String,
		},

		memberLinks: {
			type: Map,
			of: String, // Ensures each member link is a string
			default: {
				telegram: '',
				instagram: '',
				youtube: '',
			},
		},

		memberLessons: {
			type: Number,
			default: 0,
		},

		memberArticles: {
			type: Number,
			default: 0,
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'members' },
);

export default MemberSchema;
