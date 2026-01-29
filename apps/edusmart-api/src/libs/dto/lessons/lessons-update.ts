import { IsEnum, IsNotEmpty, IsOptional, Length } from "class-validator";
import { ObjectId } from "mongoose";
import { LessonCategory, LessonLevel, LessonStatus } from "../../enums/lesson.enum";
import { Optional } from "@nestjs/common";

export class LessonsUpdate {
	@IsNotEmpty()
	_id: ObjectId;

	@Optional()
	@IsEnum(LessonCategory)
    lessonCategory?: LessonCategory;

	@Optional()
	@IsEnum(LessonLevel)
	lessonLevel: LessonLevel;

	@IsOptional()
	@IsEnum(LessonStatus)
	lessonStatus?: LessonStatus;

	@IsOptional()
	@Length(3, 150)
	lessonTitle?: string;

	@IsOptional()
	lessonDesc?: string;

	@IsOptional()
	lessonVideo?: string;
}
