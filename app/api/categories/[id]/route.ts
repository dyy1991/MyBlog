import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/lib/db';

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: '缺少 id' }, { status: 400 });
    }
    await categories.delete(params.id);
    return NextResponse.json({ message: '分类删除成功' });
  } catch (error) {
    return NextResponse.json({ error: '删除分类失败' }, { status: 500 });
  }
}

