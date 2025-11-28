import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

type Maybe<T> = T | null;

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  author?: string;
  created_at: string;
  updated_at?: string;
  featured_image?: string;
  is_published?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  author: string;
  email?: string;
  content: string;
  created_at: string;
  parent_id?: string;
}

export interface FileMeta {
  id: string;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  uploaded_at: string;
  post_id?: string;
}

export interface AIConversation {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  post_id?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase 环境变量未配置，请检查 NEXT_PUBLIC_SUPABASE_URL 与 SUPABASE_SERVICE_ROLE_KEY');
  }

  supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  return supabaseClient;
}

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');

async function ensureUniqueSlug(slug: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('categories').select('id').eq('slug', slug).maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  if (data) {
    throw new Error('分类 slug 已存在');
  }
}

export const posts = {
  async getAll(): Promise<Post[]> {
    const supabase = getSupabase();
    // 获取所有已发布的文章（is_published != false，包括 true 和 null）
    // 不按分类过滤，获取所有文章
    // 注意：如果使用 ANON_KEY，可能受到 RLS 策略限制
    const { data, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取文章列表失败:', error);
      console.error('错误详情:', JSON.stringify(error, null, 2));
      throw error;
    }

    // 调试信息：检查查询结果
    console.log(`[getAll] 查询到的文章总数: ${data?.length ?? 0}, 数据库计数: ${count ?? 'N/A'}`);
    if (data) {
      data.forEach((post, index) => {
        console.log(`[getAll] 文章 ${index + 1}: id=${post.id}, title=${post.title?.substring(0, 20)}, is_published=${post.is_published}, category=${post.category}`);
      });
    }

    // 在代码中过滤掉未发布的文章（is_published === false）
    // 保留 is_published === true 或 is_published === null/undefined 的文章
    const publishedPosts = (data ?? []).filter(
      (post) => post.is_published !== false
    );

    console.log(`[getAll] 过滤后的已发布文章数: ${publishedPosts.length}`);
    return publishedPosts;
  },

  async getAllForAdmin(): Promise<Post[]> {
    const supabase = getSupabase();
    // 获取所有文章（包括未发布的），供管理后台使用
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取文章列表失败:', error);
      throw error;
    }

    return data ?? [];
  },

  async getById(id: string): Promise<Maybe<Post>> {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();

    if (error) {
      console.error('获取文章失败:', error);
      throw error;
    }

    return data ?? null;
  },

  async getByCategory(categoryName: string): Promise<Post[]> {
    const supabase = getSupabase();
    // 获取指定分类的所有已发布文章
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', categoryName)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取分类文章失败:', error);
      throw error;
    }

    // 在代码中过滤掉未发布的文章（is_published === false）
    // 保留 is_published === true 或 is_published === null/undefined 的文章
    const publishedPosts = (data ?? []).filter(
      (post) => post.is_published !== false
    );

    return publishedPosts;
  },

  async create(data: {
    title: string;
    content: string;
    excerpt?: string;
    category?: string;
    author?: string;
    featured_image?: string;
  }): Promise<string> {
    const supabase = getSupabase();
    const payload = {
      id: uuidv4(),
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || '',
      category: data.category || '',
      author: data.author || 'John Doe',
      featured_image: data.featured_image || '',
      is_published: true,
    };

    const { data: inserted, error } = await supabase.from('posts').insert(payload).select('id').single();

    if (error) {
      console.error('创建文章失败:', error);
      throw error;
    }

    return inserted?.id as string;
  },

  async update(
    id: string,
    data: {
      title?: string;
      content?: string;
      excerpt?: string;
      category?: string;
      featured_image?: string;
    },
  ): Promise<void> {
    const supabase = getSupabase();
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (data.title !== undefined) updates.title = data.title;
    if (data.content !== undefined) updates.content = data.content;
    if (data.excerpt !== undefined) updates.excerpt = data.excerpt;
    if (data.category !== undefined) updates.category = data.category;
    if (data.featured_image !== undefined) updates.featured_image = data.featured_image;

    const { error } = await supabase.from('posts').update(updates).eq('id', id);

    if (error) {
      console.error('更新文章失败:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      console.error('删除文章失败:', error);
      throw error;
    }
  },
};

export const comments = {
  async getByPostId(postId: string): Promise<Comment[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('获取评论失败:', error);
      throw error;
    }

    return data ?? [];
  },

  async create(data: { post_id: string; author: string; email?: string; content: string; parent_id?: string }) {
    const supabase = getSupabase();
    const payload = {
      id: uuidv4(),
      post_id: data.post_id,
      author: data.author,
      email: data.email || '',
      content: data.content,
      parent_id: data.parent_id || null,
    };

    const { data: inserted, error } = await supabase.from('comments').insert(payload).select('id').single();

    if (error) {
      console.error('创建评论失败:', error);
      throw error;
    }

    return inserted?.id as string;
  },

  async delete(id: string) {
    const supabase = getSupabase();
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) {
      console.error('删除评论失败:', error);
      throw error;
    }
  },
};

export const files = {
  async create(data: {
    filename: string;
    original_name: string;
    file_type: string;
    file_size: number;
    file_path: string;
    post_id?: string;
  }): Promise<string> {
    const supabase = getSupabase();
    const payload = {
      id: uuidv4(),
      filename: data.filename,
      original_name: data.original_name,
      file_type: data.file_type,
      file_size: data.file_size,
      file_path: data.file_path,
      post_id: data.post_id || null,
    };

    const { data: inserted, error } = await supabase.from('files').insert(payload).select('id').single();

    if (error) {
      console.error('保存文件记录失败:', error);
      throw error;
    }

    return inserted?.id as string;
  },

  async getByPostId(postId: string): Promise<FileMeta[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('files').select('*').eq('post_id', postId);
    if (error) {
      console.error('获取文件失败:', error);
      throw error;
    }
    return data ?? [];
  },

  async getAll(): Promise<FileMeta[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('files').select('*').order('uploaded_at', { ascending: false });
    if (error) {
      console.error('获取文件列表失败:', error);
      throw error;
    }
    return data ?? [];
  },

  async delete(id: string): Promise<FileMeta | null> {
    const supabase = getSupabase();
    const { data: fileRecord, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('查询文件失败:', fetchError);
      throw fetchError;
    }

    if (fileRecord) {
      // 从 Supabase Storage 删除文件
      const filePath = fileRecord.file_path;
      // 如果 file_path 是完整的 URL，提取路径部分
      const pathMatch = filePath.match(/uploads\/(.+)$/);
      if (pathMatch) {
        const storagePath = `uploads/${pathMatch[1]}`;
        const { error: storageError } = await supabase.storage.from('files').remove([storagePath]);
        if (storageError) {
          console.error('删除存储文件失败:', storageError);
          // 继续删除数据库记录，即使存储删除失败
        }
      }
    }

    const { error } = await supabase.from('files').delete().eq('id', id);
    if (error) {
      console.error('删除文件记录失败:', error);
      throw error;
    }

    return fileRecord ?? null;
  },
};

export const aiConversations = {
  async create(data: { question: string; answer: string; post_id?: string }) {
    const supabase = getSupabase();
    const payload = {
      id: uuidv4(),
      question: data.question,
      answer: data.answer,
      post_id: data.post_id || null,
    };

    const { data: inserted, error } = await supabase.from('ai_conversations').insert(payload).select('id').single();

    if (error) {
      console.error('保存 AI 对话失败:', error);
      throw error;
    }

    return inserted?.id as string;
  },

  async getRecent(limit = 10): Promise<AIConversation[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取对话失败:', error);
      throw error;
    }

    return data ?? [];
  },
};

export const categories = {
  async getAll(): Promise<Category[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });

    if (error) {
      console.error('获取分类失败:', error);
      throw error;
    }

    return data ?? [];
  },

  async getBySlug(slug: string): Promise<Maybe<Category>> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('获取分类失败:', error);
      throw error;
    }

    return data ?? null;
  },

  async create(data: { name: string; slug?: string; description?: string }): Promise<string> {
    const supabase = getSupabase();
    const slug = (data.slug || slugify(data.name)).replace(/^-+|-+$/g, '') || slugify(uuidv4());

    await ensureUniqueSlug(slug);

    const payload = {
      id: uuidv4(),
      name: data.name,
      slug,
      description: data.description || '',
    };

    const { data: inserted, error } = await supabase.from('categories').insert(payload).select('id').single();

    if (error) {
      console.error('创建分类失败:', error);
      throw error;
    }

    return inserted?.id as string;
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      console.error('删除分类失败:', error);
      throw error;
    }
  },
};

