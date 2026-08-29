import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthContextService } from './auth-context.service.js';
import { AuthService } from './auth.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authContext: AuthContextService,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authorization = req?.headers?.authorization ?? req?.get?.('authorization') ?? req?.auth ?? req?.session?.user?.authorization;

    if (!authorization || typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('UNAUTHENTICATED');
    }

    try {
      const user = this.authService.verifyAccessToken(authorization);

      if (!user?.id || !user?.tenantId || !user?.role) {
        throw new UnauthorizedException('UNAUTHENTICATED');
      }

      this.authContext.setCurrentUser(user);
      req.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('UNAUTHENTICATED');
    }
  }
}
