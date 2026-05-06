"use client";

import { useQuery } from "@tanstack/react-query";
import { contentService } from "@/services/content.service";
import { Badge, Card } from "@/components/ui";
import { 
  MonitorPlay, 
  Clock, 
  AlertCircle,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  User
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";

export default function PublicLivePage() {
  const { teacherId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: liveContent = [], isLoading, refetch } = useQuery({
    queryKey: ["live", teacherId],
    queryFn: () => contentService.getLive(teacherId),
    refetchInterval: 30000, // Poll every 30 seconds
  });

  const currentItem = liveContent[currentIndex];

  useEffect(() => {
    if (liveContent.length <= 1) return;

    const duration = (currentItem?.rotationDuration || 10) * 1000;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % liveContent.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, liveContent]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Initializing Broadcast...</p>
      </div>
    );
  }

  if (liveContent.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center hero-gradient">
        <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mb-6">
          <MonitorPlay className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">No content available</h1>
        <p className="text-muted-foreground max-w-md">There is currently no live content being broadcasted for this teacher. Please check back later.</p>
        <button 
          onClick={() => refetch()}
          className="mt-8 flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Status
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10 glass z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <MonitorPlay className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Live Broadcast</h1>
            <p className="text-xs text-white/60">Teacher ID: {teacherId}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Live</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium">
            <Clock className="w-3 h-3" /> {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Broadcast Area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Live Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            className="relative w-full h-full flex items-center justify-center bg-black"
          >
            {/* Teacher Identification Header */}
            <div className="absolute top-8 left-8 z-20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">Live Broadcast</span>
                </div>
                <h2 className="text-white font-bold text-lg leading-tight">
                  {currentItem.teacherName || 'Teacher'}'s Classroom
                </h2>
              </div>
            </div>

            <img 
              src={currentItem.fileUrl} 
              alt={currentItem.title} 
              className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            />
            
            {/* Bottom Info Overlay */}
            <div className="absolute bottom-12 left-12 right-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-2xl bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
              >
                <Badge className="bg-primary text-primary-foreground mb-4 border-none px-4 py-1.5 text-sm uppercase font-bold tracking-widest">
                  {currentItem.subject}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{currentItem.title}</h2>
                <p className="text-lg text-white/70 line-clamp-2 leading-relaxed">{currentItem.description}</p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5">
          <motion.div 
            key={`${currentItem.id}-progress`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: currentItem.rotationDuration || 10, ease: "linear" }}
            className="h-full bg-primary"
          />
        </div>

        {/* Controls */}
        {liveContent.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
            <button 
              onClick={() => setCurrentIndex((prev) => (prev - 1 + liveContent.length) % liveContent.length)}
              className="p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white/50 hover:text-white transition-all pointer-events-auto"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev + 1) % liveContent.length)}
              className="p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white/50 hover:text-white transition-all pointer-events-auto"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-6 flex items-center justify-between text-[10px] text-white/40 uppercase tracking-widest bg-black/50 backdrop-blur-md">
        <p>© 2026 Broadcast Pro Education System</p>
        <p>Total Items in Rotation: {liveContent.length}</p>
        <p>Auto-refresh enabled</p>
      </div>
    </div>
  );
}
