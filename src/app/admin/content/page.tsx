import {
  AdminEmpty,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
} from "@/components/admin/ui";
import { prisma } from "@/lib/db/prisma";
import { toPersianDigits } from "@/lib/utils";

export default async function AdminContentPage() {
  const [articles, faqs, testimonials] = await Promise.all([
    prisma.article.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="محتوای مارکتینگ"
        description={`مقاله ${toPersianDigits(articles.length)} · پرسش‌های متداول ${toPersianDigits(faqs.length)} · نظر ${toPersianDigits(testimonials.length)} — سوخت قیف تبدیل و سئو`}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <AdminPanel
          className="xl:col-span-1"
          title="مقالات"
          description="محتوای بلاگ برای جذب ارگانیک"
        >
          {articles.length ? (
            <div className="space-y-2">
              {articles.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start justify-between gap-2 rounded-xl border border-border/60 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{a.excerpt}</p>
                  </div>
                  <AdminStatusBadge status={a.isPublished ? "SUCCESS" : "PENDING"} />
                </div>
              ))}
            </div>
          ) : (
            <AdminEmpty message="مقاله‌ای نیست." />
          )}
        </AdminPanel>

        <AdminPanel title="سوالات متداول" description="کاهش اصطکاک قبل از خرید">
          {faqs.length ? (
            <div className="space-y-3">
              {faqs.map((f) => (
                <div key={f.id} className="rounded-xl border border-border/60 px-3 py-2.5">
                  <p className="text-sm font-medium">{f.question}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{f.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmpty message="سؤالی ثبت نشده." />
          )}
        </AdminPanel>

        <AdminPanel title="نظرات مشتریان" description="اعتماد اجتماعی روی لندینگ">
          {testimonials.length ? (
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div key={t.id} className="rounded-xl border border-border/60 px-3 py-2.5">
                  <p className="text-sm font-medium">
                    {t.name}
                    {t.role ? (
                      <span className="text-muted-foreground"> · {t.role}</span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmpty message="نظری ثبت نشده." />
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
