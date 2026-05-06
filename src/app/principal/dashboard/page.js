"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { contentService } from "@/services/content.service";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Card, Badge, Button } from "@/components/ui";
import { 
  FileCheck, 
  Clock, 
  AlertCircle, 
  Layers,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/utils";

export default function PrincipalDashboard() {
  const { user } = useAuth();
  
  const { data: content = [], isLoading } = useQuery({
    queryKey: ["content", "all"],
    queryFn: () => contentService.getAll(),
  });

  const stats = [
    {
      label: "Total Content",
      value: content.length,
      icon: Layers,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pending",
      value: content.filter(c => c.status === "pending").length,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Approved",
      value: content.filter(c => c.status === "approved").length,
      icon: FileCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Rejected",
      value: content.filter(c => c.status === "rejected").length,
      icon: AlertCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  const pendingContent = content.filter(c => c.status === "pending").slice(0, 4);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
            <p className="text-muted-foreground mt-1">Manage content approvals and monitor broadcasting status.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> System Secure
          </div>
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
              <h3 className="font-semibold text-lg">Needs Your Review</h3>
              <Link href="/principal/pending" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
                View all pending <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-lg" />
                ))
              ) : pendingContent.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">Great job! No pending requests.</p>
                </div>
              ) : (
                pendingContent.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden">
                        <img src={item.fileUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Uploaded by {item.teacherName}</p>
                      </div>
                    </div>
                    <Link href="/principal/pending">
                      <Button variant="outline" size="sm">Review</Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Live Status</h3>
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-8 text-center border-b border-border/50">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500 relative z-10" />
                </div>
                <p className="text-sm font-bold mt-3">Live Broadcasting</p>
                <p className="text-xs text-muted-foreground mt-1">4 Active Sessions</p>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase">Top Performers</p>
                {[
                  { name: "John Teacher", count: 12 },
                  { name: "Sarah Smith", count: 8 },
                  { name: "Mike Ross", count: 5 },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t.name}</span>
                    <span className="font-medium">{t.count} lessons</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
