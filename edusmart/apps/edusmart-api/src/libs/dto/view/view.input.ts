import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class ViewInput {
	@IsNotEmpty()
	viewRefId: ObjectId;
	@IsNotEmpty()
	memberId: ObjectId;
	@IsNotEmpty()
	viewGroup: string;
}
