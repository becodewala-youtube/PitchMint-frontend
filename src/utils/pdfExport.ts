import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const exportAllSlidesToPDF = async (slides: any[], filename: string, darkMode: boolean) => {
  try {
    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    const pageWidth = 297; // A4 landscape width
    const pageHeight = 210; // A4 landscape height
    
    for (let i = 0; i < slides.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      // Create a temporary div for each slide
      const slideDiv = document.createElement('div');
      slideDiv.style.width = '1200px';
      slideDiv.style.height = '800px';
      slideDiv.style.padding = '60px';
      slideDiv.style.backgroundColor = darkMode ? '#374151' : '#ffffff';
      slideDiv.style.color = darkMode ? '#ffffff' : '#1f2937';
      slideDiv.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      slideDiv.style.position = 'absolute';
      slideDiv.style.left = '-9999px';
      slideDiv.style.top = '0';
      
      slideDiv.innerHTML = `
        <div style="height: 100%; display: flex; flex-direction: column;">
          <div style="
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 40px;
">
  <h2 style="
    font-size: 48px;
    font-weight: bold;
    color: white;
    margin: 0;
  ">
    ${slides[i].title}
  </h2>
</div>

          <div style="font-size: 18px; line-height: 1.8; white-space: pre-wrap; flex: 1; overflow: hidden; text-align: justify; ">${slides[i].content}</div>
        </div>
      `;
      
      document.body.appendChild(slideDiv);
      
      // Convert to canvas
      const canvas = await html2canvas(slideDiv, {
        scale: 1,
        useCORS: true,
        logging: false,
        backgroundColor: darkMode ? '#374151' : '#ffffff'
      });
      
      // Add to PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 20; // Leave some margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Center the image on the page
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      // Clean up
      document.body.removeChild(slideDiv);
    }
    
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};