import Header from '@/components/Header';
import ReactMarkdown from 'react-markdown';

const aboutContent = `
# 关于这个博客

欢迎来到 **Philosophy Blog**。这里记录了我的所思所想、灵感摘录以及各种随缘更新的内容。

- 这是一个个人博客项目，重点在于记录灵感与分享体验
- 更新频率取决于灵感与时间，完全**随缘更新**
- 支持 Markdown 写作、文件上传、评论互动和 AI 问答
- 如果你喜欢这里的内容，欢迎常来看一看

> 生活与创作都不需要完美，只要保持好奇和热情。
`;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-16 prose prose-lg">
        <ReactMarkdown>{aboutContent}</ReactMarkdown>
      </div>
    </div>
  );
}

