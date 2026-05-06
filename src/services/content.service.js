/**
 * Content Service - Mock Implementation
 * Handles broadcasting content logic using localStorage
 */

const STORAGE_KEY = "broadcast_content";

// Initial mock data generation
const generateMockContent = () => {
  const subjects = ["Math", "Science", "History", "Art", "Physics"];
  const statuses = ["pending", "approved", "rejected"];
  const teachers = [
    { id: "t1", name: "John Teacher" },
    { id: "t2", name: "Jane Doe" }
  ];

  const content = [];
  for (let i = 1; i <= 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - Math.floor(Math.random() * 24));
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 4);

    content.push({
      id: `c${i}`,
      title: `Lesson ${i}: ${subjects[i % subjects.length]} Basics`,
      subject: subjects[i % subjects.length],
      description: `This is a detailed description for lesson ${i}.`,
      fileUrl: `https://picsum.photos/seed/${i}/800/450`,
      status,
      teacherId: teachers[i % teachers.length].id,
      teacherName: teachers[i % teachers.length].name,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      rotationDuration: 10,
      rejectionReason: status === "rejected" ? "Missing clear objectives." : null,
      createdAt: new Date().toISOString(),
    });
  }
  return content;
};

const getStoredContent = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial = generateMockContent();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const saveContent = (content) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
};

export const contentService = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getStoredContent();
  },

  getPending: async () => {
    const all = await contentService.getAll();
    return all.filter((c) => c.status === "pending");
  },

  getByTeacher: async (teacherId) => {
    const all = await contentService.getAll();
    return all.filter((c) => c.teacherId === teacherId);
  },

  getById: async (id) => {
    const all = await contentService.getAll();
    return all.find((c) => c.id === id);
  },

  getLive: async (teacherId) => {
    const all = await contentService.getAll();
    const now = new Date();
    return all.filter((c) => 
      c.teacherId === teacherId && 
      c.status === "approved" &&
      new Date(c.startTime) <= now &&
      new Date(c.endTime) >= now
    );
  },

  getAllLive: async () => {
    const all = await contentService.getAll();
    const now = new Date();
    return all.filter((c) => 
      c.status === "approved" &&
      new Date(c.startTime) <= now &&
      new Date(c.endTime) >= now
    );
  },

  upload: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate upload
    const all = getStoredContent();
    const newItem = {
      ...data,
      id: `c${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    saveContent([newItem, ...all]);
    return newItem;
  },

  update: async (id, data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const all = getStoredContent();
    const index = all.findIndex((c) => c.id === id);
    if (index !== -1) {
      all[index] = { 
        ...all[index], 
        ...data, 
        status: "pending", // Re-submit for approval after edit
        updatedAt: new Date().toISOString() 
      };
      saveContent(all);
      return all[index];
    }
    throw new Error("Content not found");
  },

  approve: async (id) => {
    const all = getStoredContent();
    const index = all.findIndex((c) => c.id === id);
    if (index !== -1) {
      all[index].status = "approved";
      all[index].rejectionReason = null;
      saveContent(all);
    }
  },

  reject: async (id, reason) => {
    const all = getStoredContent();
    const index = all.findIndex((c) => c.id === id);
    if (index !== -1) {
      all[index].status = "rejected";
      all[index].rejectionReason = reason;
      saveContent(all);
    }
  },
};
