import { NextRequest, NextResponse } from 'next/server';
import { posts } from '@/lib/db';

export async function GET() {
  try {
    const allPosts = posts.getAll();
    return NextResponse.json(allPosts);
  } catch (error) {
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, category, author, featured_image } = body;

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    const id = posts.create({
      title,
      content,
      excerpt,
      category,
      author,
      featured_image,
    });

    return NextResponse.json({ id, message: '文章创建成功' });
  } catch (error) {
    return NextResponse.json({ error: '创建文章失败' }, { status: 500 });
  }
}

