
import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { BoardArticleStatus } from '../../enums/board-article.enum';
import { ObjectId } from 'mongoose';


export class BoardArticleUpdate {
	@IsNotEmpty()
	_id: ObjectId;

	@IsOptional()
	@IsEnum(BoardArticleStatus)
	articleStatus?: BoardArticleStatus;

	@IsOptional()
	@Length(3, 50)
	articleTitle?: string;

	@IsOptional()
	articleContent?: string;

	@IsOptional()
	articleImage?: string;
}
