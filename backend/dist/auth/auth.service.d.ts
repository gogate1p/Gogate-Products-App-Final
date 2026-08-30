import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser } from './auth.types.js';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    signAccessToken(user: AuthenticatedUser): string;
    verifyAccessToken(authorization: string): AuthenticatedUser;
}
