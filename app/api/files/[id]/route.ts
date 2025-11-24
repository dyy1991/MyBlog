import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { files } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const record = await files.delete(params.id);

    if (record?.file_path) {
      const absolutePath = path.join(process.cwd(), 'public', record.file_path);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    return NextResponse.json({ message: '文件删除成功' });
  } catch (error) {
    return NextResponse.json({ error: '删除文件失败' }, { status: 500 });
  }
}

