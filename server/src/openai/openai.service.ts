import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GenerationType, CoverLetterTone, ResumeDesign } from '../generations/entities/generation.entity';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';

const GPT_MODEL = process.env.NODE_ENV === 'production' ? 'gpt-4' : 'gpt-4o-mini';

export interface GenerateResumeRequest {
  jobDescription: string;
  userExperience?: string;
  existingResume?: string;
  design?: ResumeDesign;
}

export interface GenerateCoverLetterRequest {
  jobDescription: string;
  tone?: CoverLetterTone;
}

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      timeout: 120000,
    });
  }

  async generateResume(request: GenerateResumeRequest): Promise<string> {
    try {
      const { jobDescription, userExperience, existingResume, design = ResumeDesign.CLASSIC } = request;

      // Читаем промпт из файла
      const promptPath = path.join(process.cwd(), 'resume_prompt.txt');
      const promptTemplate = fs.readFileSync(promptPath, 'utf8');

      // Заменяем переменные в промпте
      const systemPrompt = promptTemplate
        .replace('${design}', design)
        .split('User Prompt')[0]
        .replace('System Prompt\n\n', '');

      const userPrompt = promptTemplate
        .split('User Prompt')[1]
        .replace('${jobDescription}', jobDescription)
        .replace('${existingResume}', existingResume || '')
        .replace('${userExperience}', userExperience || '');

      const completion = await this.openai.chat.completions.create({
        model: GPT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_completion_tokens: 4000,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new BadRequestException('Failed to generate resume. Please try again.');
    }

    // const filePath = path.join(process.cwd(), 'resume-example.json');
    // const fileContent = fs.readFileSync(filePath, 'utf8');
    // const resumeData = JSON.parse(fileContent);
    
    // return { content: JSON.stringify(resumeData, null, 2) };
  }

  async generateCoverLetter(request: GenerateCoverLetterRequest): Promise<string> {
    try {
      const { jobDescription, tone = CoverLetterTone.FORMAL } = request;

      // Читаем промпт из файла
      const promptPath = path.join(process.cwd(), 'cover_letter_prompt.txt');
      const promptTemplate = fs.readFileSync(promptPath, 'utf8');

      // Заменяем переменные в промпте
      const systemPrompt = promptTemplate
        .replace('${tone}', tone)
        .split('User Prompt')[0]
        .replace('System Prompt\n\n', '');

      const userPrompt = promptTemplate
        .split('User Prompt')[1]
        .replace('${jobDescription}', jobDescription)
        .replace('${tone}', tone);

      const completion = await this.openai.chat.completions.create({
        model: GPT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_completion_tokens: 3000,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new BadRequestException('Failed to generate cover letter. Please try again.');
    }
  }

  async extractJobDescriptionFromUrl(url: string): Promise<string> {
    try {
      // This would typically involve web scraping
      // For now, we'll return a placeholder
      // In production, you'd use a service like Puppeteer or Cheerio
      return `Job description extracted from: ${url}\n\n[This would contain the actual job description text extracted from the webpage]`;
    } catch (error) {
      console.error('Job extraction error:', error);
      throw new BadRequestException('Failed to extract job description from URL');
    }
  }

  async improveContent(content: string, type: 'resume' | 'cover_letter'): Promise<string> {
    try {
      const systemPrompt = `You are an expert ${type} writer. Improve the provided ${type} by making it more compelling, professional, and ATS-friendly.`;

      const userPrompt = `
        Please improve this ${type}:
        
        ${content}
        
        Make it:
        1. More compelling and professional
        2. ATS-friendly with relevant keywords
        3. Better structured and formatted
        4. More impactful with strong action verbs
        5. Tailored to stand out to recruiters
        
        Return the improved ${type} in the same format.`;

      const completion = await this.openai.chat.completions.create({
        model: GPT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_completion_tokens: 2000,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new BadRequestException(`Failed to improve ${type}. Please try again.`);
    }
  }

  async extractTextFromPDF(file: Express.Multer.File): Promise<string> {
    try {
      const pdfBuffer = file.buffer;
      const data = await pdfParse(pdfBuffer);
      
      if (!data.text || data.text.trim().length === 0) {
        throw new BadRequestException('No text found in PDF file');
      }

      return data.text.trim();
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new BadRequestException('Failed to extract text from PDF file');
    }
  }
}

