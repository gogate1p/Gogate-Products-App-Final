import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthContextService } from './auth-context.service.js';
import { AuthService } from './auth.service.js';
export declare class AuthGuard implements CanActivate {
    private readonly authContext;
    private readonly authService;
    constructor(authContext: AuthContextService, authService: AuthService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
