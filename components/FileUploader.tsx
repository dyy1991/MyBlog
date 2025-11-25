'use client';

import { useState, useEffect } from 'react';

interface File {
  id: string;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  uploaded_at: string;
}

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('加载文件失败:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        loadFiles();
        alert('文件上传成功');
      } else {
        alert('文件上传失败');
      }
    } catch (error) {
      console.error('上传错误:', error);
      alert('文件上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个文件吗？')) return;

    try {
      const response = await fetch(`/api/files/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadFiles();
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isImage = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  const isVideo = (fileType: string) => {
    return fileType.startsWith('video/');
  };

  const isMarkdown = (filename: string) => {
    return filename.endsWith('.md') || filename.endsWith('.markdown');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 inline-block">
          {uploading ? '上传中...' : '选择文件上传'}
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
            accept=".md,.markdown,.mp4,.mov,.avi,.jpg,.jpeg,.png,.gif"
          />
        </label>
        <p className="text-sm text-[var(--page-text)] opacity-70 mt-2">
          支持的文件类型：Markdown (.md), 视频 (.mp4, .mov, .avi), 图片 (.jpg, .png, .gif)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="border border-gray-200 dark:border-gray-700 rounded p-4 hover:shadow-lg transition bg-[var(--content-bg)]"
          >
            {isImage(file.file_type) && (
              <div className="relative w-full h-32 mb-2">
                <img
                  src={file.file_path}
                  alt={file.original_name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            {isVideo(file.file_type) && (
              <div className="w-full h-32 mb-2 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            )}
            {isMarkdown(file.original_name) && (
              <div className="w-full h-32 mb-2 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium truncate text-[var(--page-text)]" title={file.original_name}>
                {file.original_name}
              </p>
              <p className="text-xs text-[var(--page-text)] opacity-70">
                {formatFileSize(file.file_size)} • {new Date(file.uploaded_at).toLocaleDateString('zh-CN')}
              </p>
              <div className="flex gap-2 mt-2">
                <a
                  href={file.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                  查看
                </a>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:underline"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <p className="text-center text-[var(--page-text)] opacity-70 py-8">暂无文件</p>
      )}
    </div>
  );
}

