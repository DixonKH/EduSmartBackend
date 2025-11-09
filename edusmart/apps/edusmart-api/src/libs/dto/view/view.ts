import { ObjectId } from 'mongoose';
import { ViewGroup } from '../../enums/view.enum';

export class View {
	_id: ObjectId;
	viewGroup: ViewGroup;
	viewRefId: ObjectId;
	memberId: ObjectId;
	createdAt: Date;
	updatedAt: Date;
}
