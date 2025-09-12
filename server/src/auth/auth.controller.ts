import { Controller, Get, Post, UseGuards, Req, Res, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  async googleAuth(@Req() req: Request) {
    // This will redirect to Google OAuth
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('🔐 Google OAuth callback received');
      console.log('  User data:', req.user);
      
      const result = await this.authService.googleLogin(req.user);
      
      // Always redirect with token in URL for simplicity
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${result.access_token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ Google OAuth callback error:', error);
      const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?error=oauth_error`;
      res.redirect(errorUrl);
    }
  }

  @Post('google/token')
  @ApiOperation({ summary: 'Exchange Google OAuth code for token' })
  async googleTokenExchange(@Req() req: Request) {
    try {
      const { code, redirectUri } = req.body;
      
      if (!code || !redirectUri) {
        throw new Error('Missing code or redirectUri');
      }
      
      console.log('🔐 Google token exchange request');
      console.log('  Code:', code ? 'present' : 'missing');
      console.log('  Redirect URI:', redirectUri);
      
      // Exchange code for token using Google OAuth2
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }
      
      const tokenData = await tokenResponse.json();
      const { access_token } = tokenData;
      
      // Get user info from Google
      const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }
      
      const googleUser = await userResponse.json();
      
      // Create or find user in our database
      const result = await this.authService.googleLogin({
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture,
      });
      
      return {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          plan: result.user.plan,
          remainingGenerations: result.user.remainingGenerations,
          totalGenerations: (result.user as any).totalGenerations || 0,
          subscriptionStatus: (result.user as any).subscriptionStatus || 'active',
        },
        token: result.access_token,
      };
    } catch (error) {
      console.error('❌ Google token exchange error:', error);
      throw error;
    }
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  async refreshToken(@GetUser() user: User) {
    return this.authService.refreshToken(user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@GetUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      remainingGenerations: user.remainingGenerations,
      totalGenerations: user.totalGenerations,
      createdAt: user.createdAt,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async logout() {
    // In a stateless JWT setup, logout.svg is handled on the client side
    // by removing the token. We could implement token blacklisting here if needed.
    return { message: 'Logged out successfully' };
  }
}

