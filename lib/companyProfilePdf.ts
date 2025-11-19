import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface GenerateOptions {
  includeThai?: boolean;
  imageDir?: string;
}

const COLORS = {
  brand: '#0B2E4A',
  brandLight: '#1E4A6F',
  accent: '#D4A028',
  accentLight: '#F4E5C2',
  bgSoft: '#F8FAFB',
  text: '#1A1A1A',
  textMute: '#6B7280',
  white: '#FFFFFF'
};

function drawImage(doc: PDFKit.PDFDocument, imgPath: string, x: number, y: number, opts: {width?: number; height?: number; radius?: number}) {
  try {
    if (fs.existsSync(imgPath)) {
      doc.image(imgPath, x, y, { fit: [opts.width || 200, opts.height || 100], align: 'center', valign: 'center' });
    } else {
      const w = opts.width || 200; const h = opts.height || 100;
      doc.save();
      doc.rect(x, y, w, h).dash(4, { space: 4 }).stroke(COLORS.textMute).undash();
      doc.fontSize(10).fillColor(COLORS.textMute).text('Image Placeholder', x + 8, y + h/2 - 6, { width: w - 16, align: 'center' });
      doc.restore();
    }
  } catch { /* ignore */ }
}

function header(doc: PDFKit.PDFDocument, pageIndex: number) {
  const { width } = doc.page;
  doc.save();
  doc.rect(0, 0, width, 35).fill(COLORS.brand);
  doc.fillColor(COLORS.white).fontSize(13).font('Helvetica-Bold').text('ASIAN SHIPPING', 20, 11, { continued: false });
  doc.font('Helvetica').fontSize(9).fillColor(COLORS.accentLight).text('Professional Logistics Solutions', 20, 24);
  doc.fontSize(9).fillColor(COLORS.white).text('Company Profile', width - 110, 13, { width: 90, align: 'right', continued: false });
  doc.restore();
  doc.y = 55;
}

function footer(doc: PDFKit.PDFDocument, pageNum: number) {
  const { width, height } = doc.page;
  doc.save();
  doc.rect(0, height - 40, width, 40).fill(COLORS.bgSoft);
  doc.fontSize(8).fillColor(COLORS.textMute).text('asian@asianshippingthai.com  |  +662 249 3889  |  Bangkok, Thailand', 40, height - 25, { width: width - 200, align: 'left' });
  doc.fontSize(8).fillColor(COLORS.brand).text('Page ' + pageNum, width - 70, height - 25, { width: 50, align: 'right' });
  doc.restore();
}

function sectionTitle(doc: PDFKit.PDFDocument, title: string) {
  doc.moveDown(0.5);
  const startX = 36;
  const startY = doc.y;
  // Accent bar on left
  doc.rect(startX, startY, 4, 20).fill(COLORS.accent);
  doc.fontSize(18).fillColor(COLORS.brand).font('Helvetica-Bold').text(title.toUpperCase(), startX + 12, startY + 1, { width: doc.page.width - 84, continued: false });
  doc.font('Helvetica');
  doc.moveDown(1);
}

function bulletColumns(doc: PDFKit.PDFDocument, items: string[], columns = 2) {
  const colWidth = (doc.page.width - 72) / columns;
  const startX = 36;
  const startY = doc.y;
  const rowCount = Math.ceil(items.length / columns);
  
  for (let row = 0; row < rowCount; row++) {
    const rowY = startY + (row * 22);
    for (let col = 0; col < columns; col++) {
      const idx = row * columns + col;
      if (idx >= items.length) break;
      const x = startX + (col * colWidth);
      // Accent circle bullet
      doc.circle(x + 3, rowY + 4, 3).fill(COLORS.accent);
      doc.fillColor(COLORS.text).fontSize(10.5).text(items[idx], x + 14, rowY, { width: colWidth - 20, align: 'left', lineGap: 2 });
    }
  }
  
  doc.y = startY + (rowCount * 22) + 15;
}

export async function generateCompanyProfilePDF(options: GenerateOptions = {}): Promise<Buffer> {
  const { includeThai = true, imageDir = path.join(process.cwd(), 'public', 'brochure') } = options;
  const doc = new PDFDocument({ size: 'A4', margin: 36, info: { Title: 'Company Profile - Asian Shipping (Thailand) Co., Ltd.' } });
  const chunks: Buffer[] = [];
  const thaiFontPath = path.join(process.cwd(), 'fonts', 'THSarabun.ttf');
  const hasThaiFont = fs.existsSync(thaiFontPath);
  if (hasThaiFont) doc.registerFont('THAI', thaiFontPath);
  doc.font('Helvetica');
  let pageIndex = 1;
  doc.on('pageAdded', () => {
    pageIndex++;
    header(doc, pageIndex);
  });
  return await new Promise((resolve, reject) => {
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    // COVER PAGE
    drawImage(doc, path.join(imageDir, 'cover.jpg'), 0, 0, { width: doc.page.width, height: doc.page.height });
    // Dark overlay
    doc.rect(0, 0, doc.page.width, doc.page.height).fillOpacity(0.7).fill(COLORS.brand).fillOpacity(1);
    // Top accent bar
    doc.rect(0, 0, doc.page.width, 6).fill(COLORS.accent);
    // Company name with better typography
    doc.font('Helvetica-Bold').fillColor(COLORS.white).fontSize(36).text('ASIAN SHIPPING', 50, 180, { width: doc.page.width - 100, align: 'left' });
    doc.fontSize(28).text('(THAILAND) CO., LTD.', 50, doc.y + 5, { width: doc.page.width - 100 });
    doc.font('Helvetica').moveDown(1).fontSize(16).fillColor(COLORS.accentLight).text('Integrated Global Logistics & Professional Freight Solutions', { width: doc.page.width - 100 });
    if (includeThai && hasThaiFont) {
      doc.font('THAI').moveDown(0.3).fontSize(14).fillColor('#FFFFFF').text('โซลูชันโลจิสติกส์ครบวงจร เชื่อมต่อการขนส่งทั่วโลก').font('Helvetica');
    }
    doc.fontSize(11).fillColor('#FFFFFF').text('Delivering reliability, visibility and performance across global supply chains.', 50, doc.page.height - 140, { width: doc.page.width - 100 });
    doc.fontSize(9).fillColor('#FFFFFF').text('© ' + new Date().getFullYear() + ' Asian Shipping (Thailand) Co., Ltd. All rights reserved.', 50, doc.page.height - 60);
    doc.addPage();
    header(doc, pageIndex + 1);
    // ABOUT PAGE
    sectionTitle(doc, 'About Us');
    doc.fontSize(11).fillColor(COLORS.text).text('Asian Shipping (Thailand) Co., Ltd. is a professional logistics provider delivering end‑to‑end solutions across sea freight (FCL/LCL), air freight, customs brokerage, inland trucking, and door‑to‑door services.', { lineGap: 3 });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor(COLORS.text).text('Backed by over 10 years of operational experience and a strong global partner network, we ensure seamless supply chain solutions tailored to your needs.', { lineGap: 3 });
    if (includeThai && hasThaiFont) {
      doc.moveDown(0.5).font('THAI').fontSize(11).fillColor(COLORS.text).text('บริษัท เอเชี่ยนชิปปิ้ง (ประเทศไทย) จำกัด เป็นผู้ให้บริการโลจิสติกส์ครบวงจร ทั้งทางเรือ ทางอากาศ พิธีการศุลกากร และการขนส่งภายในประเทศ พร้อมประสบการณ์มากกว่า 10 ปี และเครือข่ายพันธมิตรทั่วโลก').font('Helvetica');
    }
    doc.moveDown(0.8);
    sectionTitle(doc, 'Core Services');
    bulletColumns(doc, [
      'Sea Freight (FCL / LCL)',
      'Air Freight (Worldwide)',
      'Customs Brokerage',
      'Door-to-Door Services',
      'Inland Trucking (20’, 40’, 4W, 6W, 10W, Low-bed)',
      'Special / Oversize Handling'
    ]);
    const yImages = doc.y;
    drawImage(doc, path.join(imageDir, 'machinery.jpg'), 36, yImages, { width: 250, height: 130 });
    drawImage(doc, path.join(imageDir, 'equipment.jpg'), 36 + 250 + 12, yImages, { width: 250, height: 130 });
    doc.y = yImages + 140;
    footer(doc, 2);
    doc.addPage();
    // BENEFITS & STORIES PAGE
    sectionTitle(doc, 'Why Choose Us');
    bulletColumns(doc, [
      '10+ Years Experience',
      'Fast & Reliable',
      'Global Partners',
      'Complete Logistics Solutions',
      'Strong Customer Support'
    ], 1);
    sectionTitle(doc, 'Customer Story Highlights');
    const stories: {title: string; body: string}[] = [
      { title: 'Heavy Machinery Import (China)', body: 'Coordinated specialized lifting, secure lashing, and inland haulage with strict safety and timeline adherence.' },
      { title: 'Fitness Equipment Import', body: 'Managed multi-container scheduling ensuring synchronized rollout deliveries and condition integrity.' },
      { title: 'Industrial Relocation', body: 'End-to-end move planning, disassembly coordination, export documentation, and destination clearance.' },
      { title: 'Oversize Cargo Handling', body: 'Route surveys, low-bed approvals, engineered tie-down plans, and compliance oversight.' }
    ];
    stories.forEach((s, i) => {
      const boxY = doc.y;
      doc.save();
      // Accent left border
      doc.rect(36, boxY, 4, 65).fill(COLORS.accent);
      doc.roundedRect(40, boxY, doc.page.width - 76, 65, 4).fill(COLORS.bgSoft);
      doc.fillColor(COLORS.brand).fontSize(12).font('Helvetica-Bold').text(s.title, 50, boxY + 10, { width: doc.page.width - 100 });
      doc.font('Helvetica').fillColor(COLORS.text).fontSize(10).text(s.body, 50, boxY + 28, { width: doc.page.width - 100, lineGap: 1 });
      doc.restore();
      doc.moveDown(2.5);
    });
    const imgY2 = doc.y;
    drawImage(doc, path.join(imageDir, 'loading.jpg'), 36, imgY2, { width: 250, height: 110 });
    drawImage(doc, path.join(imageDir, 'inspection.jpg'), 36 + 250 + 12, imgY2, { width: 250, height: 110 });
    doc.y = imgY2 + 120;
    footer(doc, 3);
    doc.addPage();
    // CONTACT PAGE
    sectionTitle(doc, 'Contact & Coordination');
    doc.fontSize(11).fillColor(COLORS.text).text('ASIAN SHIPPING (THAILAND) CO., LTD.');
    doc.text('444 PAT BLDS, Building B, 5th Floor, Room 5/11');
    doc.text('TARUA Road, Klongtoey, Bangkok 10110 Thailand');
    doc.text('Tel: +662 249 3889 | Fax: +662 249 3778');
    doc.text('Mobile: +668-3294-7428, +669-8014-1684');
    doc.text('Email: asian@asianshippingthai.com');
    doc.moveDown(0.8);
    sectionTitle(doc, 'Key Contacts');
    ['Nattarin Niramitsupachet (MD) – annz@asianshippingthai.com','Parneavee (Import Manager)','Pawarisa (CS Export)','Natcha (Accounting)'].forEach(c => {
      doc.fillColor(COLORS.text).fontSize(10).text('• ' + c);
    });
    doc.moveDown(1.5);
    const teamY = doc.y;
    drawImage(doc, path.join(imageDir, 'team.jpg'), 36, teamY, { width: doc.page.width - 72, height: 180 });
    doc.y = teamY + 190;
    footer(doc, 4);
    doc.end();
  });
}

export async function saveCompanyProfilePDF(outputPath: string, opts: GenerateOptions = {}) {
  const buffer = await generateCompanyProfilePDF(opts);
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}
