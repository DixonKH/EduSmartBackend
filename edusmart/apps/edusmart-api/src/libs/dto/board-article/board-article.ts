
import { BoardArticleCategory, BoardArticleStatus } from '../../enums/board-article.enum';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

export class BoardArticle {
	_id: ObjectId;
	articleCategory: BoardArticleCategory;
	articleStatus: BoardArticleStatus;
	articleTitle: string;
	articleContent: string;
	articleImage?: string;
	articleViews: number;
	articleLikes: number;
	articleComments: number;
	memberId: ObjectId;
	createdAt: Date;
	updatedAt: Date;

	/** from aggregation **/
	
	meLiked?: MeLiked[];
	memberData?: Member;
}

export class BoardArticles {
	list: BoardArticle[];
	metaCounter: TotalCounter[];
}
