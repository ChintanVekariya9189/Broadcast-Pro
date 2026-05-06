"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { contentService } from "@/services/content.service";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Button, CustomSelect } from "@/components/ui";
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink 
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ContentDetailModal from "@/components/shared/ContentDetailModal";
import TeacherContentCard from "@/components/features/teacher/TeacherContentCard";

export default function TeacherContentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const filterOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const { data: content = [], isLoading } = useQuery({
    queryKey: ["content", user?.id],
    queryFn: () => contentService.getByTeacher(user?.id),
    enabled: !!user?.id,
  });

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                         item.subject.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Content</h1>
            <p className="text-muted-foreground mt-1">Manage your broadcasting lessons and check approval status.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => window.open(`/live/${user?.id}`, '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" /> View Live Page
            </Button>
            <Button onClick={() => router.push("/teacher/upload")}>
              <Plus className="w-4 h-4 mr-2" /> Upload New
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search lessons..."
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <CustomSelect 
            options={filterOptions}
            value={filter}
            onChange={setFilter}
            icon={Filter}
            className="w-full md:w-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />)
          ) : filteredContent.length === 0 ? (
            <div className="md:col-span-3 py-20 text-center border-2 border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground">No content found. Start by uploading a new lesson.</p>
            </div>
          ) : (
            filteredContent.map((item) => (
              <TeacherContentCard 
                key={item.id} 
                item={item} 
                onPreview={setSelectedItem}
                onEdit={(id) => router.push(`/teacher/upload?editId=${id}`)}
              />
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
