import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthContextService } from './auth-context.service.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';

describe('AuthGuard', () => {
  let authContext: AuthContextService;
  let authService: AuthService;
  let guard: AuthGuard;

  const createContext = (authorization?: string) => ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: authorization ? { authorization } : {},
      }),
    }),
  });

  beforeEach(() => {
    authContext = new AuthContextService();
    const jwtService = new JwtService({
      secret: 'test-secret',
      signOptions: {
        issuer: 'gp-backend',
        audience: 'gp-app',
      },
    });
    authService = new AuthService(jwtService);
    guard = new AuthGuard(authContext, authService);
  });

  it('rejects missing authentication', () => {
    expect(() => guard.canActivate(createContext())).toThrow(UnauthorizedException);
  });

  it('rejects invalid credentials', () => {
    expect(() => guard.canActivate(createContext('Bearer not-a-real-token'))).toThrow(UnauthorizedException);
  });

  it('rejects expired credentials', () => {
    const expired = new JwtService({ secret: 'test-secret' }).sign(
      {
        sub: 'user-1',
        userId: 'user-1',
        tenantId: 'tenant-1',
        role: 'RIDER',
      },
      { expiresIn: -1 },
    );

    expect(() => guard.canActivate(createContext(`Bearer ${expired}`))).toThrow(UnauthorizedException);
  });

  it('accepts valid rider credentials and binds authenticated identity from the token', () => {
    const token = authService.signAccessToken({
      id: 'user-1',
      tenantId: 'tenant-1',
      role: 'RIDER',
      riderProfileId: 'rider-1',
      email: 'rider@example.com',
      name: 'Rider A',
    });

    const req = { headers: { authorization: `Bearer ${token}` } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    };

    expect(guard.canActivate(context)).toBe(true);
    expect(req.user).toMatchObject({ id: 'user-1', tenantId: 'tenant-1', role: 'RIDER' });
  });
});

describe('AuthContextService authorization checks', () => {
  it('denies rider access to another rider profile', () => {
    const authContext = new AuthContextService();
    const user = {
      id: 'user-1',
      tenantId: 'tenant-1',
      role: 'RIDER',
      riderProfileId: 'rider-1',
    };

    expect(() => authContext.assertRiderOwnership('rider-2', user)).toThrow(ForbiddenException);
  });

  it('denies hub staff access to a different hub', () => {
    const authContext = new AuthContextService();
    const user = {
      id: 'user-2',
      tenantId: 'tenant-1',
      role: 'HUB_STAFF',
      hubId: 'hub-a',
    };

    expect(() => authContext.assertHubAccess('hub-b', user)).toThrow(ForbiddenException);
  });

  it('denies cross-tenant access', () => {
    const authContext = new AuthContextService();
    const user = {
      id: 'user-1',
      tenantId: 'tenant-1',
      role: 'RIDER',
      riderProfileId: 'rider-1',
    };

    expect(() => authContext.assertTenantAccess('tenant-2', user)).toThrow(ForbiddenException);
  });
});
