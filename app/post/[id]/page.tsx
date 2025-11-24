import Header from '@/components/Header';
import CommentsSection from '@/components/CommentsSection';
import AIAssistant from '@/components/AIAssistant';
import { posts } from '@/lib/db';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
export const dynamic = 'force-dynamic';
export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await posts.getById(params.id);

  if (!post) {
    notFound();
  }

  const date = new Date(post.created_at);
  const formattedDate = format(date, 'MMMM d, yyyy', { locale: zhCN });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 py-16">
        {post.featured_image && (
          <div className="relative w-full h-96 mb-8">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              unoptimized
            />
          </div>
        )}
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 text-gray-600 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              {(post.author || 'JD')[0].toUpperCase()}
            </div>
            <span>{post.author || 'John Doe'}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-16 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">评论</h2>
          <CommentsSection postId={params.id} />
        </div>

        <div className="mt-16 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">AI 助手</h2>
          <AIAssistant postId={params.id} />
        </div>
      </article>
    </div>
  );
}

