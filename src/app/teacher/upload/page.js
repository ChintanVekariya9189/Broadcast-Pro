"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { contentService } from "@/services/content.service";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Card, Button, Input } from "@/components/ui";
import { toast } from "sonner";
import { 
  Upload as UploadIcon, 
  X, 
  Image as ImageIcon, 
  Clock, 
  FileText,
  Sparkles,
  AlertCircle,
  Edit3
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subject: z.string().min(1, "Please select a subject"),
  description: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  rotationDuration: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().min(5).max(60)),
}).refine((data) => {
  if (data.startTime && data.endTime) {
    return new Date(data.endTime) > new Date(data.startTime);
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

function UploadForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState("");

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      rotationDuration: "10",
    }
  });

  useEffect(() => {
    if (editId) {
      const loadContent = async () => {
        setIsFetching(true);
        try {
          const item = await contentService.getById(editId);
          if (item) {
            reset({
              title: item.title,
              subject: item.subject,
              description: item.description,
              startTime: item.startTime.slice(0, 16),
              endTime: item.endTime.slice(0, 16),
              rotationDuration: String(item.rotationDuration),
            });
            setPreview(item.fileUrl);
          }
        } catch (error) {
          toast.error("Failed to load content for editing.");
        } finally {
          setIsFetching(false);
        }
      };
      loadContent();
    }
  }, [editId, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      setFileError("Invalid file type. Please upload JPG, PNG, or GIF.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("File is too large. Max size is 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    if (!preview) {
      setFileError("Please upload a file.");
      return;
    }

    setIsLoading(true);
    try {
      if (editId) {
        await contentService.update(editId, {
          ...data,
          fileUrl: preview,
        });
        toast.success("Content updated successfully!");
      } else {
        await contentService.upload({
          ...data,
          fileUrl: preview,
          teacherId: user.id,
          teacherName: user.name,
        });
        toast.success("Content uploaded successfully!");
      }
      router.push("/teacher/content");
    } catch (error) {
      toast.error("Failed to save content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading content details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          {editId ? <Edit3 className="w-6 h-6 text-primary" /> : <UploadIcon className="w-6 h-6 text-primary" />}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{editId ? "Edit Content" : "Upload Content"}</h1>
          <p className="text-muted-foreground">
            {editId ? `Updating: ${editId}` : "Create a new broadcasting lesson for your students."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Basic Information
              </h3>
              <Input label="Title *" placeholder="e.g., Introduction to Calculus" {...register("title")} error={errors.title?.message} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Subject *</label>
                <select className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.subject ? 'border-destructive ring-destructive' : ''}`} {...register("subject")}>
                  <option value="">Select a subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Art">Art</option>
                  <option value="Physics">Physics</option>
                </select>
                {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Description</label>
                <textarea className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Provide a brief overview of this content..." {...register("description")} />
              </div>
            </div>
            <div className="pt-6 border-t border-border/50 space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Scheduling</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input label="Start Time *" type="datetime-local" {...register("startTime")} error={errors.startTime?.message} />
                </div>
                <div className="space-y-1">
                  <Input label="End Time *" type="datetime-local" {...register("endTime")} error={errors.endTime?.message} />
                </div>
              </div>
              <Input label="Rotation Duration (seconds)" type="number" min="5" max="60" {...register("rotationDuration")} error={errors.rotationDuration?.message} />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><ImageIcon className="w-4 h-4 text-primary" /> Content Preview</h3>
            <div className="relative group rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img src={preview || "https://placehold.co/800x450/1a1a1a/666666?text=No+Preview"} alt="Preview" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                <Button type="button" variant="secondary" size="sm" className="relative overflow-hidden">
                  <UploadIcon className="w-4 h-4 mr-2" /> Change Image
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
                </Button>
              </div>
            </div>
          </div>
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0" />
              <div className="text-xs space-y-2">
                <p className="font-bold text-primary">Upload Guidelines</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Optimal resolution: 1920x1080</li>
                  <li>Keep text clear and large</li>
                  <li>Avoid busy backgrounds</li>
                </ul>
              </div>
            </div>
          </Card>
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full h-12" isLoading={isLoading}>{editId ? "Update Content" : "Submit for Approval"}</Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>Cancel</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function UploadContentPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      }>
        <UploadForm />
      </Suspense>
    </DashboardLayout>
  );
}
