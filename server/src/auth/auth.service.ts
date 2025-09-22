import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserPlan, SubscriptionStatus } from '../users/entities/user.entity';
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
    totalGenerations: number;
    subscriptionStatus: SubscriptionStatus;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
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
        totalGenerations: user.totalGenerations,
        subscriptionStatus: user.subscriptionStatus,
      },
    };
  }

  async googleLogin(profile: any): Promise<AuthResponse> {
    console.log('🔍 Processing Google profile:', profile);
    
    let user = await this.usersService.findByGoogleId(profile.id);

    if (!user) {
      // Check if user exists with this email
      user = await this.usersService.findByEmail(profile.email);

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.avatar = profile.avatar;
        await this.usersService.update(user.id, user);
      } else {
        // Create new user
        user = await this.usersService.create({
          email: profile.email,
          name: profile.name,
          googleId: profile.id,
          avatar: profile.avatar,
        });
      }
    } else {
      // Update user info
      user.name = profile.name;
      user.avatar = profile.avatar;
      await this.usersService.update(user.id, user);
    }

    return this.login(user);
  }

  async refreshToken(userId: string): Promise<AuthResponse> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.login(user);
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid token or user not found');
    }

    return user;
  }

  async validateJwtPayloadForGeneration(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);

    if (!user || user.subscriptionStatus !== SubscriptionStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid token or user subscription inactive');
    }

    return user;
  }
}

