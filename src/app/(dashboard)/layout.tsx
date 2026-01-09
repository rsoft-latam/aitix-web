import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Main content area with offset for sidebar */}
      <div className="ml-64 transition-all duration-300">
        <TopBar
          user={{
            email: user?.email,
            avatarUrl: user?.user_metadata?.avatar_url,
          }}
          walletBalance={1250.0}
          walletAddress="0x1234...5678"
        />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
