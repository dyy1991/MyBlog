import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/lib/db';

export async function GET() {
  try {
    const list = await categories.getAll();
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: '获取分类失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, slug, description } = await request.json();
    if (!name) {
      return NextResponse.json({ error: '名称不能为空' }, { status: 400 });
    }

    const id = await categories.create({ name, slug, description });
    return NextResponse.json({ id, message: '分类创建成功' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || '创建分类失败' }, { status: 500 });
  }
}

