import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { blogs } from "@/lib/blogs";
export const metadata = { title: "Event guides | VendoraX" };
export default function Page() {
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">A LITTLE LOCAL INSPIRATION</p>
        <h1>Ideas for your next day out.</h1>
        <p>
          Archived city guides and event inspiration. These articles are not
          current event listings.
        </p>
      </div>
      <div className="event-grid">
        {blogs.map((blog) => (
          <article className="category-tile" key={blog.id}>
            <p className="eyebrow">{blog.city} · ARCHIVED GUIDE</p>
            <h2 className="text-xl font-semibold leading-8">{blog.title}</h2>
            <p className="text-sm text-muted-foreground my-5 leading-7">
              {blog.excerpt}
            </p>
            <Link href={`/blog/${blog.id}`} className="text-link">
              Read guide
              <ArrowUpRight size={16} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
