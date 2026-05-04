import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey', // In production, use env variables
    });
  }

  async validate(payload: any) {
    console.log('Validating JWT payload:', payload);
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
