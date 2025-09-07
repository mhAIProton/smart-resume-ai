import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserPlan } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  plan: UserPlan;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    plan: UserPlan;
    remainingGenerations: number;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async login(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
        remainingGenerations: user.remainingGenerations,
      },
    };
  }

  async googleLogin(profile: any): Promise<AuthResponse> {
    let user = await this.usersRepository.findOne({
      where: { googleId: profile.id },
    });

    if (!user) {
      // Check if user exists with this email
      user = await this.usersRepository.findOne({
        where: { email: profile.emails[0].value },
      });

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.avatar = profile.photos[0]?.value;
        await this.usersRepository.save(user);
      } else {
        // Create new user
        user = await this.usersService.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id,
          avatar: profile.photos[0]?.value,
        });
      }
    } else {
      // Update user info
      user.name = profile.displayName;
      user.avatar = profile.photos[0]?.value;
      await this.usersRepository.save(user);
    }

    return this.login(user);
  }

  async refreshToken(userId: string): Promise<AuthResponse> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.login(user);
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid token or user inactive');
    }

    return user;
  }
}

