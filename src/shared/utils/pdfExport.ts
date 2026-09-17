import { jsPDF } from 'jspdf';

export const exportToPDF = async (_elementId: string, _filename: string) => {
  if (import.meta.env.DEV) console.error('exportToPDF is deprecated and requires html2canvas which was removed.');
  throw new Error('exportToPDF is deprecated. Use exportAllSlidesToPDF instead.');
};

export const exportAllSlidesToPDF = async (slides: any[], filename: string, _darkMode?: boolean) => {
  try {
    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    const pageWidth = 297; // A4 landscape width
    const pageHeight = 210; // A4 landscape height
    
    // Background color: dark gray
    const bgR = 55, bgG = 65, bgB = 81; 
    
    for (let i = 0; i < slides.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      // Draw background
      pdf.setFillColor(bgR, bgG, bgB);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Draw title banner
      const bannerMargin = 20;
      const bannerY = 20;
      const bannerHeight = 25;
      
      pdf.setFillColor(139, 92, 246); // Violet color
      pdf.rect(bannerMargin, bannerY, pageWidth - (bannerMargin * 2), bannerHeight, 'F');
      
      // Add title text
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      
      const title = slides[i].title || '';
      // Center the title text
      const titleWidth = pdf.getStringUnitWidth(title) * 28 / pdf.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2;
      pdf.text(title, titleX, bannerY + 17);
      
      // Add content text
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(230, 230, 230);
      
      const content = slides[i].content || '';
      const textLines = pdf.splitTextToSize(content, pageWidth - (bannerMargin * 2));
      
      pdf.text(textLines, bannerMargin, bannerY + bannerHeight + 15);
    }
    
    pdf.save(`${filename}.pdf`);
  } catch (error) { 
    if (import.meta.env.DEV) console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
