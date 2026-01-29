import { IsIn, isNotEmpty, IsNotEmpty, IsOptional, IsString, Length, Min } from "class-validator";
import { LessonCategory, LessonLevel, LessonStatus } from "../../enums/lesson.enum";
import { ObjectId } from "mongoose";
import { Direction } from "../../enums/common.enum";
import { Type } from "class-transformer";
import { availableLessonSorts } from "../../config";
import { Lesson } from "./lesson";

export class LessonsInput {
	@IsNotEmpty()
	lessonCategory: LessonCategory;

	@IsNotEmpty()
	lessonLevel: LessonLevel;

	@IsNotEmpty()
	@Length(3, 150)
    lessonTitle: string;

	@IsNotEmpty()
    lessonDesc: string;

	memberId?: ObjectId;

	@IsOptional()
	@IsString()
	lessonVideo?: string;
}

export class AllLessons {
	@IsNotEmpty()
	lessons: Lesson[];
}

class LSISearch {
	@IsOptional()
	lessonLevel?: LessonLevel;

	@IsOptional()
    lessonCategory?: LessonCategory;

	@IsOptional()
	text?: string;
}

export class LessonInquiry {
	@IsNotEmpty()
	@Type(() => Number)	
	@Min(1)
	page: number;

	@IsNotEmpty()
	@Type(() => Number)	
	@Min(1)
	limit: number;

	@IsOptional()
	@IsIn(availableLessonSorts)
	sort?: string;

	@IsOptional()
	search?: LSISearch;


	@IsOptional()
	@Type(() => Number)
	direction?: Direction;
}

class ALSISearch {
	@IsOptional()
	text?: string;

	@IsOptional()
    lessonStatus?: LessonStatus;

	@IsOptional()
    lessonLevel?: LessonLevel;

    @IsOptional()
    lessonCategory?: LessonCategory;
}

export class AllLessonsAdminInquiry {
	@IsNotEmpty()
    @Type(() => Number)    
    page: number;

	@IsNotEmpty()
	@Type(() => Number)    
	limit: number;

	@IsOptional()
	@IsIn(availableLessonSorts)
	sort?: string;

	@IsOptional()
	@Type(() => Number)
	direction?: Direction;

	@IsOptional()
	search?: ALSISearch;
}

export class OrdinaryInquiry {
	@IsNotEmpty()
	@Type(() => Number)	
	@Min(1)
	page: number;
	
	@IsNotEmpty()
	@Type(() => Number)	
	@Min(1)
	limit: number;
}