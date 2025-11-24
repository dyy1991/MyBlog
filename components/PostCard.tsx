'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    category?: string;
    author?: string;
    created_at: string;
    featured_image?: string;
  };
  featured?: boolean;
  compact?: boolean;
}

const categoryColors: { [key: string]: string } = {
  MUSIC: 'bg-blue-500',
  LIFESTYLE: 'bg-green-500',
  MANAGEMENT: 'bg-green-500',
  default: 'bg-gray-500',
};

export default function PostCard({ post, featured = false, compact = false }: PostCardProps) {
  const categoryColor = categoryColors[post.category?.toUpperCase() || ''] || categoryColors.default;
  const date = new Date(post.created_at);
  const formattedDate = format(date, 'MMMM d, yyyy', { locale: zhCN });

  if (compact) {
    return (
      <Link href={`/post/${post.id}`} className="block group">
        {post.featured_image && (
          <div className="relative w-full h-48 mb-4 overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </div>
        )}
        <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
        )}
      </Link>
    );
  }

  return (
    <Link href={`/post/${post.id}`} className="block group">
      <div className="relative">
        {post.featured_image && (
          <div className={`relative ${featured ? 'h-96' : 'h-48'} overflow-hidden`}>
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </div>
        )}
        {post.category && (
          <div className={`absolute top-4 left-4 ${categoryColor} text-white px-3 py-1 text-sm font-semibold`}>
            {post.category.toUpperCase()}
          </div>
        )}
      </div>
      <div className={`mt-4 ${featured ? 'space-y-4' : 'space-y-2'}`}>
        <h2 className={`${featured ? 'text-3xl' : 'text-xl'} font-bold group-hover:text-blue-400 transition`}>
          {post.title}
        </h2>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
            {(post.author || 'JD')[0].toUpperCase()}
          </div>
          <span>{post.author || 'John Doe'}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}

