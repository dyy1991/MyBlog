'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Post {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  author?: string;
  featured_image?: string;
}

interface PostEditorProps {
  post?: Post | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('John Doe');
  const [featuredImage, setFeaturedImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setExcerpt(post.excerpt || '');
      setCategory(post.category || '');
      setAuthor(post.author || 'John Doe');
      setFeaturedImage(post.featured_image || '');
    }
  }, [post]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategoryOptions(data);
      } catch (error) {
        console.error('加载分类失败', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (post?.id) {
        formData.append('postId', post.id);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setFeaturedImage(data.url);
      } else {
        alert('图片上传失败');
      }
    } catch (error) {
      console.error('上传错误:', error);
      alert('图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !content) {
      alert('标题和内容不能为空');
      return;
    }

    setSaving(true);
    try {
      const url = post?.id ? `/api/posts/${post.id}` : '/api/posts';
      const method = post?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          category,
          author,
          featured_image: featuredImage,
        }),
      });

      if (response.ok) {
        onSave();
      } else {
        alert('保存失败');
      }
    } catch (error) {
      console.error('保存错误:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{post ? '编辑文章' : '新建文章'}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            {previewMode ? '编辑' : '预览'}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {!previewMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入文章标题"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{loadingCategories ? '加载中...' : '选择分类'}</option>
                {categoryOptions.map(option => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="文章摘要（可选）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">特色图片</label>
            <div className="flex gap-4 items-center">
              {featuredImage && (
                <div className="relative w-32 h-32">
                  <Image
                    src={featuredImage}
                    alt="Featured"
                    fill
                    className="object-cover rounded"
                    unoptimized
                  />
                </div>
              )}
              <label className="px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                {uploading ? '上传中...' : '上传图片'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容 * (支持 Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入文章内容，支持 Markdown 格式..."
            />
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 rounded p-6 bg-white">
          <h1 className="text-3xl font-bold mb-4">{title || '标题'}</h1>
          {featuredImage && (
            <div className="relative w-full h-64 mb-4">
              <Image
                src={featuredImage}
                alt={title}
                fill
                className="object-cover rounded"
                unoptimized
              />
            </div>
          )}
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans">{content || '内容'}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

