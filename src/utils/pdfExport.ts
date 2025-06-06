// src/utils/pdfExport.ts
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (slides: any[], darkMode: boolean) => {
  try {
    const pdf = new jsPDF('landscape', 'pt', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < slides.length; i++) {
      // Create a temporary div for each slide
      const tempDiv = document.createElement('div');
      tempDiv.className = `${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-8`;
      tempDiv.style.width = '1200px'; // Fixed width for consistent rendering
      
      // Add slide content
      tempDiv.innerHTML = `
        <h2 class="text-3xl font-bold mb-6">${slides[i].title}</h2>
        <div class="text-lg whitespace-pre-wrap">${slides[i].content}</div>
      `;
      
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        backgroundColor: darkMode ? '#1f2937' : '#ffffff'
      });

      // Add to PDF
      const imgData = canvas.toDataURL('image/png');
      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');

      // Clean up
      document.body.removeChild(tempDiv);
    }

    pdf.save('pitch-deck.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
