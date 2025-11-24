import { NextRequest, NextResponse } from 'next/server';
import { aiConversations, posts } from '@/lib/db';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, postId } = body;

    if (!question) {
      return NextResponse.json({ error: '问题不能为空' }, { status: 400 });
    }

    // 获取文章内容（如果提供了 postId）
    let context = '';
    if (postId) {
      const post = await posts.getById(postId);
      if (post) {
        context = `文章标题：${post.title}\n文章内容：${post.content.substring(0, 1000)}...`;
      }
    }

    // 构建提示词
    const prompt = context
      ? `基于以下文章内容回答问题：\n\n${context}\n\n问题：${question}\n\n请用中文回答，回答要简洁明了。`
      : `请用中文回答以下问题，回答要简洁明了：\n\n${question}`;

    // 调用 OpenAI API（需要设置环境变量 OPENAI_API_KEY）
    // 如果没有配置 OpenAI，返回模拟回答
    const openaiApiKey = process.env.OPENAI_API_KEY;

    let answer = '';

    if (openaiApiKey) {
      try {
        const openai = new OpenAI({ apiKey: openaiApiKey });

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个友好的AI助手，擅长回答各种问题。请用中文回答，回答要简洁明了。',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        answer = completion.choices[0]?.message?.content || '抱歉，我无法回答这个问题。';
      } catch (openaiError) {
        console.error('OpenAI API 错误:', openaiError);
        answer = 'AI 服务暂时不可用，请稍后再试。';
      }
    } else {
      // 模拟回答（用于演示）
      answer = `感谢你的问题："${question}"。这是一个很好的问题！由于未配置 OpenAI API Key，这里显示的是模拟回答。要启用真实的 AI 功能，请在环境变量中设置 OPENAI_API_KEY。`;
    }

    // 保存对话历史
    await aiConversations.create({
      question,
      answer,
      post_id: postId || undefined,
    });

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('AI 聊天错误:', error);
    return NextResponse.json({ error: 'AI 服务错误' }, { status: 500 });
  }
}

