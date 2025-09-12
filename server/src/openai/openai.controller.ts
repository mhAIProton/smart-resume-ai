import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { OpenaiService, GenerateResumeRequest, GenerateCoverLetterRequest } from './openai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

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

    // dev-code
    // const content = "**[Your Name]**  \n[Your Address]  \n[City, State, Zip]  \n[Your Email]  \n[Your Phone Number]  \n[LinkedIn Profile or Portfolio URL]  \n\n---\n\n**PROFESSIONAL SUMMARY**  \nResults-driven Fullstack Developer with extensive experience in creating and maintaining scalable web applications using modern technologies. Proficient in TypeScript, NestJS, and Nuxt, with a strong focus on optimizing user experience and improving code quality. Adept at collaborating in a team environment, managing CI/CD processes, and designing application architecture. Committed to continuous learning and implementing innovative solutions that enhance project outcomes.\n\n---\n\n**SKILLS**  \n- Fullstack Development: TypeScript, NestJS, Nuxt 3, NuxtUI, Tailwind, Vuetify.js  \n- Database Management: PostgreSQL, Redis  \n- CI/CD Processes: Docker, GitLab, Kubernetes, Opensearch  \n- Web Application Development: Creation and enhancement of web applications  \n- Application Architecture: Design and support of cloud infrastructure  \n- Risk Assessment: Process optimization and decision-making  \n- Collaboration: Strong teamwork and communication skills  \n\n---\n\n**PROFESSIONAL EXPERIENCE**  \n\n**Fullstack Developer**  \n[Current or Most Recent Company Name] – [City, State]  \n[Month, Year] – Present  \n- Developed and maintained multiple web applications, enhancing user experience and ensuring code maintainability and scalability.  \n- Utilized TypeScript, NestJS, and Nuxt to create robust web solutions, achieving a 25% increase in application performance.  \n- Implemented CI/CD pipelines using Docker and GitLab, reducing deployment time by 30%.  \n- Designed and optimized database structures in PostgreSQL, leading to improved data retrieval speeds.  \n- Collaborated with cross-functional teams to identify project requirements and deliver innovative solutions on time.\n\n**[Previous Job Title]**  \n[Previous Company Name] – [City, State]  \n[Month, Year] – [Month, Year]  \n- Participated in the design and architecture of web applications, ensuring alignment with business goals and user needs.  \n- Enhanced existing codebases by implementing best practices and optimizing workflows, resulting in a 20% reduction in technical debt.  \n- Conducted risk assessments and provided recommendations to improve project efficiency and effectiveness.  \n- Engaged in continuous professional development to stay abreast of industry trends and technologies.\n\n---\n\n**EDUCATION**  \n[Your Degree] in [Your Major]  \n[Your University Name] – [City, State]  \n[Month, Year] – [Month, Year]  \n\n---\n\n**CERTIFICATIONS**  \n- [Any relevant certifications, if applicable]  \n\n---\n\n**REFERENCES**  \nAvailable upon request.  \n\n---\n\n**NOTE:** Customize the placeholders (e.g., [Your Name], [Current or Most Recent Company Name]) with your actual information before use.";

    // Уменьшаем количество доступных генераций
    await this.usersService.decrementGenerations(user.id);

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
      throw new ForbiddenException('Insufficient generations remaining');
    }

    // Уменьшаем количество доступных генераций
    await this.usersService.decrementGenerations(user.id);

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

