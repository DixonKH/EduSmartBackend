
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
import { LikeGroup } from '../../enums/like.enum';


export class LikeInput {
	@IsNotEmpty()
	memberId: ObjectId;

	@IsNotEmpty()
	likeRefId: ObjectId;

	@IsNotEmpty()
	likeGroup: LikeGroup;
}
