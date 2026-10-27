import Link from "next/link";
import { Bookmark } from "lucide-react";
import { requireAccount } from "@/lib/server-auth";
export default async function Page() {
  await requireAccount();
  return (
    <div className="page-shell">
      <div className="page-intro">
        <p className="eyebrow">YOUR EVENT COLLECTION</p>
        <h1>Saved events.</h1>
      </div>
      <div className="empty-state">
        <Bookmark size={30} />
        <h2>Saving events is not available yet</h2>
        <p>
          Until this feature is available, use your browser bookmarks or share
          an event link.
        </p>
        <Link href="/events" className="action action-outline">
          Explore events
        </Link>
      </div>
    </div>
  );
}
