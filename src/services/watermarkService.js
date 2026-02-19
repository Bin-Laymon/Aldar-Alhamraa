const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function generateWatermarkedPdf({ sourcePath, buyerName, buyerEmail, orderId }) {
  const bytes = fs.readFileSync(sourcePath);
  const pdfDoc = await PDFDocument.load(bytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const watermarkText = `Licensed to: ${buyerName} (${buyerEmail}) | Order #${orderId}`;
  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(watermarkText, {
      x: width * 0.1,
      y: height * 0.05,
      size: 10,
      font,
      color: rgb(0.55, 0, 0)
    });
  });

  const outputBytes = await pdfDoc.save();
  const outputDir = path.join(process.cwd(), 'storage/downloads');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${orderId}-${Date.now()}.pdf`);
  fs.writeFileSync(outputPath, outputBytes);
  return outputPath;
}

module.exports = { generateWatermarkedPdf };
