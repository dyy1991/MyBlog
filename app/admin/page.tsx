'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PostEditor from '@/components/PostEditor';
import FileUploader from '@/components/FileUploader';
import CategoryManager from '@/components/CategoryManager';
export const dynamic = 'force-dynamic';
interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  author?: string;
  created_at: string;
  featured_image?: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('philosophy-admin-auth');
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated]);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/posts?admin=true');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('加载文章失败:', error);
    }
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadPosts();
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  const handleSave = () => {
    setShowEditor(false);
    setEditingPost(null);
    loadPosts();
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Dyy5741948') {
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('philosophy-admin-auth', 'true');
      }
    } else {
      setAuthError('密码错误，请重试');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] transition-colors duration-300">
        <Header />
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-[var(--content-bg)] shadow rounded-lg p-8 border border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold mb-4 text-center text-[var(--page-text)]">管理后台登录</h1>
            <p className="text-sm text-[var(--page-text)] opacity-70 mb-6 text-center">请输入访问密码</p>
            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="输入密码"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--input-border)]"
                required
              />
              {authError && <p className="text-sm text-red-500">{authError}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                进入后台
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] transition-colors duration-300">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--page-text)]">管理后台</h1>
          <button
            onClick={handleCreateNew}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            新建文章
          </button>
        </div>

        {showEditor ? (
          <div className="bg-[var(--content-bg)] rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <PostEditor post={editingPost} onSave={handleSave} onCancel={() => setShowEditor(false)} />
          </div>
        ) : (
          <>
            <div className="bg-[var(--content-bg)] rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-[var(--content-bg)] opacity-90">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--page-text)] opacity-70 uppercase tracking-wider">
                      标题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--page-text)] opacity-70 uppercase tracking-wider">
                      分类
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--page-text)] opacity-70 uppercase tracking-wider">
                      作者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--page-text)] opacity-70 uppercase tracking-wider">
                      创建时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--page-text)] opacity-70 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[var(--content-bg)] divide-y divide-gray-200 dark:divide-gray-700">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[var(--page-text)]">{post.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--page-text)] opacity-70">{post.category || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--page-text)] opacity-70">{post.author || 'Oceanus Quest'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--page-text)] opacity-70">
                          {new Date(post.created_at).toLocaleDateString('zh-CN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-[var(--content-bg)] rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-[var(--page-text)]">文件管理</h2>
              <FileUploader />
            </div>

            <div className="mt-8 bg-[var(--content-bg)] rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <CategoryManager />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

