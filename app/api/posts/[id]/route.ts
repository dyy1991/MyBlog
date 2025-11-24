import { NextRequest, NextResponse } from 'next/server';
import { posts } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await posts.getById(params.id);
    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await posts.update(params.id, body);
    return NextResponse.json({ message: '文章更新成功' });
  } catch (error) {
    return NextResponse.json({ error: '更新文章失败' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await posts.delete(params.id);
    return NextResponse.json({ message: '文章删除成功' });
  } catch (error) {
    return NextResponse.json({ error: '删除文章失败' }, { status: 500 });
  }
}

