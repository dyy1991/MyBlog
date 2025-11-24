import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
const postsFile = path.join(dataDir, 'posts.json');
const commentsFile = path.join(dataDir, 'comments.json');
const filesFile = path.join(dataDir, 'files.json');
const aiConversationsFile = path.join(dataDir, 'ai_conversations.json');
const categoriesFile = path.join(dataDir, 'categories.json');

// 确保数据目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 读取 JSON 文件
function readJsonFile<T>(filePath: string, defaultValue: T[] = []): T[] {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`读取文件 ${filePath} 失败:`, error);
  }
  return defaultValue;
}

// 写入 JSON 文件
function writeJsonFile<T>(filePath: string, data: T[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`写入文件 ${filePath} 失败:`, error);
    throw error;
  }
}

// 初始化数据库
export function initDatabase() {
  // 初始化文件（如果不存在）
  if (!fs.existsSync(postsFile)) {
    writeJsonFile(postsFile, []);
  }
  if (!fs.existsSync(commentsFile)) {
    writeJsonFile(commentsFile, []);
  }
  if (!fs.existsSync(filesFile)) {
    writeJsonFile(filesFile, []);
  }
  if (!fs.existsSync(aiConversationsFile)) {
    writeJsonFile(aiConversationsFile, []);
  }
  if (!fs.existsSync(categoriesFile)) {
    writeJsonFile(categoriesFile, [
      {
        id: uuidv4(),
        name: 'Music',
        slug: 'music',
        description: '音乐与创作灵感',
        created_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: '生活方式与灵感',
        created_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Management',
        slug: 'management',
        description: '效率与管理方法',
        created_at: new Date().toISOString(),
      },
    ]);
  }
}

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  author?: string;
  created_at: string;
  updated_at: string;
  featured_image?: string;
  is_published: number;
}

interface Comment {
  id: string;
  post_id: string;
  author: string;
  email?: string;
  content: string;
  created_at: string;
  parent_id?: string;
}

interface File {
  id: string;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  uploaded_at: string;
  post_id?: string;
}

interface AIConversation {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  post_id?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');

// 文章相关操作
export const posts = {
  getAll: (): Post[] => {
    const allPosts = readJsonFile<Post>(postsFile);
    return allPosts
      .filter(post => post.is_published === 1)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  
  getById: (id: string): Post | undefined => {
    const allPosts = readJsonFile<Post>(postsFile);
    return allPosts.find(post => post.id === id);
  },
  
  create: (data: {
    title: string;
    content: string;
    excerpt?: string;
    category?: string;
    author?: string;
    featured_image?: string;
  }): string => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newPost: Post = {
      id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || '',
      category: data.category || '',
      author: data.author || 'John Doe',
      created_at: now,
      updated_at: now,
      featured_image: data.featured_image || '',
      is_published: 1,
    };
    
    const allPosts = readJsonFile<Post>(postsFile);
    allPosts.push(newPost);
    writeJsonFile(postsFile, allPosts);
    return id;
  },
  
  update: (id: string, data: {
    title?: string;
    content?: string;
    excerpt?: string;
    category?: string;
    featured_image?: string;
  }): void => {
    const allPosts = readJsonFile<Post>(postsFile);
    const index = allPosts.findIndex(post => post.id === id);
    
    if (index !== -1) {
      if (data.title !== undefined) allPosts[index].title = data.title;
      if (data.content !== undefined) allPosts[index].content = data.content;
      if (data.excerpt !== undefined) allPosts[index].excerpt = data.excerpt;
      if (data.category !== undefined) allPosts[index].category = data.category;
      if (data.featured_image !== undefined) allPosts[index].featured_image = data.featured_image;
      allPosts[index].updated_at = new Date().toISOString();
      writeJsonFile(postsFile, allPosts);
    }
  },
  
  delete: (id: string): void => {
    const allPosts = readJsonFile<Post>(postsFile);
    const filtered = allPosts.filter(post => post.id !== id);
    writeJsonFile(postsFile, filtered);
  },
};

// 评论相关操作
export const comments = {
  getByPostId: (postId: string): Comment[] => {
    const allComments = readJsonFile<Comment>(commentsFile);
    return allComments
      .filter(comment => comment.post_id === postId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },
  
  create: (data: {
    post_id: string;
    author: string;
    email?: string;
    content: string;
    parent_id?: string;
  }): string => {
    const id = uuidv4();
    const newComment: Comment = {
      id,
      post_id: data.post_id,
      author: data.author,
      email: data.email || '',
      content: data.content,
      created_at: new Date().toISOString(),
      parent_id: data.parent_id || undefined,
    };
    
    const allComments = readJsonFile<Comment>(commentsFile);
    allComments.push(newComment);
    writeJsonFile(commentsFile, allComments);
    return id;
  },
  
  delete: (id: string): void => {
    const allComments = readJsonFile<Comment>(commentsFile);
    const filtered = allComments.filter(comment => comment.id !== id);
    writeJsonFile(commentsFile, filtered);
  },
};

// 文件相关操作
export const files = {
  create: (data: {
    filename: string;
    original_name: string;
    file_type: string;
    file_size: number;
    file_path: string;
    post_id?: string;
  }): string => {
    const id = uuidv4();
    const newFile: File = {
      id,
      filename: data.filename,
      original_name: data.original_name,
      file_type: data.file_type,
      file_size: data.file_size,
      file_path: data.file_path,
      uploaded_at: new Date().toISOString(),
      post_id: data.post_id || undefined,
    };
    
    const allFiles = readJsonFile<File>(filesFile);
    allFiles.push(newFile);
    writeJsonFile(filesFile, allFiles);
    return id;
  },
  
  getByPostId: (postId: string): File[] => {
    const allFiles = readJsonFile<File>(filesFile);
    return allFiles.filter(file => file.post_id === postId);
  },
  
  getAll: (): File[] => {
    const allFiles = readJsonFile<File>(filesFile);
    return allFiles.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
  },
  
  delete: (id: string): void => {
    const allFiles = readJsonFile<File>(filesFile);
    const file = allFiles.find(f => f.id === id);
    
    if (file) {
      const filePath = path.join(process.cwd(), 'public', file.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      const filtered = allFiles.filter(f => f.id !== id);
      writeJsonFile(filesFile, filtered);
    }
  },
};

// AI对话相关操作
export const aiConversations = {
  create: (data: {
    question: string;
    answer: string;
    post_id?: string;
  }): string => {
    const id = uuidv4();
    const newConversation: AIConversation = {
      id,
      question: data.question,
      answer: data.answer,
      created_at: new Date().toISOString(),
      post_id: data.post_id || undefined,
    };
    
    const allConversations = readJsonFile<AIConversation>(aiConversationsFile);
    allConversations.push(newConversation);
    writeJsonFile(aiConversationsFile, allConversations);
    return id;
  },
  
  getRecent: (limit: number = 10): AIConversation[] => {
    const allConversations = readJsonFile<AIConversation>(aiConversationsFile);
    return allConversations
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },
};

// 分类相关操作
export const categories = {
  getAll: (): Category[] => {
    return readJsonFile<Category>(categoriesFile).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  },

  create: (data: { name: string; slug?: string; description?: string }): string => {
    const allCategories = readJsonFile<Category>(categoriesFile);

    const slug = (data.slug || slugify(data.name)).replace(/^-+|-+$/g, '') || slugify(uuidv4());
    if (allCategories.some(category => category.slug === slug)) {
      throw new Error('分类 slug 已存在');
    }

    const newCategory: Category = {
      id: uuidv4(),
      name: data.name,
      slug,
      description: data.description || '',
      created_at: new Date().toISOString(),
    };

    allCategories.push(newCategory);
    writeJsonFile(categoriesFile, allCategories);
    return newCategory.id;
  },

  delete: (id: string): void => {
    const allCategories = readJsonFile<Category>(categoriesFile);
    const filtered = allCategories.filter(category => category.id !== id);
    writeJsonFile(categoriesFile, filtered);
  },
};

// 初始化数据库
initDatabase();
