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
      case "classic": this.generateClassicDesign(resumeData); break;
      case "modern": this.generateModernDesign(resumeData); break;
      case "minimal": this.generateMinimalDesign(resumeData); break;
      default: return;
    }
  }

  // Сброс PDF документа
  private resetPDF(): void {
    this.pdf = new jsPDF();
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.margin = 16;
    this.currentY = this.margin;
  }

  private addCurrentY(value: number): void {
    this.currentY += value;

    if (this.currentY > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private getMmFromPx(px: number): number {
    return Math.round(px * 0.35278);
  }

  // Конвертация hex цвета в RGB
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  // Классический дизайн
  private generateClassicDesign(resumeData: ResumeData): void {
    
    this.addSectionHeader(resumeData.full_name, 16);
    this.addSectionHeader(resumeData.profession, 18, 10);

    // Контакты
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.addImage('/icons/pdf-mail.png', 'PNG', this.margin, this.currentY - 4, 5, 5);
    this.pdf.text(resumeData.contacts.email, this.margin + 7, this.currentY);
    this.addCurrentY(6);
    this.pdf.addImage('/icons/pdf-phone.png', 'PNG', this.margin, this.currentY - 4, 5, 5);
    this.pdf.text(resumeData.contacts.phone, this.margin + 7, this.currentY);
    this.addCurrentY(6);
    this.pdf.addImage('/icons/pdf-link.png', 'PNG', this.margin, this.currentY - 4, 5, 5);
    this.pdf.text(resumeData.contacts.portfolio, this.margin + 7, this.currentY);
    this.addCurrentY(14);

    // Профессиональное резюме
    this.addSectionHeader('Profile');
    this.addWrappedText(resumeData.summary, 10);
    this.addCurrentY(8);

    // Навыки
    this.addSectionHeader('Skills', 18, 6);
    this.addSkillsList(resumeData.skills);
    this.addCurrentY(8);

    // Опыт работы
    this.addSectionHeader('Experience');
    resumeData.experience.forEach(exp => this.addExperienceItem(exp));
    this.addCurrentY(8);

    // Образование
    this.addSectionHeader('Education');
    resumeData.education.forEach(edu => {
      this.addEducationItem(edu);
    });
    this.addCurrentY(8);

    // Дополнительная информация
    if (resumeData.additional.length > 0) {
      this.addSectionHeader('Additional');

      resumeData.additional.forEach(add => {
        if (add.languages) {
          this.pdf.setFontSize(10);
          this.pdf.setFont("helvetica", "bold");
          this.pdf.text("Languages: ", this.margin, this.currentY);
          this.pdf.setFont("helvetica", "normal");
          this.pdf.text(add.languages, this.margin + this.pdf.getTextWidth("Languages:") + 3, this.currentY);
          this.addCurrentY(6);
        }
        if (add.tools) {
          this.pdf.setFontSize(10);
          this.pdf.setFont("helvetica", "bold");
          this.pdf.text("Tools: ", this.margin, this.currentY);
          this.pdf.setFont("helvetica", "normal");
          this.pdf.text(add.tools, this.margin + this.pdf.getTextWidth("Tools:") + 3, this.currentY);
          this.addCurrentY(6);
        }
        if (add.certificates) {
          this.pdf.setFontSize(10);
          this.pdf.setFont("helvetica", "bold");
          this.pdf.text("Certificates: ", this.margin, this.currentY);
          this.pdf.setFont("helvetica", "normal");
          this.pdf.text(add.certificates, this.margin + this.pdf.getTextWidth("Certificates:") + 3, this.currentY);
          this.addCurrentY(6);
        }
      });
    }
  }

  // Современный дизайн
  private generateModernDesign(resumeData: ResumeData): void {
    // Свои значения
    this.margin = 10;

    // Определяем границы колонок
    const leftColumnWidth = this.pageWidth * 0.65;
    const rightColumnWidth = this.pageWidth * 0.35;
    const rightColumnStart = leftColumnWidth + 4;

    // Левая колонка (серый фон)
    this.pdf.setFillColor(241, 241, 241);
    this.pdf.rect(0, 0, leftColumnWidth, this.pageHeight, "F");

    // Правая колонка (белый фон)
    this.pdf.setFillColor(255, 255, 255);
    this.pdf.rect(leftColumnWidth, 0, rightColumnWidth, this.pageHeight, "F");

    // ЛЕВАЯ КОЛОНКА - Имя и профессия
    this.pdf.setFontSize(16);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(resumeData.full_name, this.margin, this.margin + 10);
    
    this.pdf.setFontSize(18);
    this.pdf.text(resumeData.profession, this.margin, this.margin + 20);
    
    this.pdf.setTextColor(0, 0, 0);
    this.currentY = this.margin + 35;

    // ЛЕВАЯ КОЛОНКА - Profile
    this.addModernSectionHeader("Profile", this.margin);
    this.addWrappedText(resumeData.summary, 10, this.margin, leftColumnWidth - (this.margin * 2));
    this.addCurrentY(8);

    // ЛЕВАЯ КОЛОНКА - Experience
    this.addModernSectionHeader("Experience", this.margin);
    resumeData.experience.forEach(exp => {
      this.addModernExperienceItem(exp, this.margin, leftColumnWidth - (this.margin * 2));
    });
    this.addCurrentY(8);

    // ПРАВАЯ КОЛОНКА - Контакты с иконками
    this.currentY = this.margin + 8;
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.addImage('/icons/pdf-mail.png', 'PNG', rightColumnStart, this.currentY - 4, 5, 5);
    this.pdf.text(resumeData.contacts.email, rightColumnStart + 7, this.currentY);
    this.addCurrentY(6);
    this.pdf.addImage('/icons/pdf-phone.png', 'PNG', rightColumnStart, this.currentY - 4, 5, 5);
    this.pdf.text(resumeData.contacts.phone, rightColumnStart + 7, this.currentY);
    this.addCurrentY(6);
    this.pdf.addImage('/icons/pdf-link.png', 'PNG', rightColumnStart, this.currentY - 4, 5, 5);
    this.pdf.text(resumeData.contacts.portfolio, rightColumnStart + 7, this.currentY);
    this.addCurrentY(14);

    // ПРАВАЯ КОЛОНКА - Skills
    this.addModernSectionHeader("Skills", rightColumnStart, 6);
    this.addSkillsList(resumeData.skills, this.pageWidth - (this.margin * 2), rightColumnStart);
    this.addCurrentY(6);

    // ПРАВАЯ КОЛОНКА - Education
    this.addModernSectionHeader("Education", rightColumnStart);
    resumeData.education.forEach((edu, index) => {
      this.addModernEducationItem(edu, rightColumnStart);
      if (index < resumeData.education.length - 1) {
        // Тонкая серая линия между элементами
        this.pdf.setDrawColor(200, 200, 200);
        this.pdf.setLineWidth(0.3);
        this.pdf.line(rightColumnStart, this.currentY - 3, rightColumnStart + rightColumnWidth - (this.margin * 2), this.currentY - 3);
        this.addCurrentY(4);
      }
    });
    this.addCurrentY(8);

    // ПРАВАЯ КОЛОНКА - Additional
    if (resumeData.additional.length > 0) {
      this.addModernSectionHeader("Additional", rightColumnStart);
      resumeData.additional.forEach(add => {
        if (add.languages) {
          this.pdf.setFontSize(10);
          this.pdf.setFont("helvetica", "bold");
          this.pdf.text("Languages: ", rightColumnStart, this.currentY);
          this.pdf.setFont("helvetica", "normal");
          this.addCurrentY(5);
          this.addWrappedText(add.languages, 10, rightColumnStart, rightColumnWidth - (this.margin * 2));
        }
        if (add.tools) {
          this.pdf.setFontSize(10);
          this.pdf.setFont("helvetica", "bold");
          this.pdf.text("Tools: ", rightColumnStart, this.currentY);
          this.pdf.setFont("helvetica", "normal");
          this.addCurrentY(5);
          this.addWrappedText(add.tools, 10, rightColumnStart, rightColumnWidth - (this.margin * 2));
        }
        if (add.certificates) {
          this.pdf.setFontSize(10);
          this.pdf.setFont("helvetica", "bold");
          this.pdf.text("Certificates: ", rightColumnStart, this.currentY);
          this.pdf.setFont("helvetica", "normal");
          this.addCurrentY(5);
          this.addWrappedText(add.certificates, 10, rightColumnStart, rightColumnWidth - (this.margin * 2));
        }
      });
    }
  }

  // Минималистичный дизайн
  private generateMinimalDesign(resumeData: ResumeData): void {

    this.addSectionHeader(resumeData.full_name, 16);
    this.addSectionHeader(resumeData.profession, 18, 10);

    // Контакты
    this.pdf.setFontSize(10);
    this.pdf.text(`${resumeData.contacts.email}  |  ${resumeData.contacts.phone}  |  ${resumeData.contacts.portfolio}`, this.margin, this.currentY);
    this.addCurrentY(14);

    // Профессиональное резюме
    this.addMinimalSectionHeader('Profile');
    this.addWrappedText(resumeData.summary, 10);
    this.addCurrentY(8);

    // Навыки
    this.addMinimalSectionHeader("Skills");
    this.addMinimalSkillsList(resumeData.skills);
    this.addCurrentY(10);

    // Опыт работы
    this.addSectionHeader('Experience');
    resumeData.experience.forEach(exp => this.addExperienceItem(exp));
    this.addCurrentY(8);

    // Образование
    this.addSectionHeader('Education');
    resumeData.education.forEach(edu => {
      this.addEducationItem(edu);
    });
    this.addCurrentY(8);

    // Дополнительная информация
    if (resumeData.additional.length > 0) {
      this.addSectionHeader('Additional');

      resumeData.additional.forEach(add => {
        if (add.languages) {
          this.pdf.setFontSize(10);
          this.pdf.setFont("helvetica", "bold");
          this.pdf.text("Languages: ", this.margin, this.currentY);
          this.pdf.setFont("helvetica", "normal");
          this.pdf.text(add.languages, this.margin + this.pdf.getTextWidth("Languages:") + 3, this.currentY);
          this.addCurrentY(6);
        }
        if (add.tools) {
          this.pdf.setFontSize(10);
          this.pdf.setFont("helvetica", "bold");
          this.pdf.text("Tools: ", this.margin, this.currentY);
          this.pdf.setFont("helvetica", "normal");
          this.pdf.text(add.tools, this.margin + this.pdf.getTextWidth("Tools:") + 3, this.currentY);
          this.addCurrentY(6);
        }
        if (add.certificates) {
          this.pdf.setFontSize(10);
          this.pdf.setFont("helvetica", "bold");
          this.pdf.text("Certificates: ", this.margin, this.currentY);
          this.pdf.setFont("helvetica", "normal");
          this.pdf.text(add.certificates, this.margin + this.pdf.getTextWidth("Certificates:") + 3, this.currentY);
          this.addCurrentY(6);
        }
      });
    }
  }

  // Вспомогательные методы для классического дизайна
  private addSectionHeader(title: string, fontSize: number = 18, indent: number = 8): void {
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(title, this.margin, this.currentY);
    this.addCurrentY(indent);
  }

  private addWrappedText(text: string, fontSize: number, x: number = this.margin, maxWidth?: number): void {
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont("helvetica", "normal");

    const textWidth = maxWidth || (this.pageWidth - (this.margin * 2));
    const lines = this.pdf.splitTextToSize(text, textWidth);
    this.pdf.text(lines, x, this.currentY);
    this.addCurrentY(lines.length * fontSize * 0.4 + 5);
  }

  private addSkillsList(skills: string[], maxWidth?: number | undefined, x?: number | undefined): void {
    const listMaxWidth = maxWidth || this.pageWidth - (this.margin * 2);
    const badgeSpacing = 3; // Отступ между плашками
    const lineHeight = 10; // Высота строки
    
    let currentX = x || this.margin;
    let currentLineY = this.currentY;
    
    for (const skill of skills) {
      const badgeWidth = this.addBadge(skill, currentX, currentLineY);
      const nextBadgeX = currentX + badgeWidth + badgeSpacing;
      
      if (nextBadgeX + 20 > listMaxWidth) {
        // Переходим на новую строку
        currentLineY += lineHeight;
        currentX = x || this.margin;
      } else {
        currentX = nextBadgeX; // Перемещаемся вправо для следующей плашки
      }
    }
    
    // Обновляем currentY до конца последней строки с плашками
    this.currentY = currentLineY + lineHeight;
  }

  private addExperienceItem(exp: any): void {
    this.pdf.setFontSize(11);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(exp.job_title, this.margin, this.currentY);
    this.addCurrentY(5);

    this.pdf.setFontSize(10);
    this.pdf.text(exp.company, this.margin, this.currentY);
    this.addCurrentY(5);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(exp.dates, this.margin, this.currentY);
    this.addCurrentY(5);
    this.pdf.setTextColor(0, 0, 0);
    this.addWrappedText(exp.description, 9);
    this.addCurrentY(2);
  }

  private addEducationItem(edu: any): void {
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(edu.degree, this.margin, this.currentY);
    this.addCurrentY(5);

    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(edu.institution, this.margin, this.currentY);
    this.addCurrentY(5);
    
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(edu.dates, this.margin, this.currentY);
    this.pdf.setTextColor(0, 0, 0);
    this.addCurrentY(8);
  }

  // Вспомогательные методы для современного дизайна
  private addModernSectionHeader(title: string, x: number = this.margin, indent: number = 8): void {
    this.pdf.setFontSize(14);
    this.pdf.setFont("helvetica", "normal");
    const headerColor = this.hexToRgb('#0DC076');
    this.pdf.setTextColor(headerColor.r, headerColor.g, headerColor.b);
    this.pdf.text(title, x, this.currentY);
    this.pdf.setTextColor(0, 0, 0);
    this.addCurrentY(indent);
  }


  private addModernExperienceItem(exp: any, x: number = this.margin, maxWidth?: number): void {
    this.pdf.setFontSize(11);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(exp.job_title, x, this.currentY);
    this.addCurrentY(5);

    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(exp.company, x, this.currentY);
    this.addCurrentY(5);
    
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(exp.dates, x, this.currentY);
    this.addCurrentY(5);
    this.pdf.setTextColor(0, 0, 0);

    this.addWrappedText(exp.description, 9, x, maxWidth);
    this.addCurrentY(2);
  }

  private addModernEducationItem(edu: any, x: number = this.margin): void {
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(edu.degree, x, this.currentY);
    this.addCurrentY(5);

    this.pdf.setFont("helvetica", "normal");
    this.pdf.text(edu.institution, x, this.currentY);
    this.addCurrentY(5);
    
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(edu.dates, x, this.currentY);
    this.pdf.setTextColor(0, 0, 0);
    this.addCurrentY(8);
  }

  // Вспомогательные методы для минималистичного дизайна
  private addMinimalSectionHeader(title: string): void {
    this.pdf.setFontSize(16);
    this.pdf.setFont("helvetica");
    this.pdf.text(title, this.margin, this.currentY);
    this.addCurrentY(6);
  }

  private addMinimalSkillsList(skills: string[]): void {
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "normal");
    const skillsText = skills.join("  |  ");
    const lines = this.pdf.splitTextToSize(skillsText, this.pageWidth - (this.margin * 2));

    lines.forEach((line: string, index: number) => {
      this.pdf.text(line, this.margin, this.currentY + (index * 6));
    });

    this.addCurrentY(lines.length * 3 + 5);
  }

  private addBadge(text: string, x: number, y: number): number {
    const fontSize = 10;
    const padding = this.getMmFromPx(8);
    const radius = this.getMmFromPx(6);
    const fillColor = '#ffffff';
    const strokeColor = '#9c9c9c';
    const textColor = '#333333';
    const strokeWidth = this.getMmFromPx(1);

    // Устанавливаем шрифт и размер
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', 'normal');
    
    // Рассчитываем ширину текста
    const textWidth = this.pdf.getTextWidth(text);
    const badgeWidth = textWidth + padding * 2;
    const badgeHeight = 7;

    // Рисуем закругленную плашку
    this.pdf.setDrawColor(strokeColor);
    this.pdf.setFillColor(fillColor);
    this.pdf.setLineWidth(strokeWidth);
    this.pdf.roundedRect(x, y, badgeWidth, badgeHeight, radius, radius, 'FD');

    // Добавляем текст
    this.pdf.setTextColor(textColor);
    this.pdf.text(text, x + padding, y + fontSize * 0.5);

    return badgeWidth;
  }

  // Метод для генерации PDF cover letter
  generateCoverLetterPDF(content: string): void {
    this.resetPDF();
    
    this.currentY = this.margin;
    
    // Добавляем заголовок
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Cover Letter', this.margin, this.currentY);
    this.addCurrentY(15);
    
    // Добавляем дату
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString();
    this.pdf.text(`Generated on: ${currentDate}`, this.margin, this.currentY);
    this.addCurrentY(10);
    
    // Добавляем разделительную линию
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.addCurrentY(10);
    
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