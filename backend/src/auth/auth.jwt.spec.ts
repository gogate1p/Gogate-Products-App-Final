import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard.js';
import { AuthContextService } from './auth-context.service.js';
import { AuthService } from './auth.service.js';

describe('JWT auth boundary', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let authContext: AuthContextService;

  const makeContext = (token?: string) => ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: token ? { authorization: `Bearer ${token}` } : {},
      }),
    }),
  });

  beforeEach(() => {
    authContext = new AuthContextService();
    authService = new AuthService(
      new JwtService({
        secret: 'test-secret',
        signOptions: { issuer: 'gp-backend', audience: 'gp-app' },
      }),
    );
    guard = new AuthGuard(authContext, authService);
  });

  it('rejects missing Bearer token', () => {
    expect(() => guard.canActivate(makeContext())).toThrow(UnauthorizedException);
  });

  it('rejects malformed token', () => {
    expect(() => guard.canActivate(makeContext('not-a-jwt'))).toThrow(UnauthorizedException);
  });

  it('rejects invalid signature', () => {
    const bad = authService.signAccessToken({
      id: 'user-1',
      tenantId: 'tenant-1',
      role: 'RIDER',
      riderProfileId: 'rider-1',
    });

    expect(() => guard.canActivate(makeContext(`${bad.slice(0, -1)}X`))).toThrow(UnauthorizedException);
  });

  it('rejects expired token', () => {
    const expired = new JwtService({ secret: 'test-secret', signOptions: { issuer: 'gp-backend', audience: 'gp-app' } }).sign(
      {
        sub: 'user-1',
        userId: 'user-1',
        tenantId: 'tenant-1',
        role: 'RIDER',
      },
      { expiresIn: -1 },
    );

    expect(() => guard.canActivate(makeContext(expired))).toThrow(UnauthorizedException);
  });

  it('rejects wrong issuer', () => {
    const badIssuer = new JwtService({ secret: 'test-secret' }).sign(
      {
        sub: 'user-1',
        userId: 'user-1',
        tenantId: 'tenant-1',
        role: 'RIDER',
      },
      { issuer: 'wrong-issuer', audience: 'gp-app' },
    );

    expect(() => guard.canActivate(makeContext(badIssuer))).toThrow(UnauthorizedException);
  });

  it('rejects wrong audience', () => {
    const badAudience = new JwtService({ secret: 'test-secret' }).sign(
      {
        sub: 'user-1',
        userId: 'user-1',
        tenantId: 'tenant-1',
        role: 'RIDER',
      },
      { issuer: 'gp-backend', audience: 'wrong-audience' },
    );

    expect(() => guard.canActivate(makeContext(badAudience))).toThrow(UnauthorizedException);
  });

  it('accepts valid token and binds authenticated identity from JWT', () => {
    const token = authService.signAccessToken({
      id: 'user-1',
      tenantId: 'tenant-1',
      role: 'RIDER',
      riderProfileId: 'rider-1',
      email: 'rider@example.com',
      name: 'Rider A',
    });

    const req = { headers: { authorization: `Bearer ${token}` } };
    const ctx = {
      switchToHttp: () => ({ getRequest: () => req }),
    };

    expect(guard.canActivate(ctx)).toBe(true);
    expect(req.user).toMatchObject({ id: 'user-1', tenantId: 'tenant-1', role: 'RIDER' });
  });

  it('ignores client riderId override', () => {
    const token = authService.signAccessToken({
      id: 'user-1',
      tenantId: 'tenant-1',
      role: 'RIDER',
      riderProfileId: 'rider-1',
    });

    const req = {
      headers: { authorization: `Bearer ${token}` },
      body: { riderId: 'rider-2', userId: 'user-2', tenantId: 'tenant-2', role: 'ADMIN' },
    };

    const ctx = {
      switchToHttp: () => ({ getRequest: () => req }),
    };

    expect(guard.canActivate(ctx)).toBe(true);
    expect(req.user.riderProfileId).toBe('rider-1');
    expect(req.user.id).toBe('user-1');
    expect(req.user.tenantId).toBe('tenant-1');
    expect(req.user.role).toBe('RIDER');
  });
});
