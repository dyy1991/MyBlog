import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { files } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const postId = formData.get('postId') as string | null;

    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 });
    }

    // 创建上传目录
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const originalName = file.name;
    const ext = path.extname(originalName);
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 保存文件信息到数据库
    const relativePath = `/uploads/${filename}`;
    const fileId = await files.create({
      filename,
      original_name: originalName,
      file_type: file.type || ext,
      file_size: file.size,
      file_path: relativePath,
      post_id: postId || undefined,
    });

    return NextResponse.json({
      id: fileId,
      url: relativePath,
      filename: originalName,
      message: '文件上传成功',
    });
  } catch (error) {
    console.error('上传错误:', error);
    return NextResponse.json({ error: '文件上传失败' }, { status: 500 });
  }
}

