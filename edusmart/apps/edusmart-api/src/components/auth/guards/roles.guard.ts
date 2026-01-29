import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
	ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { AuthService } from '../auth.service';
  import { Message } from 'apps/edusmart-api/src/libs/enums/common.enum';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
	constructor(
	  private readonly reflector: Reflector,
	  private readonly authService: AuthService,
	) {}
  
	async canActivate(context: ExecutionContext): Promise<boolean> {
	  // Ro'llarni olish
	  const roles = this.reflector.get<string[]>('roles', context.getHandler());
	  if (!roles) return true; // Agar ro'l talab qilinmasa, ruxsat beriladi
  
	  console.info(`--- @guard() Authentication [RolesGuard]: ${roles} ---`);
  
	  // HTTP so'rovni olish
	  const request = context.switchToHttp().getRequest();
  
	  // Authorization headerni tekshirish
	  const bearerToken = request.headers.authorization;
	  if (!bearerToken) {
		throw new BadRequestException(Message.TOKEN_NOT_EXIST);
	  }
  
	  // Tokenni "Bearer"dan ajratish
	  const token = bearerToken.split(' ')[1];

	  // Tokenni tekshirish va foydalanuvchini olish
	  const authMember = await this.authService.verifyToken(token);
	  if (!authMember) {
		throw new ForbiddenException(Message.ONLY_SPECIFIC_ROLES_ALLOWED);
	  }
  
	  // Ro'lni tekshirish
	  const hasRole = () => roles.includes(authMember.memberType);
	  if (!hasRole()) {
		throw new ForbiddenException(Message.ONLY_SPECIFIC_ROLES_ALLOWED);
	  }
  
	  console.log('memberNick[roles] =>', authMember.memberNick);
  
	  // Foydalanuvchini `request`ga qo'shish
	  request.authMember = authMember;
  
	  return true; // Guard muvaffaqiyatli o'tdi
	}
  }
  