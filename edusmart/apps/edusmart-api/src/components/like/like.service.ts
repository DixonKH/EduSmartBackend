import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { Model, ObjectId } from 'mongoose';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { OrdinaryInquiry } from '../../libs/dto/lessons/lessons.input';
import { Lesson, Lessons } from '../../libs/dto/lessons/lesson';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavourite } from '../../libs/config';

@Injectable()
export class LikeService {
	constructor(@InjectModel('Like') private readonly likeModel: Model<Like>) {}
	public async toggleLike(input: LikeInput): Promise<number> {
		const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
			exist = await this.likeModel.findOne(search).exec();
		let modifier = 1;

		if (exist) {
			await this.likeModel.findOneAndDelete(search).exec();
			modifier = -1;
		} else {
			try {
				await this.likeModel.create(input);
			} catch (err) {
				console.log('Error, Service.Model', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}
		console.log(` - Like modifier ${modifier} -`);
		return modifier;
	}

	public async checkLikeExistence(input): Promise<MeLiked[]> {
		const { memberId, likeRefId } = input;
		const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();
		return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
	}

	public async getFavoriteLessons(memberId, input: OrdinaryInquiry): Promise<Lessons> {
		const { page, limit } = input;
        const match: T = {likeGroup: LikeGroup.LESSON, memberId: memberId};

		const data: T = await this.likeModel.aggregate([
			{$match: match},
			{$sort: {updatedAt: -1}},
			{
				$lookup: {
                    from: 'lessons',
                    localField: 'likeRefId',
                    foreignField: '_id',
                    as: 'favoriteLesson'
                },
			},
			{$unwind: '$favoriteLesson'},
			{$facet: {
				list: [
					{$skip: (page - 1) * limit},
					{$limit: limit},
					lookupFavourite,
					{$unwind: '$favoriteLesson.memberData'},
				],
				metaCounter: [{ $count: 'total'}],
			}}
		]).exec();
		if (!data.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		const result: Lessons = {list: [], metaCounter: data[0].metaCounter};
		result.list = data[0].list.map((ele) => ele.favoriteLesson);
		return result;
	}

	
}
