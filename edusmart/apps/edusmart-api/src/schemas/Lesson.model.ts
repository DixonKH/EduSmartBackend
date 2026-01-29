import { Schema } from "mongoose";
import { LessonCategory, LessonLevel, LessonStatus } from "../libs/enums/lesson.enum";

export const LessonsSchema = new Schema(
	{
		lessonCategory: {
			type: String,
			enum: LessonCategory,
			required: true,
		},

		lessonLevel: {
			type: String,
			enum: LessonLevel,
			required: true,
		},

        lessonStatus: {
            type: String,
			enum: LessonStatus,
			default: LessonStatus.ACTIVE,
        },

        lessonTitle: {
            type: String,
            required: true,
        },

        lessonDesc: {
            type: String,
            required: true,
        },

        lessonLikes: {
			type: Number,
			default: 0,
		},

        lessonViews: {
			type: Number,
			default: 0,
		},

        lessonComments: {
            type: Number,
			default: 0,
        },

		lessonVideo: {
			type: String
		},

        memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

	},
	{ timestamps: true, collection: 'lessons' },
);