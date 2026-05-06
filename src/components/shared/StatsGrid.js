"use client";

import { Card } from "@/components/ui";
import { motion } from "framer-motion";

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
              <stat.icon className="w-16 h-16" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black">{stat.value}</h3>
              <p className={`text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-500' : 'text-primary'}`}>
                {stat.description}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
