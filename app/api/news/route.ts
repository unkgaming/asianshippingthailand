import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch all news (published only for non-staff, all for staff)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isStaff = session?.user && (session.user as any).role === 'employee';

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    // If slug is provided, fetch single article
    if (slug) {
      const article = await prisma.news.findUnique({
        where: { slug },
      });

      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }

      // Non-staff can only see published articles
      if (!isStaff && !article.published) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }

      return NextResponse.json({ ok: true, data: article });
    }

    // Fetch all articles
    const where = isStaff ? {} : { published: true };
    const articles = await prisma.news.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });

    return NextResponse.json({ ok: true, data: articles });
  } catch (error: any) {
    console.error('News GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST: Create new news article (staff only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'employee') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, excerpt, content, imageUrl, published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now();

    const article = await prisma.news.create({
      data: {
        slug,
        title,
        excerpt: excerpt || null,
        content,
        imageUrl: imageUrl || null,
        author: session.user.email!,
        published: published || false,
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json({ ok: true, data: article }, { status: 201 });
  } catch (error: any) {
    console.error('News POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create article' },
      { status: 500 }
    );
  }
}

// PUT: Update news article (staff only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'employee') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, excerpt, content, imageUrl, published } = body;

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    const existingArticle = await prisma.news.findUnique({ where: { id } });
    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Update publishedAt if status changes to published
    const updateData: any = {
      title: title || existingArticle.title,
      excerpt: excerpt !== undefined ? excerpt : existingArticle.excerpt,
      content: content || existingArticle.content,
      imageUrl: imageUrl !== undefined ? imageUrl : existingArticle.imageUrl,
      published: published !== undefined ? published : existingArticle.published,
    };

    // Set publishedAt when publishing for the first time
    if (published && !existingArticle.published) {
      updateData.publishedAt = new Date();
    }

    const article = await prisma.news.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ ok: true, data: article });
  } catch (error: any) {
    console.error('News PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE: Delete news article (staff only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'employee') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    await prisma.news.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('News DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete article' },
      { status: 500 }
    );
  }
}
