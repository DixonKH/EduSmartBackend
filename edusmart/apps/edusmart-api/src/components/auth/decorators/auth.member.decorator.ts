import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Member } from 'apps/edusmart-api/src/libs/dto/member/member';

export const AuthMember = createParamDecorator((data: string, context: ExecutionContext) => {
    let request: any;
        request = context.switchToHttp().getRequest();  
    if (!request) {
        console.error('Request object is not found'); 
        return null;
    }

    // Authorization headerni olish
    const authorization = request.headers?.authorization;

    // `authMember` obyektini olish
    const member = request.authMember;
    console.log('Member:', member);

    // Agar `authMember` mavjud bo'lsa, unga `authorization`ni qo'shing
    if (member && authorization) {
        member.authorization = authorization; // Headerni authMember'ga qo'shish
    }

    // So'ralgan ma'lumotni qaytarish yoki to'liq `authMember`ni qaytarish
    if (member) {
        return data ? member[data] : member;
    }

    console.log('No AuthMember found in request');
    return null; // Agar `authMember` mavjud bo'lmasa, null qaytaradi
});
