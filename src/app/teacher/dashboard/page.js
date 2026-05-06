"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { contentService } from "@/services/content.service";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Card, Badge } from "@/components/ui";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  Plus
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TeacherDashboard() {
  const { user } = useAuth();
  
  const { data: content = [], isLoading } = useQuery({
    queryKey: ["content", user?.id],
    queryFn: () => contentService.getByTeacher(user?.id),
    enabled: !!user?.id,
  });

  const stats = [
    {
      label: "Total Uploaded",
      value: content.length,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pending Approval",
      value: content.filter(c => c.status === "pending").length,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Approved",
      value: content.filter(c => c.status === "approved").length,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Rejected",
      value: content.filter(c => c.status === "rejected").length,
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.name}. Here&apos;s your content overview.</p>
          </div>
          <Link href="/teacher/upload">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              Upload New Content
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", stat.bg)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {isLoading ? "..." : stat.value}
                    </h3>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recent Activity
              </h3>
              <Link href="/teacher/content" className="text-sm text-primary hover:underline font-medium">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-lg" />
                ))
              ) : content.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">No content uploaded yet.</p>
                </div>
              ) : (
                content.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                        <img src={item.fileUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.subject}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === "approved" ? "success" : item.status === "rejected" ? "destructive" : "warning"}>
                      {item.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-lg mb-4">Quick Tips</h3>
            <div className="space-y-4 text-sm">
              <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                <p className="font-medium text-primary mb-1">High Quality Files</p>
                <p className="text-muted-foreground text-xs leading-relaxed">Ensure your images are clear and readable for the best student experience.</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                <p className="font-medium text-primary mb-1">Check Schedules</p>
                <p className="text-muted-foreground text-xs leading-relaxed">Double check your start and end times to avoid broadcast gaps.</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                <p className="font-medium text-primary mb-1">Review Rejections</p>
                <p className="text-muted-foreground text-xs leading-relaxed">If content is rejected, read the reason and re-upload with fixes.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Utility function duplicated for this file or I should import it correctly
const cn = (...inputs) => {
  return inputs.filter(Boolean).join(" ");
};
