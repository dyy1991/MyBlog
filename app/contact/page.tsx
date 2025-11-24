import Header from '@/components/Header';
export const dynamic = 'force-dynamic';
const contactInfo = [
  { label: '邮箱', value: '787833823@qq.com', href: 'mailto:787833823@qq.com' },
  { label: 'GitHub', value: 'github.com/dyy1991', href: 'https://github.com/dyy1991' },
  { label: '微博', value: '@随缘记录者', href: 'https://weibo.com' },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)] transition-colors duration-300">
      <Header />
      <section className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Contact</h1>
          <p className="text-lg opacity-80">
            想了解更多、合作交流或只是打个招呼？随缘写博，也欢迎随缘来信。
          </p>
        </div>
        <div className="bg-[var(--content-bg)] text-[var(--content-text)] border border-gray-200/50 rounded-lg divide-y divide-gray-100/40 shadow-sm">
          {contactInfo.map((item) => (
            <div key={item.label} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-2">
              <span className="text-sm uppercase tracking-widest text-gray-500">{item.label}</span>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium hover:text-blue-500 transition"
                >
                  {item.value}
                </a>
              ) : (
                <span className="text-lg font-medium">{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

