import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { files } from '@/lib/db';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase 环境变量未配置');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const postId = formData.get('postId') as string | null;

    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 });
    }

    const supabase = getSupabase();

    // 生成唯一文件名
    const timestamp = Date.now();
    const originalName = file.name;
    const ext = path.extname(originalName);
    const filename = `${timestamp}-${uuidv4()}${ext}`;
    const filePath = `uploads/${filename}`;

    // 读取文件内容
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 上传到 Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase 上传错误:', uploadError);
      return NextResponse.json({ error: '文件上传失败: ' + uploadError.message }, { status: 500 });
    }

    // 获取公开 URL
    const { data: urlData } = supabase.storage.from('files').getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    // 保存文件信息到数据库
    const fileId = await files.create({
      filename,
      original_name: originalName,
      file_type: file.type || ext,
      file_size: file.size,
      file_path: publicUrl,
      post_id: postId || undefined,
    });

    return NextResponse.json({
      id: fileId,
      url: publicUrl,
      filename: originalName,
      message: '文件上传成功',
    });
  } catch (error: any) {
    console.error('上传错误:', error);
    return NextResponse.json({ error: '文件上传失败: ' + (error.message || '未知错误') }, { status: 500 });
  }
}

