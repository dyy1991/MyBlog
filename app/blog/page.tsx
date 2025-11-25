import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { posts } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const allPosts = await posts.getAll();

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] transition-colors duration-300">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">所有文章</h1>
        
        {allPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">暂无文章，快去创建第一篇吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

