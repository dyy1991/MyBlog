import { NextResponse } from 'next/server';
import { files } from '@/lib/db';

export async function GET() {
  try {
    const allFiles = await files.getAll();
    return NextResponse.json(allFiles);
  } catch (error) {
    return NextResponse.json({ error: '获取文件失败' }, { status: 500 });
  }
}

