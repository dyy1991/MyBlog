import { NextRequest, NextResponse } from 'next/server';
import { files } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    files.delete(params.id);
    return NextResponse.json({ message: '文件删除成功' });
  } catch (error) {
    return NextResponse.json({ error: '删除文件失败' }, { status: 500 });
  }
}

