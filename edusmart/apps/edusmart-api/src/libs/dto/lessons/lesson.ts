import { ObjectId } from 'mongoose';
import { LessonCategory, LessonLevel, LessonStatus } from '../../enums/lesson.enum';
import { MeLiked } from '../like/like';
import { Member, TotalCounter } from '../member/member';

export class Lesson {
	_id: ObjectId;
	lessonCategory: LessonCategory;
	lessonLevel: LessonLevel;
	lessonStatus: LessonStatus;
	lessonTitle: string;
	lessonVideo: string;
	lessonDesc: string;
	lessonViews: number;
	lessonLikes: number;
	lessonComments: number;
	memberId: ObjectId;
	createdAt: Date;
	updatedAt: Date;

	/** from aggregation **/

	meLiked?: MeLiked[];
	memberData?: Member;
}

export class Lessons {
	list: Lesson[];
	metaCounter: TotalCounter[];
}
