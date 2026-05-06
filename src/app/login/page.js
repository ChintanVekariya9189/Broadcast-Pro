"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button, Input, Card } from "@/components/ui";
import { toast } from "sonner";
import { MonitorPlay, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 hero-gradient relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <MonitorPlay className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Broadcast Pro</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage your educational content</p>
        </div>

        <Card className="p-8 glass">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="text-sm text-center text-muted-foreground">
              <p>Demo accounts:</p>
              <div className="flex justify-center gap-4 mt-2">
                <button 
                  onClick={() => { setEmail("teacher@school.com"); setPassword("password123"); }}
                  className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  Teacher
                </button>
                <button 
                  onClick={() => { setEmail("principal@school.com"); setPassword("password123"); }}
                  className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  Principal
                </button>
              </div>
            </div>
          </div>
        </Card>

        <p className="mt-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" /> Powered by Next-Gen Broadcasting Tech
        </p>
      </motion.div>
    </div>
  );
}
