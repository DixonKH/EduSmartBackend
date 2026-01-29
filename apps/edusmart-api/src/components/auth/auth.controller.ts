import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Member } from '../../libs/dto/member/member';
import { MemberInput } from '../../libs/dto/member/member.input';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req): Promise<void> {
    // Google OAuth orqali yo'naltirish
    console.log('Redirecting to Google OAuth...');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res): Promise<void> {
    try {
      console.log('user', req.user);
  
      const user: MemberInput = {
        ...req.user,
        memberType: req.query.memberType, // Foydalanuvchi tomonidan yuborilgan memberType
      };
  
     
      const member = await this.authService.googleLogin(user);
  
      // Token yoki boshqa foydalanuvchi ma'lumotlarini frontendga yuborish
      const redirectUrl = `http://localhost:5173/google-callback?accessToken=${member.accessToken}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google login error:', error);
      return res.redirect(`http://localhost:5173/error`);
    }
  }
  
}
