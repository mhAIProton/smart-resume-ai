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
  private currentPage: number;
  private design: DesignType;
  private fontFamily: string = 'helvetica';

  constructor() {
    this.pdf = new jsPDF();
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
    this.currentPage = 1;
    this.design = "classic";
  }

  // Основной метод для генерации PDF резюме
  generatePDF(resumeData: ResumeData, design: DesignType): void {
    this.design = design;
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

  private addCurrentYToPage(value: number): void {
    this.currentY += value;

    if (this.currentY > this.pageHeight - this.margin) {
      this.currentPage++;

      if (this.currentPage > this.getPagesCount()) {
        this.pdf.addPage();

        if (this.design === "modern") {
          this.pdf.setFillColor(241, 241, 241);
          this.pdf.rect(0, 0, this.pageWidth * 0.65, this.pageHeight, "F");
        }
      }

      this.currentY = this.margin;
      this.pdf.setPage(this.currentPage);
    }
  }

  private getPagesCount(): number {
    return this.pdf.internal.pages.filter(page => page).length;
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
    this.pdf.setFont(this.fontFamily, "normal");
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
    this.addBoxedText(resumeData.summary);
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
          this.pdf.setFont(this.fontFamily, "bold");
          this.pdf.text("Languages: ", this.margin, this.currentY);
          this.addCurrentY(5);
          this.addBoxedText(add.languages);
          this.addCurrentY(2);
        }
        if (add.tools) {
          this.pdf.setFontSize(10);
          this.pdf.setFont(this.fontFamily, "bold");
          this.pdf.text("Tools: ", this.margin, this.currentY);
          this.addCurrentY(5);
          this.addBoxedText(add.tools);
          this.addCurrentY(2);
        }
        if (add.certificates) {
          this.pdf.setFontSize(10);
          this.pdf.setFont(this.fontFamily, "bold");
          this.pdf.text("Certificates: ", this.margin, this.currentY);
          this.addCurrentY(5);
          this.addBoxedText(add.certificates);
          this.addCurrentY(2);
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
    let maxWidth = leftColumnWidth - (this.margin * 2);

    // Левая колонка (серый фон)
    this.pdf.setFillColor(241, 241, 241);
    this.pdf.rect(0, 0, leftColumnWidth, this.pageHeight, "F");

    // ЛЕВАЯ КОЛОНКА - Имя и профессия
    this.addBoxedText(resumeData.full_name, { maxWidth, fontSize: 16, lineHeight: 0.4 });
    this.addBoxedText(resumeData.profession, { maxWidth, fontSize: 18, lineHeight: 0.4 });
    
    this.pdf.setTextColor(0, 0, 0);
    this.currentY = this.margin + 35;

    // ЛЕВАЯ КОЛОНКА - Profile
    this.addModernSectionHeader("Profile", this.margin);
    this.addBoxedText(resumeData.summary, { maxWidth });
    this.addCurrentYToPage(8);

    // ЛЕВАЯ КОЛОНКА - Experience
    this.addModernSectionHeader("Experience", this.margin);
    resumeData.experience.forEach(exp => {
      this.addModernExperienceItem(exp, this.margin, maxWidth);
    });
    this.addCurrentYToPage(8);

    // ПРАВАЯ КОЛОНКА - Контакты с иконками
    maxWidth = rightColumnWidth - (this.margin * 2);

    this.currentY = this.margin + 8;
    this.currentPage = 1;
    this.pdf.setPage(this.currentPage);

    this.pdf.setFontSize(10);
    this.pdf.setFont(this.fontFamily, "normal");
    this.pdf.addImage('/icons/pdf-mail.png', 'PNG', rightColumnStart, this.currentY - 4, 5, 5);
    this.addBoxedText(resumeData.contacts.email, { x: rightColumnStart + 7, maxWidth });
    this.pdf.addImage('/icons/pdf-phone.png', 'PNG', rightColumnStart, this.currentY - 4, 5, 5);
    this.addBoxedText(resumeData.contacts.phone, { x: rightColumnStart + 7, maxWidth });
    this.pdf.addImage('/icons/pdf-link.png', 'PNG', rightColumnStart, this.currentY - 4, 5, 5);
    this.addBoxedText(resumeData.contacts.portfolio, { x: rightColumnStart + 7, maxWidth });
    this.addCurrentYToPage(8);

    // ПРАВАЯ КОЛОНКА - Skills
    this.addModernSectionHeader("Skills", rightColumnStart, 6);
    this.addSkillsList(resumeData.skills, this.pageWidth - (this.margin * 2), rightColumnStart);
    this.addCurrentYToPage(6);

    // ПРАВАЯ КОЛОНКА - Education
    this.addModernSectionHeader("Education", rightColumnStart);
    resumeData.education.forEach((edu, index) => {
      this.pdf.setFontSize(10);
      this.pdf.setFont(this.fontFamily, "bold");
      this.addBoxedText(edu.degree, { x: rightColumnStart, maxWidth });
      this.pdf.setFont(this.fontFamily, "normal");
      this.addBoxedText(edu.institution, { x: rightColumnStart, maxWidth });
      this.pdf.setTextColor(100, 100, 100);
      this.pdf.text(edu.dates, rightColumnStart, this.currentY);
      this.pdf.setTextColor(0, 0, 0);
      this.addCurrentYToPage(8);

      if (index < resumeData.education.length - 1) {
        // Тонкая серая линия между элементами
        this.pdf.setDrawColor(200, 200, 200);
        this.pdf.setLineWidth(0.3);
        this.pdf.line(rightColumnStart, this.currentY - 3, rightColumnStart + rightColumnWidth - (this.margin * 2), this.currentY - 3);
        this.addCurrentYToPage(4);
      }
    });
    this.addCurrentYToPage(8);

    // ПРАВАЯ КОЛОНКА - Additional
    if (resumeData.additional.length > 0) {
      this.addModernSectionHeader("Additional", rightColumnStart);
      resumeData.additional.forEach(add => {
        if (add.languages) {
          this.pdf.setFontSize(10);
          this.pdf.setFont(this.fontFamily, "bold");
          this.pdf.text("Languages: ", rightColumnStart, this.currentY);
          this.pdf.setFont(this.fontFamily, "normal");
          this.addCurrentYToPage(5);
          this.addBoxedText(add.languages, { x: rightColumnStart, maxWidth });
        }
        if (add.tools) {
          this.pdf.setFontSize(10);
          this.pdf.setFont(this.fontFamily, "bold");
          this.pdf.text("Tools: ", rightColumnStart, this.currentY);
          this.pdf.setFont(this.fontFamily, "normal");
          this.addCurrentYToPage(5);
          this.addBoxedText(add.tools, { x: rightColumnStart, maxWidth });
        }
        if (add.certificates) {
          this.pdf.setFontSize(10);
          this.pdf.setFont(this.fontFamily, "bold");
          this.pdf.text("Certificates: ", rightColumnStart, this.currentY);
          this.pdf.setFont(this.fontFamily, "normal");
          this.addCurrentYToPage(5);
          this.addBoxedText(add.certificates, { x: rightColumnStart, maxWidth });
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
    this.addBoxedText(`${resumeData.contacts.email}  |  ${resumeData.contacts.phone}  |  ${resumeData.contacts.portfolio}`);
    this.addCurrentY(8);

    // Профессиональное резюме
    this.addSectionHeader('Profile');
    this.addBoxedText(resumeData.summary);
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
          this.pdf.setFont(this.fontFamily, "bold");
          this.pdf.text("Languages: ", this.margin, this.currentY);
          this.addCurrentY(5);
          this.addBoxedText(add.languages);
          this.addCurrentY(2);
        }
        if (add.tools) {
          this.pdf.setFontSize(10);
          this.pdf.setFont(this.fontFamily, "bold");
          this.pdf.text("Tools: ", this.margin, this.currentY);
          this.addCurrentY(5);
          this.addBoxedText(add.tools);
          this.addCurrentY(2);
        }
        if (add.certificates) {
          this.pdf.setFontSize(10);
          this.pdf.setFont(this.fontFamily, "bold");
          this.pdf.text("Certificates: ", this.margin, this.currentY);
          this.addCurrentY(5);
          this.addBoxedText(add.certificates);
          this.addCurrentY(2);
        }
      });
    }
  }

  // Вспомогательные методы для классического дизайна
  private addSectionHeader(title: string, fontSize: number = 18, indent: number = 8): void {
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont(this.fontFamily, "normal");
    this.pdf.text(title, this.margin, this.currentY);
    this.addCurrentY(indent);
  }

  private addWrappedText(text: string, fontSize: number, x: number = this.margin, maxWidth?: number): void {
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont(this.fontFamily, "normal");

    const textWidth = maxWidth || (this.pageWidth - (this.margin * 2));
    const lines = this.pdf.splitTextToSize(text, textWidth);
    this.pdf.text(lines, x, this.currentY);
    this.addCurrentY(lines.length * fontSize * 0.4 + 5);
  }

  private addBoxedText(text: string, options?: { fontSize?: number, x?: number, maxWidth?: number, indent?: number, fontWeight?: string, lineHeight?: number }): void {
    const { 
      fontSize = 10, 
      x = this.margin, 
      maxWidth = this.pageWidth - (this.margin * 2), 
      indent = 2,
      fontWeight = "normal",
      lineHeight = 0.5
    } = options || {};
    
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont(this.fontFamily, fontWeight);

    const textWidth = maxWidth || (this.pageWidth - (this.margin * 2));
    const lines = this.pdf.splitTextToSize(text, textWidth);

    lines.forEach((line: string) => {
      this.pdf.text(line, x, this.currentY);
      this.addCurrentY(fontSize * lineHeight);
    });

    this.addCurrentY(indent);
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
    this.pdf.setFont(this.fontFamily, "bold");
    this.pdf.text(exp.job_title, this.margin, this.currentY);
    this.addCurrentY(5);

    this.pdf.setFontSize(10);
    this.pdf.text(exp.company, this.margin, this.currentY);
    this.addCurrentY(5);
    this.pdf.setFont(this.fontFamily, "normal");
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(exp.dates, this.margin, this.currentY);
    this.addCurrentY(5);
    this.pdf.setTextColor(0, 0, 0);
    this.addBoxedText(exp.description);
    this.addCurrentY(2);
  }

  private addEducationItem(edu: any): void {
    this.pdf.setFontSize(10);
    this.pdf.setFont(this.fontFamily, "bold");
    this.pdf.text(edu.degree, this.margin, this.currentY);
    this.addCurrentY(5);

    this.pdf.setFont(this.fontFamily, "normal");
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
    this.pdf.setFont(this.fontFamily, "normal");
    const headerColor = this.hexToRgb('#0DC076');
    this.pdf.setTextColor(headerColor.r, headerColor.g, headerColor.b);
    this.pdf.text(title, x, this.currentY);
    this.pdf.setTextColor(0, 0, 0);
    this.addCurrentYToPage(indent);
  }

  private addModernExperienceItem(exp: any, x: number = this.margin, maxWidth?: number): void {
    this.pdf.setFontSize(11);
    this.pdf.setFont(this.fontFamily, "bold");
    this.pdf.text(exp.job_title, x, this.currentY);
    this.addCurrentYToPage(5);

    this.pdf.setFontSize(10);
    this.pdf.setFont(this.fontFamily, "normal");
    this.pdf.text(exp.company, x, this.currentY);
    this.addCurrentYToPage(5);
    
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(exp.dates, x, this.currentY);
    this.addCurrentYToPage(5);
    this.pdf.setTextColor(0, 0, 0);

    this.addBoxedText(exp.description, { x: x, fontSize: 9, maxWidth: maxWidth, indent: 2 });
    this.addCurrentYToPage(2);
  }

  // Вспомогательные методы для минималистичного дизайна
  private addMinimalSectionHeader(title: string): void {
    this.pdf.setFontSize(16);
    this.pdf.setFont(this.fontFamily);
    this.pdf.text(title, this.margin, this.currentY);
    this.addCurrentY(6);
  }

  private addMinimalSkillsList(skills: string[]): void {
    this.pdf.setFontSize(10);
    this.pdf.setFont(this.fontFamily, "normal");
    const skillsText = skills.join("  |  ");
    const lines = this.pdf.splitTextToSize(skillsText, this.pageWidth - (this.margin * 2));

    lines.forEach((line: string, index: number) => {
      this.pdf.text(line, this.margin, this.currentY + (index * 6));
    });

    this.addCurrentY(lines.length * 10 * 0.5 + 3);
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
    this.pdf.setFont(this.fontFamily, 'normal');
    
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
    
    // Добавляем основной контент используя существующий метод
    this.addBoxedText(content, { fontSize: 10 });
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