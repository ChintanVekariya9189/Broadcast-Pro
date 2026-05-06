"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contentService } from "@/services/content.service";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Card, Badge, Button, Input } from "@/components/ui";
import { 
  Check, 
  X, 
  Eye, 
  Calendar, 
  User,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function PendingApprovalPage() {
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const { data: pending = [], isLoading } = useQuery({
    queryKey: ["content", "pending"],
    queryFn: () => contentService.getPending(),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => contentService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["content"]);
      toast.success("Content approved successfully!");
      setSelectedItem(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => contentService.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(["content"]);
      toast.success("Content rejected.");
      setIsRejectModalOpen(false);
      setRejectionReason("");
      setSelectedItem(null);
    },
  });

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    rejectMutation.mutate({ id: selectedItem.id, reason: rejectionReason });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Approval</h1>
          <p className="text-muted-foreground mt-1">Review and approve content for broadcasting.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Section */}
          <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
              ))
            ) : pending.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground">No pending items.</p>
              </div>
            ) : (
              pending.map((item) => (
                <Card 
                  key={item.id} 
                  className={cn(
                    "p-4 cursor-pointer transition-all border-2",
                    selectedItem?.id === item.id ? "border-primary bg-primary/5" : "hover:border-border"
                  )}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden shrink-0">
                      <img src={item.fileUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm truncate">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.subject}</p>
                      <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                        <User className="w-3 h-3" /> {item.teacherName}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!selectedItem ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-2xl bg-card/30"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Eye className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Select an item to review</h3>
                  <p className="text-sm text-muted-foreground mt-2">Click on any content from the list to see full details and take action.</p>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedItem.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Card className="overflow-hidden">
                    <div className="aspect-video w-full relative">
                      <img src={selectedItem.fileUrl} alt="" className="w-full h-full object-contain bg-black" />
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Badge className="mb-2">{selectedItem.subject}</Badge>
                          <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                          <p className="text-muted-foreground">{selectedItem.description || "No description provided."}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground font-medium uppercase">Submitted On</p>
                          <p className="text-sm font-bold">{formatDate(selectedItem.createdAt)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 py-6 border-y border-border/50">
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Scheduled Start
                          </p>
                          <p className="text-lg font-medium">{formatDate(selectedItem.startTime)}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Scheduled End
                          </p>
                          <p className="text-lg font-medium">{formatDate(selectedItem.endTime)}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button 
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700" 
                          onClick={() => approveMutation.mutate(selectedItem.id)}
                          isLoading={approveMutation.isPending}
                        >
                          <Check className="w-4 h-4 mr-2" /> Approve Content
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                          onClick={() => setIsRejectModalOpen(true)}
                        >
                          <X className="w-4 h-4 mr-2" /> Reject Content
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Reject Modal */}
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md"
            >
              <Card className="p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 text-destructive">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Reject Content</h3>
                </div>
                <form onSubmit={handleRejectSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason for Rejection *</label>
                    <textarea 
                      className="w-full min-h-[120px] bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/20"
                      placeholder="Explain why this content is being rejected..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="flex-1" 
                      onClick={() => setIsRejectModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="destructive" 
                      className="flex-1"
                      isLoading={rejectMutation.isPending}
                    >
                      Confirm Rejection
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

const cn = (...inputs) => inputs.filter(Boolean).join(" ");
