"use client";

import { motion } from "framer-motion";
import { Eye, Edit3, User, Calendar, Clock } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { formatDate } from "@/utils";

export default function TeacherContentCard({ item, onPreview, onEdit }) {
  return (
    <Card className="flex flex-col group hover:border-primary/50 transition-all border-2 overflow-hidden">
      <div className="aspect-video w-full overflow-hidden relative">
        <img 
          src={item.fileUrl} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 right-4">
          <Badge variant={item.status === "approved" ? "success" : item.status === "rejected" ? "destructive" : "warning"}>
            {item.status}
          </Badge>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-card/50">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.subject}</p>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {formatDate(item.createdAt)}
            </span>
          </div>
          <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
        </div>

        <div className="space-y-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground uppercase font-bold">Schedule</span>
            <span className="font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3 text-primary" /> {new Date(item.startTime).toLocaleDateString()}
            </span>
          </div>

          {item.status === "rejected" && item.rejectionReason && (
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
              <p className="text-[10px] font-bold text-destructive uppercase mb-1">Feedback</p>
              <p className="text-[11px] text-destructive/80 line-clamp-2 italic">"{item.rejectionReason}"</p>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onPreview(item)}
            >
              <Eye className="w-3 h-3 mr-2" /> Preview
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit(item.id)}
            >
              <Edit3 className="w-3 h-3 mr-2" /> Edit
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
