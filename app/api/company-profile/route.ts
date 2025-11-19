import { NextRequest } from 'next/server';
import { generateCompanyProfilePDF } from '@/lib/companyProfilePdf';

// Ensure this route runs in a Node.js environment (not Edge) so pdfkit can access filesystem
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeThaiParam = searchParams.get('thai');
    const includeThai = includeThaiParam === '1' || includeThaiParam === 'true';

    const pdfBuffer = await generateCompanyProfilePDF({ includeThai });
    const body = new Uint8Array(pdfBuffer);

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="company-profile.pdf"',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to generate PDF', detail: err?.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
