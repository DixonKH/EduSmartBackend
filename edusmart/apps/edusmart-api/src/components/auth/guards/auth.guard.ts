import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
  } from '@nestjs/common';
  import { AuthService } from '../auth.service';
  import { Message } from 'apps/edusmart-api/src/libs/enums/common.enum';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService) {}
  
	async canActivate(context: ExecutionContext): Promise<boolean> {
	  console.info('--- @guard() Authentication [AuthGuard] ---');
  
	  // HTTP so'rovini olish
	  const request = context.switchToHttp().getRequest();
  
	  // Authorization headerni tekshirish
	  const bearerToken = request.headers.authorization;
	  if (!bearerToken) {
		throw new BadRequestException(Message.TOKEN_NOT_EXIST);
	  }
  
	  // Tokenni "Bearer" dan ajratish
	  const token = bearerToken.split(' ')[1];

	  // Tokenni tekshirish va foydalanuvchini olish
	  const authMember = await this.authService.verifyToken(token);
	  if (!authMember) {
		throw new UnauthorizedException(Message.NOT_AUTHENTICATED);
	  }
  
	  // Foydalanuvchi ma'lumotlarini `request`ga qo'shish
	  console.log('memberNick[auth] =>', authMember.memberNick);
	  request.authMember = authMember;
	  console.log('Authenticated user:', request.authMember);
	  return true;
	}
  }
  