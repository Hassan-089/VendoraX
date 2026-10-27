import { requireAccount } from "@/lib/server-auth";
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAccount("admin");
  return <>{children}</>;
}
