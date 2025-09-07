import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OpenaiService, GenerateResumeRequest, GenerateCoverLetterRequest } from './openai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('openai')
@Controller('openai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('generate-resume')
  @ApiOperation({ summary: 'Generate a resume using AI' })
  @ApiResponse({ status: 200, description: 'Resume generated successfully' })
  async generateResume(
    @Body() request: GenerateResumeRequest,
    @GetUser() user: User,
  ) {
    if (!user.canGenerate()) {
      throw new Error('Insufficient generations remaining');
    }

    const content = await this.openaiService.generateResume(request);
    return { content };
  }

  @Post('generate-cover-letter')
  @ApiOperation({ summary: 'Generate a cover letter using AI' })
  @ApiResponse({ status: 200, description: 'Cover letter generated successfully' })
  async generateCoverLetter(
    @Body() request: GenerateCoverLetterRequest,
    @GetUser() user: User,
  ) {
    if (!user.canGenerate()) {
      throw new Error('Insufficient generations remaining');
    }

    const content = await this.openaiService.generateCoverLetter(request);
    return { content };
  }

  @Post('extract-job-description')
  @ApiOperation({ summary: 'Extract job description from URL' })
  @ApiResponse({ status: 200, description: 'Job description extracted successfully' })
  async extractJobDescription(@Body() body: { url: string }) {
    const content = await this.openaiService.extractJobDescriptionFromUrl(body.url);
    return { content };
  }

  @Post('improve-content')
  @ApiOperation({ summary: 'Improve existing resume or cover letter' })
  @ApiResponse({ status: 200, description: 'Content improved successfully' })
  async improveContent(
    @Body() body: { content: string; type: 'resume' | 'cover_letter' },
    @GetUser() user: User,
  ) {
    if (!user.canGenerate()) {
      throw new Error('Insufficient generations remaining');
    }

    const improvedContent = await this.openaiService.improveContent(body.content, body.type);
    return { content: improvedContent };
  }
}

