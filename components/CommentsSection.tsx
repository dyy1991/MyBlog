'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  author: string;
  email?: string;
  content: string;
  created_at: string;
  parent_id?: string;
}

export default function CommentsSection({ postId }: { postId: string }) {
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      setCommentsList(data);
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) {
      alert('请填写姓名和评论内容');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          author,
          email,
          content,
        }),
      });

      if (response.ok) {
        setAuthor('');
        setEmail('');
        setContent('');
        loadComments();
      } else {
        alert('提交评论失败');
      }
    } catch (error) {
      console.error('提交评论失败:', error);
      alert('提交评论失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="姓名 *"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <textarea
          placeholder="评论内容 *"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '提交中...' : '提交评论'}
        </button>
      </form>

      <div className="space-y-6">
        {commentsList.map((comment) => (
          <div key={comment.id} className="border-b border-gray-200 pb-4">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                {comment.author[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{comment.author}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
        {commentsList.length === 0 && (
          <p className="text-gray-500 text-center py-8">暂无评论，快来发表第一条吧！</p>
        )}
      </div>
    </div>
  );
}

