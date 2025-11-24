import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { posts } from '@/lib/db';

export default async function Home() {
  const allPosts = posts.getAll() as any[];

  // 获取特色文章（第一个）
  const featuredPost = allPosts[0] || null;
  const otherPosts = allPosts.slice(1, 3);
  const recentPosts = allPosts.slice(3, 7);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Main Content Area - Dark Background */}
      <section className="bg-dark-bg text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Post - Large */}
            {featuredPost && (
              <div className="lg:col-span-2">
                <PostCard post={featuredPost} featured />
              </div>
            )}

            {/* Smaller Posts - Right Side */}
            <div className="space-y-8">
              {otherPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lower Content Area - Light Background */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentPosts.map((post, index) => (
              <div key={post.id}>
                {index === 1 ? (
                  // Quote Post
                  <div className="bg-gray-100 p-8 h-full flex flex-col justify-center">
                    <div className="text-6xl text-gray-400 mb-4">"</div>
                    <p className="text-lg italic text-gray-700 mb-4">
                      {post.excerpt || 'Good design is making something intelligible and memorable. Great design is making something memorable and meaningful.'}
                    </p>
                    <p className="text-sm text-gray-600">— {post.author || 'Dieter Rams'}</p>
                  </div>
                ) : (
                  <PostCard post={post} compact />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

