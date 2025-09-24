import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, ForbiddenException, BadRequestException } from '@nestjs/common';
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
    if (!content) {
      throw new BadRequestException('Failed to generate resume. Please try again.');
    }

    // Уменьшаем количество доступных генераций
    await this.usersService.decrementGenerations(user.id);

    return { content };

    // Читаем содержимое из resume-example.json // DEV-ONLY
    // const filePath = path.join(process.cwd(), '/json/resume-example.json');
    // const fileContent = fs.readFileSync(filePath, 'utf8');
    // return { content: fileContent };
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
    if (!content) {
      throw new BadRequestException('Failed to generate cover letter. Please try again.');
    }
    // const content = 'lorem ipsum dolor sit amet, consectetur adipiscing elit. nunc efficitur ultrices orci, at blandit sapien. nam quam lectus, viverra vitae massa quis, lacinia congue odio. proin porta nibh id elit rutrum, laoreet placerat neque posuere. duis suscipit urna ex. suspendisse malesuada velit et ligula egestas mattis. fusce lacinia purus tortor, ac dignissim ex hendrerit ac. praesent quis consequat dolor. praesent vel enim neque. cras interdum mattis lacus in facilisis., , aenean elit purus, volutpat vel imperdiet ac, porttitor sit amet leo. vivamus blandit tristique nisl, quis tempor elit facilisis sed. aliquam tellus augue, vestibulum et tincidunt eu, porta a tortor. nulla facilisi. etiam dignissim nunc a elit tristique consectetur. ut tristique metus et purus luctus, cursus iaculis nisl aliquam. donec laoreet urna lorem, vel eleifend turpis condimentum vitae. integer eu vehicula augue. maecenas posuere sodales eros, eget faucibus libero suscipit sed., , donec pretium quam quis tellus commodo varius. morbi sed viverra tortor. praesent faucibus ultrices ex eu fermentum. nam ullamcorper lacinia ante, a hendrerit ligula pellentesque sed. vivamus sollicitudin lacinia tortor vel sodales. quisque posuere posuere sem, eu feugiat arcu finibus quis. in ultrices velit mi, quis pulvinar augue consectetur ut. in hac habitasse platea dictumst. quisque turpis ipsum, interdum pharetra nibh sit amet, rhoncus sodales neque. nam facilisis diam sapien, in luctus nibh porttitor et. integer eu massa massa., , donec facilisis turpis vitae ante bibendum euismod. duis vel lacus ornare, hendrerit sapien sit amet, cursus nunc. cras mattis velit ut lacus lacinia, et elementum erat hendrerit. donec in suscipit ex. donec dictum a dolor et vestibulum. sed nec cursus mi. sed pretium tincidunt dui, non pharetra nibh pellentesque finibus. donec ullamcorper congue eros, ac facilisis nisl suscipit in. curabitur sollicitudin congue diam eget condimentum. pellentesque luctus turpis eu est interdum fermentum. in non tellus non mi vehicula pellentesque vel ac dui., , pellentesque turpis lacus, condimentum eget rutrum id, gravida in nibh. sed eget orci vulputate, gravida dui ut, blandit tellus. suspendisse tempor magna lobortis mauris facilisis, non pharetra lectus laoreet. nullam sagittis metus in purus fermentum lobortis. aenean venenatis luctus eros id pellentesque. donec non felis quam. donec neque massa, posuere ut massa eu, suscipit hendrerit turpis. nunc odio diam, consectetur in velit sed, tempor sollicitudin odio.';

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

