import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }

  async register(email: string, pass: string, role: string = 'user') {
    const existing = await this.usersService.findOneByEmail(email);
    if (existing) {
      throw new ConflictException('User already exists');
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(pass, salt);

    const user = await this.usersService.create({ email, passwordHash, role });
    return this.login(user);
  }
}
