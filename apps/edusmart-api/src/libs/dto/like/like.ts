
import { ObjectId } from 'mongoose';
import { LikeGroup } from '../../enums/like.enum';


export class MeLiked {
	memberId: ObjectId;
	likeRefId: ObjectId;
	myFavorite: boolean;
}


export class Like {
	_id: ObjectId;
	likeGroup: LikeGroup;
	likeRefId: ObjectId;
	memberId: ObjectId;
	createdAt: Date;
	updatedAt: Date;
}


