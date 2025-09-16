import jsPDF from "jspdf";

// Интерфейс для данных резюме из JSON
export interface ResumeData {
  full_name: string;
  profession: string;
  summary: string;
  contacts: {
    email: string;
    phone: string;
    portfolio: string;
  };
  skills: string[];
  experience: Array<{
    job_title: string;
    company: string;
    dates: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    dates: string;
  }>;
  additional: Array<{
    languages?: string;
    tools?: string;
    certificates?: string;
  }>;
}

export type DesignType = "classic" | "modern" | "minimal";

class PDFService {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;

  constructor() {
    this.pdf = new jsPDF();
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
  }

  // Основной метод для генерации PDF резюме
  generatePDF(resumeData: ResumeData, design: DesignType): void {
    this.resetPDF();
    
    switch (design) {
      case "classic":
        this.generateClassicDesign(resumeData);
        break;
      case "modern":
        this.generateModernDesign(resumeData);
        break;
      case "minimal":
        this.generateMinimalDesign(resumeData);
        break;
    }
  }

  // Сброс PDF документа
  private resetPDF(): void {
    this.pdf = new jsPDF();
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
  }

  // Классический дизайн
  private generateClassicDesign(resumeData: ResumeData): void {
    // Заголовок
    this.pdf.setFontSize(20);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(resumeData.full_name, this.margin, this.currentY);
    this.currentY += 10;

    this.pdf.setFontSize(14);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(resumeData.profession, this.margin, this.currentY);
    this.currentY += 15;

    // Контакты
    this.addSectionHeader("CONTACT INFORMATION");
    this.pdf.setFontSize(10);
    this.pdf.text(`Email: ${resumeData.contacts.email}`, this.margin, this.currentY);
    this.currentY += 6;
    this.pdf.text(`Phone: ${resumeData.contacts.phone}`, this.margin, this.currentY);
    this.currentY += 6;
    this.pdf.text(`Portfolio: ${resumeData.contacts.portfolio}`, this.margin, this.currentY);
    this.currentY += 15;

    // Профессиональное резюме
    this.addSectionHeader("PROFESSIONAL SUMMARY");
    this.addWrappedText(resumeData.summary, 10);
    this.currentY += 10;

    // Навыки
    this.addSectionHeader("SKILLS");
    this.addSkillsList(resumeData.skills);
    this.currentY += 10;

    // Опыт работы
    this.addSectionHeader("PROFESSIONAL EXPERIENCE");
    resumeData.experience.forEach(exp => {
      this.addExperienceItem(exp);
    });
    this.currentY += 10;

    // Образование
    this.addSectionHeader("EDUCATION");
    resumeData.education.forEach(edu => {
      this.addEducationItem(edu);
    });
    this.currentY += 10;

    // Дополнительная информация
    if (resumeData.additional.length > 0) {
      this.addSectionHeader("ADDITIONAL INFORMATION");
      resumeData.additional.forEach(add => {
        if (add.languages) {
          this.pdf.setFontSize(10);
          this.pdf.text(`Languages: ${add.languages}`, this.margin, this.currentY);
          this.currentY += 6;
        }
        if (add.tools) {
          this.pdf.text(`Tools: ${add.tools}`, this.margin, this.currentY);
          this.currentY += 6;
        }
        if (add.certificates) {
          this.pdf.text(`Certificates: ${add.certificates}`, this.margin, this.currentY);
          this.currentY += 6;
        }
      });
    }
  }

  // Современный дизайн
  private generateModernDesign(resumeData: ResumeData): void {
    // Цветная полоса сверху
    this.pdf.setFillColor(41, 128, 185);
    this.pdf.rect(0, 0, this.pageWidth, 30, "F");
    
    // Заголовок на цветной полосе
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(18);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(resumeData.full_name, this.margin, 20);
    
    this.pdf.setFontSize(12);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(resumeData.profession, this.margin, 25);
    
    this.pdf.setTextColor(0, 0, 0);
    this.currentY = 40;

    // Контакты в две колонки
    this.pdf.setFontSize(9);
    this.pdf.text(`📧 ${resumeData.contacts.email}`, this.margin, this.currentY);
    this.pdf.text(`📱 ${resumeData.contacts.phone}`, this.pageWidth / 2, this.currentY);
    this.currentY += 6;
    this.pdf.text(`🔗 ${resumeData.contacts.portfolio}`, this.margin, this.currentY);
    this.currentY += 15;

    // Профессиональное резюме
    this.addModernSectionHeader("PROFESSIONAL SUMMARY");
    this.addWrappedText(resumeData.summary, 10);
    this.currentY += 10;

    // Навыки с иконками
    this.addModernSectionHeader("SKILLS");
    this.addModernSkillsList(resumeData.skills);
    this.currentY += 10;

    // Опыт работы
    this.addModernSectionHeader("PROFESSIONAL EXPERIENCE");
    resumeData.experience.forEach(exp => {
      this.addModernExperienceItem(exp);
    });
    this.currentY += 10;

    // Образование
    this.addModernSectionHeader("EDUCATION");
    resumeData.education.forEach(edu => {
      this.addModernEducationItem(edu);
    });
    this.currentY += 10;

    // Дополнительная информация
    if (resumeData.additional.length > 0) {
      this.addModernSectionHeader("ADDITIONAL INFORMATION");
      resumeData.additional.forEach(add => {
        if (add.languages) {
          this.pdf.setFontSize(10);
          this.pdf.text(`🌐 Languages: ${add.languages}`, this.margin, this.currentY);
          this.currentY += 6;
        }
        if (add.tools) {
          this.pdf.text(`🛠️ Tools: ${add.tools}`, this.margin, this.currentY);
          this.currentY += 6;
        }
        if (add.certificates) {
          this.pdf.text(`📜 Certificates: ${add.certificates}`, this.margin, this.currentY);
          this.currentY += 6;
        }
      });
    }
  }

  // Минималистичный дизайн
  private generateMinimalDesign(resumeData: ResumeData): void {
    // Заголовок
    this.pdf.setFontSize(16);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(resumeData.full_name, this.margin, this.currentY);
    this.currentY += 8;

    this.pdf.setFontSize(12);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(resumeData.profession, this.margin, this.currentY);
    this.currentY += 12;

    // Тонкая линия
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 10;

    // Контакты
    this.pdf.setFontSize(9);
    this.pdf.text(resumeData.contacts.email, this.margin, this.currentY);
    this.pdf.text(resumeData.contacts.phone, this.pageWidth / 2, this.currentY);
    this.currentY += 5;
    this.pdf.text(resumeData.contacts.portfolio, this.margin, this.currentY);
    this.currentY += 15;

    // Профессиональное резюме
    this.addMinimalSectionHeader("SUMMARY");
    this.addWrappedText(resumeData.summary, 9);
    this.currentY += 10;

    // Навыки
    this.addMinimalSectionHeader("SKILLS");
    this.addMinimalSkillsList(resumeData.skills);
    this.currentY += 10;

    // Опыт работы
    this.addMinimalSectionHeader("EXPERIENCE");
    resumeData.experience.forEach(exp => {
      this.addMinimalExperienceItem(exp);
    });
    this.currentY += 10;

    // Образование
    this.addMinimalSectionHeader("EDUCATION");
    resumeData.education.forEach(edu => {
      this.addMinimalEducationItem(edu);
    });
    this.currentY += 10;

    // Дополнительная информация
    if (resumeData.additional.length > 0) {
      this.addMinimalSectionHeader("ADDITIONAL");
      resumeData.additional.forEach(add => {
        if (add.languages) {
          this.pdf.setFontSize(9);
          this.pdf.text(`Languages: ${add.languages}`, this.margin, this.currentY);
          this.currentY += 5;
        }
        if (add.tools) {
          this.pdf.text(`Tools: ${add.tools}`, this.margin, this.currentY);
          this.currentY += 5;
        }
        if (add.certificates) {
          this.pdf.text(`Certificates: ${add.certificates}`, this.margin, this.currentY);
          this.currentY += 5;
        }
      });
    }
  }

  // Вспомогательные методы для классического дизайна
  private addSectionHeader(title: string): void {
    this.pdf.setFontSize(12);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(title, this.margin, this.currentY);
    this.currentY += 8;
    
    // Подчеркивание
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 5;
  }

  private addWrappedText(text: string, fontSize: number): void {
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont("helvetica", "normal");
    const lines = this.pdf.splitTextToSize(text, this.pageWidth - (this.margin * 2));
    this.pdf.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * (fontSize * 0.4) + 5;
  }

  private addSkillsList(skills: string[]): void {
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "normal");
    const skillsText = skills.join(" • ");
    const lines = this.pdf.splitTextToSize(skillsText, this.pageWidth - (this.margin * 2));
    this.pdf.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * 4 + 5;
  }

  private addExperienceItem(exp: any): void {
    this.pdf.setFontSize(11);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(exp.job_title, this.margin, this.currentY);
    this.currentY += 5;

    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(`${exp.company} | ${exp.dates}`, this.margin, this.currentY);
    this.currentY += 8;

    this.addWrappedText(exp.description, 9);
    this.currentY += 5;
  }

  private addEducationItem(edu: any): void {
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(edu.degree, this.margin, this.currentY);
    this.currentY += 5;

    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(`${edu.institution} | ${edu.dates}`, this.margin, this.currentY);
    this.currentY += 8;
  }

  // Вспомогательные методы для современного дизайна
  private addModernSectionHeader(title: string): void {
    this.pdf.setFontSize(11);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setTextColor(41, 128, 185);
    this.pdf.text(title, this.margin, this.currentY);
    this.pdf.setTextColor(0, 0, 0);
    this.currentY += 8;
  }

  private addModernSkillsList(skills: string[]): void {
    this.pdf.setFontSize(9);
    this.pdf.setFont("helvetica", "normal");
    const skillsText = skills.join(" • ");
    const lines = this.pdf.splitTextToSize(skillsText, this.pageWidth - (this.margin * 2));
    this.pdf.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * 3.5 + 5;
  }

  private addModernExperienceItem(exp: any): void {
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(exp.job_title, this.margin, this.currentY);
    this.currentY += 4;

    this.pdf.setFontSize(9);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(`${exp.company} | ${exp.dates}`, this.margin, this.currentY);
    this.pdf.setTextColor(0, 0, 0);
    this.currentY += 6;

    this.addWrappedText(exp.description, 9);
    this.currentY += 5;
  }

  private addModernEducationItem(edu: any): void {
    this.pdf.setFontSize(9);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(edu.degree, this.margin, this.currentY);
    this.currentY += 4;

    this.pdf.setFont("helvetica", "normal");
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(`${edu.institution} | ${edu.dates}`, this.margin, this.currentY);
    this.pdf.setTextColor(0, 0, 0);
    this.currentY += 6;
  }

  // Вспомогательные методы для минималистичного дизайна
  private addMinimalSectionHeader(title: string): void {
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(title.toUpperCase(), this.margin, this.currentY);
    this.currentY += 6;
  }

  private addMinimalSkillsList(skills: string[]): void {
    this.pdf.setFontSize(8);
    this.pdf.setFont("helvetica", "normal");
    const skillsText = skills.join(" • ");
    const lines = this.pdf.splitTextToSize(skillsText, this.pageWidth - (this.margin * 2));
    this.pdf.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * 3 + 5;
  }

  private addMinimalExperienceItem(exp: any): void {
    this.pdf.setFontSize(9);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(exp.job_title, this.margin, this.currentY);
    this.currentY += 4;

    this.pdf.setFontSize(8);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(`${exp.company} | ${exp.dates}`, this.margin, this.currentY);
    this.currentY += 6;

    this.addWrappedText(exp.description, 8);
    this.currentY += 3;
  }

  private addMinimalEducationItem(edu: any): void {
    this.pdf.setFontSize(8);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(edu.degree, this.margin, this.currentY);
    this.currentY += 4;

    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(`${edu.institution} | ${edu.dates}`, this.margin, this.currentY);
    this.currentY += 6;
  }

  // Метод для генерации PDF cover letter
  generateCoverLetterPDF(content: string): void {
    this.resetPDF();
    
    this.currentY = this.margin;
    
    // Добавляем заголовок
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Cover Letter', this.margin, this.currentY);
    this.currentY += 15;
    
    // Добавляем дату
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString();
    this.pdf.text(`Generated on: ${currentDate}`, this.margin, this.currentY);
    this.currentY += 10;
    
    // Добавляем разделительную линию
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 10;
    
    // Добавляем основной контент используя существующий метод
    this.addWrappedText(content, 10);
  }

  // Метод для скачивания PDF
  downloadPDF(filename: string = "resume.pdf"): void {
    this.pdf.save(filename);
  }

  // Метод для получения PDF как blob
  getPDFBlob(): Blob {
    return this.pdf.output("blob");
  }
}

export const pdfService = new PDFService();