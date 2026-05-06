"use client";

import { useQuery } from "@tanstack/react-query";
import { contentService } from "@/services/content.service";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Card, Badge, Button } from "@/components/ui";
import { 
  Search, 
  Filter, 
  Calendar, 
  User,
  Eye,
  ArrowUpDown
} from "lucide-react";
import { useState } from "react";
import { formatDate, cn } from "@/utils";
import { CustomSelect } from "@/components/ui";

import ContentDetailModal from "@/components/shared/ContentDetailModal";

export default function AllContentPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedItem, setSelectedItem] = useState(null);

  const filterOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
  ];

  const { data: content = [], isLoading } = useQuery({
    queryKey: ["content", "all"],
    queryFn: () => contentService.getAll(),
  });

  const filteredContent = content.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) || 
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.teacherName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || item.status === filter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Content</h1>
          <p className="text-muted-foreground mt-1">Global repository of all uploaded broadcasting content.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-2xl border border-border">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search by title, subject or teacher..."
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <CustomSelect 
              options={filterOptions}
              value={filter}
              onChange={setFilter}
              icon={Filter}
            />

            <CustomSelect 
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              icon={ArrowUpDown}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 bg-muted/50 animate-pulse rounded-xl" />
            ))
          ) : filteredContent.length === 0 ? (
            <div className="md:col-span-3 py-20 text-center border-2 border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground">No content found matching your search.</p>
            </div>
          ) : (
            filteredContent.map((item) => (
              <Card key={item.id} className="flex flex-col group hover:border-primary/50 transition-all">
                <div className="aspect-video w-full overflow-hidden relative">
                  <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4">
                    <Badge variant={item.status === "approved" ? "success" : item.status === "rejected" ? "destructive" : "warning"}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.subject}</p>
                      <span className="text-[10px] text-muted-foreground">{formatDate(item.createdAt)}</span>
                    </div>
                    <h3 className="text-lg font-bold line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">{item.teacherName}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground uppercase">Schedule</span>
                      <span className="font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(item.startTime).toLocaleDateString()}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="w-3 h-3 mr-2" /> View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <ContentDetailModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </DashboardLayout>
  );
}
