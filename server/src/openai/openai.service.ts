import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GenerationType, CoverLetterTone, ResumeDesign } from '../generations/entities/generation.entity';
import pdfParse from 'pdf-parse';

const GPT_MODEL = 'gpt-4o-mini';

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
    });
  }

  async generateResume(request: GenerateResumeRequest): Promise<string> {
    try {
      const { jobDescription, userExperience, existingResume, design = ResumeDesign.CLASSIC } = request;

      let systemPrompt = `You are an expert resume writer and career coach. Generate a professional resume based on the provided information.`;

      if (existingResume) {
        systemPrompt += `\n\nIMPROVE the existing resume provided below. Make it more compelling, ATS-friendly, and tailored to the job description.`;
      } else {
        systemPrompt += `\n\nCREATE a new resume from scratch based on the user's experience and the job requirements.`;
      }

      systemPrompt += `\n\nDesign Style: ${design}\n- Classic: Traditional, conservative format\n- Modern: Clean, contemporary design with subtle styling\n- Minimalist: Ultra-clean, maximum white space, minimal formatting`;

      const userPrompt = `
        Job Description:
        ${jobDescription}
        
        ${existingResume ? `Existing Resume to Improve:\n${existingResume}` : `User Experience and Skills:\n${userExperience || 'Please create a professional resume based on the job requirements.'}`}
        
        Requirements:
        1. Make it ATS-friendly (Applicant Tracking System compatible)
        2. Use strong action verbs and quantifiable achievements
        3. Tailor content to match the job requirements
        4. Include relevant keywords from the job description
        5. Format it professionally for the ${design} design style
        6. Keep it concise but comprehensive
        7. Include sections: Contact Info, Professional Summary, Skills, Experience, Education (if applicable)
        
        Generate a complete resume in plain text format, ready for use.`;

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
      throw new BadRequestException('Failed to generate resume. Please try again.');
    }
  }

  async generateCoverLetter(request: GenerateCoverLetterRequest): Promise<string> {
    try {
      const { jobDescription, tone = CoverLetterTone.FORMAL } = request;

      const toneInstructions = {
        [CoverLetterTone.FORMAL]: 'Write in a formal, professional tone. Use traditional business language and structure.',
        [CoverLetterTone.FRIENDLY]: 'Write in a warm, approachable tone while maintaining professionalism. Show personality and enthusiasm.',
        [CoverLetterTone.STRICT]: 'Write in a direct, authoritative tone. Be concise and confident without being arrogant.',
      };

      const systemPrompt = `You are an expert cover letter writer. Generate a compelling cover letter that matches the job requirements and uses the specified tone.

        ${toneInstructions[tone]}
        
        Requirements:
        1. Address the hiring manager professionally
        2. Highlight relevant skills and experience
        3. Show enthusiasm for the role and company
        4. Keep it concise (3-4 paragraphs)
        5. Include a strong call to action
        6. Tailor content to the specific job description
        7. Use professional language appropriate for the tone`;

      const userPrompt = `
        Job Description:
        ${jobDescription}
        
        Generate a cover letter that:
        - Matches the ${tone} tone
        - Is tailored to this specific job
        - Highlights relevant qualifications
        - Shows genuine interest in the position
        - Is ready to use (include proper greeting and closing)
        
        Write the complete cover letter in plain text format.`;

      const completion = await this.openai.chat.completions.create({
        model: GPT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_completion_tokens: 1500,
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

