"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Clock, FileText, BadgeCheck } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { formatDate } from "@/utils";

export default function ContentDetailModal({ item, isOpen, onClose }) {
  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <Card className="relative flex flex-col md:flex-row h-full max-h-[90vh]">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Preview Area */}
            <div className="w-full md:w-3/5 bg-black flex items-center justify-center min-h-[300px]">
              <img 
                src={item.fileUrl} 
                alt={item.title} 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info Area */}
            <div className="w-full md:w-2/5 p-8 overflow-y-auto bg-card flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={item.status === "approved" ? "success" : item.status === "rejected" ? "destructive" : "warning"}>
                      {item.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{item.subject}</p>
                  <h2 className="text-2xl font-black leading-tight">{item.title}</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase">Teacher</p>
                      <p className="text-sm font-bold">{item.teacherName || "Unknown"}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-bold">Schedule</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Starts: {formatDate(item.startTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ends: {formatDate(item.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Description
                    </p>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {item.description || "No description provided."}
                    </p>
                  </div>

                  {item.status === "rejected" && item.rejectionReason && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Rejection Reason</p>
                      <p className="text-sm text-red-100 leading-relaxed font-medium">{item.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-border mt-8">
                <Button variant="outline" className="w-full" onClick={onClose}>
                  Close Preview
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
