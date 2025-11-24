'use client';

import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('加载分类失败', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug: slug || undefined, description }),
      });

      if (res.ok) {
        setName('');
        setSlug('');
        setDescription('');
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || '创建分类失败');
      }
    } catch (error) {
      console.error('创建分类失败', error);
      alert('创建分类失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个分类吗？')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('删除分类失败', error);
      alert('删除失败');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">分类管理</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="分类名称 *"
            value={name}
            onChange={e => setName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Slug（可选，自动生成）"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="描述（可选）"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? '创建中...' : '新增分类'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded">
        <div className="grid grid-cols-4 gap-4 px-4 py-2 text-sm font-medium text-gray-500 border-b">
          <span>名称</span>
          <span>Slug</span>
          <span>描述</span>
          <span className="text-right">操作</span>
        </div>
        {loading ? (
          <p className="p-4 text-center text-gray-500">加载中...</p>
        ) : categories.length === 0 ? (
          <p className="p-4 text-center text-gray-500">暂无分类</p>
        ) : (
          categories.map(category => (
            <div key={category.id} className="grid grid-cols-4 gap-4 px-4 py-3 border-t text-sm items-center">
              <span className="font-medium">{category.name}</span>
              <span className="text-gray-500">{category.slug}</span>
              <span className="text-gray-500 truncate">{category.description || '-'}</span>
              <div className="text-right">
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

