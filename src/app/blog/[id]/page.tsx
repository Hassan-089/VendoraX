import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogs } from "@/lib/blogs";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = blogs.find((item) => item.id === id);
  if (!blog) notFound();
  return (
    <article className="page-shell">
      <Link className="text-link mb-8" href="/blog">
        <ArrowLeft size={15} />
        Back to guides
      </Link>
      <div className="page-intro">
        <p className="eyebrow">{blog.city} · ARCHIVED EDITORIAL</p>
        <h1>{blog.title}</h1>
        <p>
          {blog.date} · {blog.readTime}
        </p>
      </div>
      <p className="notice max-w-3xl mb-8">
        This is an archived guide, not a live event listing. Event dates,
        participation and venue details need confirmation. Use Explore Events
        for current published listings.
      </p>
      <div className="info-content">
        {blog.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <Link
        href={`/events?city=${encodeURIComponent(blog.city)}`}
        className="action action-primary mt-9"
      >
        Explore current events in {blog.city}
      </Link>
    </article>
  );
}
