"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui";
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  CheckSquare, 
  LogOut, 
  MonitorPlay,
  Menu,
  X,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/utils";

export default function DashboardLayout({ children }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) return null;
  if (!user) return null;

  const teacherNav = [
    { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
    { name: "Upload Content", href: "/teacher/upload", icon: Upload },
    { name: "My Content", href: "/teacher/content", icon: FileText },
  ];

  const principalNav = [
    { name: "Dashboard", href: "/principal/dashboard", icon: LayoutDashboard },
    { name: "Pending Approval", href: "/principal/pending", icon: CheckSquare },
    { name: "All Content", href: "/principal/all", icon: FileText },
  ];

  const navItems = user.role === "teacher" ? teacherNav : principalNav;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl shrink-0">
        <div className="p-6 sticky top-0 h-screen flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MonitorPlay className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Broadcast Pro</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header and Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-40 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MonitorPlay className="w-6 h-6 text-primary" />
            <span className="font-bold">Broadcast Pro</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-background pt-16">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium",
                    pathname === item.href 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              <button 
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-destructive w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 pt-16 md:pt-0">
          <div className="container max-w-6xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
