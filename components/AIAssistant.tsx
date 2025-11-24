'use client';

import { useState } from 'react';

export default function AIAssistant({ postId }: { postId?: string }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ question: string; answer: string }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          postId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAnswer(data.answer);
        setConversationHistory([...conversationHistory, { question, answer: data.answer }]);
        setQuestion('');
      } else {
        alert('AI 助手暂时无法响应，请稍后再试');
      }
    } catch (error) {
      console.error('AI 请求失败:', error);
      alert('AI 助手暂时无法响应，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">💬 向 AI 助手提问</h3>
        <p className="text-sm text-gray-600">
          可以询问关于这篇文章的问题，或者任何其他问题
        </p>
      </div>

      {conversationHistory.length > 0 && (
        <div className="mb-6 space-y-4 max-h-96 overflow-y-auto">
          {conversationHistory.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                <p className="text-sm font-medium text-gray-700">Q: {item.question}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded border-l-4 border-gray-400">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">A: {item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="输入你的问题..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '思考中...' : '发送'}
        </button>
      </form>

      {answer && conversationHistory.length === 0 && (
        <div className="mt-4 p-4 bg-white rounded border">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
}

