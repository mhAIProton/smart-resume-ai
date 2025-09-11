import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    console.log('🔍 JWT Guard - Request headers:', {
      authorization: authHeader,
      url: request.url,
      method: request.method
    });
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('🔍 JWT Guard - Handle request:', {
      err: err?.message,
      user: user ? { id: user.id, email: user.email } : null,
      info: info?.message || info
    });
    
    if (err || !user) {
      throw err || new Error('Authentication failed');
    }
    
    return user;
  }
}

