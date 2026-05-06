/**
 * Auth Service - Mock Implementation
 * Handles authentication logic using localStorage
 */

const MOCK_USERS = [
  {
    id: "t1",
    email: "teacher@school.com",
    password: "password123",
    name: "John Teacher",
    role: "teacher",
    subject: "Mathematics",
  },
  {
    id: "p1",
    email: "principal@school.com",
    password: "password123",
    name: "Sarah Principal",
    role: "principal",
  },
];

export const authService = {
  getTeachers: async () => {
    return MOCK_USERS.filter(u => u.role === 'teacher');
  },
  login: async (email, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const sessionUser = { ...user };
    delete sessionUser.password;

    localStorage.setItem("session", JSON.stringify(sessionUser));
    return sessionUser;
  },

  getCurrentUser: async () => {
    if (typeof window === "undefined") return null;
    const session = localStorage.getItem("session");
    if (!session) return null;
    return JSON.parse(session);
  },

  logout: () => {
    localStorage.removeItem("session");
  },
};
