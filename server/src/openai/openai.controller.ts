import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { OpenaiService, GenerateResumeRequest, GenerateCoverLetterRequest } from './openai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import fs from 'fs';
import path from 'path';

@ApiTags('openai')
@Controller('openai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OpenaiController {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly usersService: UsersService,
  ) {}

  @Post('generate-resume')
  @ApiOperation({ summary: 'Generate a resume using AI' })
  @ApiResponse({ status: 200, description: 'Resume generated successfully' })
  async generateResume(
    @Body() request: GenerateResumeRequest,
    @GetUser() user: User,
  ) {
    if (!user.canGenerate()) {
      throw new ForbiddenException('Insufficient generations remaining');
    }

    const content = await this.openaiService.generateResume(request);

    // Уменьшаем количество доступных генераций
    await this.usersService.decrementGenerations(user.id);

    return { content };

    // Читаем содержимое из resume-example.json
    // const filePath = path.join(process.cwd(), 'resume-example.json');
    // const fileContent = fs.readFileSync(filePath, 'utf8');
    // const resumeData = JSON.parse(fileContent);
    
    // return { content: JSON.stringify(resumeData, null, 2) };
  }

  @Post('generate-cover-letter')
  @ApiOperation({ summary: 'Generate a cover letter using AI' })
  @ApiResponse({ status: 200, description: 'Cover letter generated successfully' })
  async generateCoverLetter(
    @Body() request: GenerateCoverLetterRequest,
    @GetUser() user: User,
  ) {
    if (!user.canGenerate()) {
      throw new ForbiddenException('Insufficient generations remaining');
    }

    const content = await this.openaiService.generateCoverLetter(request);

    // Уменьшаем количество доступных генераций
    await this.usersService.decrementGenerations(user.id);

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
      throw new ForbiddenException('Insufficient generations remaining');
    }

    // Уменьшаем количество доступных генераций
    await this.usersService.decrementGenerations(user.id);

    const improvedContent = await this.openaiService.improveContent(body.content, body.type);
    return { content: improvedContent };
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload and extract text from PDF file' })
  @ApiResponse({ status: 200, description: 'File uploaded and text extracted successfully' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }

    const extractedText = await this.openaiService.extractTextFromPDF(file);
    return { content: extractedText };
  }
}

