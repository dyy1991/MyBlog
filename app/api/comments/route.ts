import { NextRequest, NextResponse } from 'next/server';
import { comments } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: '缺少 postId 参数' }, { status: 400 });
    }

    const commentsList = await comments.getByPostId(postId);
    return NextResponse.json(commentsList);
  } catch (error) {
    return NextResponse.json({ error: '获取评论失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_id, author, email, content, parent_id } = body;

    if (!post_id || !author || !content) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }

    const id = await comments.create({
      post_id,
      author,
      email,
      content,
      parent_id,
    });

    return NextResponse.json({ id, message: '评论创建成功' });
  } catch (error) {
    return NextResponse.json({ error: '创建评论失败' }, { status: 500 });
  }
}

