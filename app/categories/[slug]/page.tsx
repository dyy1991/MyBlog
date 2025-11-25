import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { posts, categories } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  // 根据 slug 获取分类信息
  const category = await categories.getBySlug(params.slug);

  if (!category) {
    notFound();
  }

  // 获取该分类下的所有文章
  const categoryPosts = await posts.getByCategory(category.name);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] transition-colors duration-300">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-500 text-lg">{category.description}</p>
          )}
          <p className="text-sm text-gray-400 mt-2">
            共 {categoryPosts.length} 篇文章
          </p>
        </div>
        
        {categoryPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">该分类下暂无文章</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

