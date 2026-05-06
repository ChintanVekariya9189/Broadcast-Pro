"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { contentService } from "@/services/content.service";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tv, 
  Users, 
  Search, 
  Play, 
  User, 
  Calendar,
  Sparkles,
  ArrowRight,
  LogIn
} from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("live"); // "live" or "teachers"
  const [search, setSearch] = useState("");

  // Redirect logged in users to their dashboards
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'teacher') router.push('/teacher/dashboard');
      else if (user.role === 'principal') router.push('/principal/dashboard');
    }
  }, [user, loading, router]);

  const { data: liveContent = [], isLoading: isLoadingLive } = useQuery({
    queryKey: ["live", "all"],
    queryFn: () => contentService.getAllLive(),
    refetchInterval: 10000,
  });

  const { data: teachers = [], isLoading: isLoadingTeachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => authService.getTeachers(),
  });

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Hero Header */}
      <header className="relative py-20 px-6 overflow-hidden border-b border-border/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left space-y-6 max-w-2xl">
            <Badge variant="default" className="px-4 py-1 text-sm rounded-full animate-bounce">
              <Sparkles className="w-4 h-4 mr-2" /> Live Now
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Education, <span className="text-primary">Broadcasted</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join live classrooms, interact with teachers, and never miss a lesson. 
              The future of learning is live.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4 justify-center md:justify-start">
              <Button size="lg" className="rounded-full h-14 px-8" onClick={() => setActiveTab("live")}>
                View All Live
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8" onClick={() => router.push("/login")}>
                <LogIn className="w-4 h-4 mr-2" /> Staff Login
              </Button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <Card className="relative w-full max-w-sm p-8 bg-card/50 backdrop-blur-2xl border-white/10 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                    <Tv className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary uppercase">Quick Stats</p>
                    <p className="text-2xl font-black">{liveContent.length} Active Streams</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Connected Students</span>
                    <span className="font-bold">1.2k+</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[70%]" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-16 px-6 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex p-1 bg-secondary/50 rounded-2xl border border-border">
            <button
              onClick={() => setActiveTab("live")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'live' ? 'bg-background text-foreground shadow-xl' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Tv className="w-4 h-4" /> Live Now
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'teachers' ? 'bg-background text-foreground shadow-xl' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Users className="w-4 h-4" /> Browse Teachers
            </button>
          </div>

          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder={activeTab === 'live' ? "Search live lessons..." : "Find a teacher..."}
              className="w-full bg-secondary/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "live" ? (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {isLoadingLive ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-80 bg-muted/50 animate-pulse rounded-3xl" />)
              ) : liveContent.length === 0 ? (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Tv className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">No Live Content</h3>
                  <p className="text-muted-foreground mt-2">Check back later or browse teachers to see their schedules.</p>
                </div>
              ) : (
                liveContent.map((item) => (
                  <Card key={item.id} className="group overflow-hidden rounded-3xl hover:border-primary/50 transition-all flex flex-col border-2">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                          <span className="w-1.5 h-1.5 bg-white rounded-full" /> Live
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button className="rounded-full h-12 w-12 p-0" onClick={() => router.push(`/live/${item.teacherId}`)}>
                          <Play className="w-5 h-5 fill-current ml-1" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{item.subject}</p>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                            <User className="w-3 h-3" />
                          </div>
                          <span>{item.teacherName}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-6 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all" onClick={() => router.push(`/live/${item.teacherId}`)}>
                        Join Classroom <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="teachers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {isLoadingTeachers ? (
                Array(4).fill(0).map((_, i) => <div key={i} className="h-48 bg-muted/50 animate-pulse rounded-3xl" />)
              ) : filteredTeachers.map((teacher) => (
                <Card 
                  key={teacher.id} 
                  className="p-6 text-center space-y-4 hover:border-primary/50 cursor-pointer transition-all rounded-3xl group border-2"
                  onClick={() => router.push(`/live/${teacher.id}`)}
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{teacher.name}</h3>
                    <p className="text-xs text-muted-foreground">ID: {teacher.id}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-primary hover:bg-primary/5">
                    View Live Page
                  </Button>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tv className="w-4 h-4 text-primary" />
          </div>
          <span className="font-black tracking-tighter text-foreground">BROADCAST PRO</span>
        </div>
        <p className="text-sm">&copy; 2026 Education Broadcasting System. All rights reserved.</p>
      </footer>
    </div>
  );
}
