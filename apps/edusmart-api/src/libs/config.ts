import { ObjectId } from 'bson';
import { T } from './types/common';
export const availableAgentSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberExperience'];
export const availableMemberSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberExperience'];
export const availableBoardArticleSorts = ['createdAt', 'updatedAt', 'memberLikes'];
export const availableLessonSorts = ['createdAt', 'updatedAt', 'lessonLikes', 'lessonViews'];
export const availableCommentSorts = ['createdAt', 'updatedAt'];

export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};
export const lookupAuthMemberLiked = (memberId: T, targetRefId: string = '$_id') => {
	return {
		$lookup: {
			from: 'likes',
			let: {
				localLikeRefId: targetRefId,
				localMemberId: memberId,
				localMyFavorite: true,
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [{ $eq: ['$likeRefId', '$$localLikeRefId'] }, { $eq: ['$memberId', '$$localMemberId'] }],
						},
					},
				},
				{
					$project: {
						_id: 0,
						memberId: 1,
						likeRefId: 1,
						myFavorite: '$$localMyFavorite',
					},
				},
			],
			as: 'meLiked',
		},
	};
};
export const lookupMember = {
	$lookup: {
		from: 'members',
		localField: 'memberId',
		foreignField: '_id',
		as: 'memberData',
	},
};

export const lookupFavourite = {
	$lookup: {
        from: 'members',
        localField: 'favoriteLesson.memberId',
        foreignField: '_id',
        as: 'favoriteLesson.memberData',
    },
}

// config/cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
};