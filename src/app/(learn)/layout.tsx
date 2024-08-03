import { checkAuth, getUserAuth } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserAuth();
  await checkAuth();

  return <div className="bg-muted h-screen pt-8">{children}</div>;
}
