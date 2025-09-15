import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { FileText, Image, Users, Pin, Archive, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "news" | "gallery" | "structure";
  action: "created" | "published" | "pinned" | "unpinned" | "archived" | "updated";
  title: string;
  user: string;
  timestamp: Date;
  priority?: "high" | "medium" | "low";
}

// Mock data
const activities: ActivityItem[] = [
  {
    id: "1",
    type: "news",
    action: "published",
    title: "Program Pembangunan Infrastruktur Sidoarjo 2024",
    user: "Admin User",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    priority: "high"
  },
  {
    id: "2", 
    type: "news",
    action: "pinned",
    title: "Rapat Koordinasi DPD Partai NasDem",
    user: "Editor User",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    priority: "medium"
  },
  {
    id: "3",
    type: "gallery",
    action: "created",
    title: "Foto Kegiatan Sosialisasi Program Unggulan",
    user: "Media Officer",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    priority: "low"
  },
  {
    id: "4",
    type: "structure",
    action: "updated", 
    title: "Data Pengurus DPD Sidoarjo Terbaru 2024",
    user: "Admin User",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    priority: "medium"
  },
  {
    id: "5",
    type: "news",
    action: "created",
    title: "Draft: Evaluasi Program Kerja Semester I",
    user: "Content Writer",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    priority: "low"
  },
];

const getActivityIcon = (type: ActivityItem["type"], action: ActivityItem["action"]) => {
  if (action === "pinned") return Pin;
  if (action === "archived") return Archive;
  
  switch (type) {
    case "news": return FileText;
    case "gallery": return Image;
    case "structure": return Users;
    default: return FileText;
  }
};

const getActivityConfig = (action: ActivityItem["action"], priority?: string) => {
  const configs = {
    published: { 
      bg: "from-green-500/10 to-green-500/5", 
      text: "text-green-700", 
      icon: CheckCircle,
      label: "Dipublikasi"
    },
    pinned: { 
      bg: "from-accent/10 to-accent/5", 
      text: "text-accent", 
      icon: Pin,
      label: "Di-pin"
    },
    archived: { 
      bg: "from-yellow-500/10 to-yellow-500/5", 
      text: "text-yellow-700", 
      icon: Archive,
      label: "Diarsip"
    },
    created: { 
      bg: "from-blue-500/10 to-blue-500/5", 
      text: "text-blue-700", 
      icon: Clock,
      label: "Dibuat"
    },
    updated: { 
      bg: "from-primary/10 to-primary/5", 
      text: "text-primary", 
      icon: AlertCircle,
      label: "Diperbarui"
    },
  };
  
  return configs[action] || {
    bg: "from-gray-500/10 to-gray-500/5", 
    text: "text-gray-600",
    icon: Clock,
    label: action
  };
};

const getPriorityIndicator = (priority?: string) => {
  switch (priority) {
    case "high": return "bg-red-500";
    case "medium": return "bg-yellow-500";
    case "low": return "bg-green-500";
    default: return "bg-gray-400";
  }
};

export function RecentActivity() {
  return (
    <div className="space-y-1">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type, activity.action);
        const config = getActivityConfig(activity.action, activity.priority);
        
        return (
            <div key={activity.id} className={cn(
              "group/item relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
              "bg-gradient-to-r from-white/70 via-white/50 to-white/70",
              "border-2 border-gray-200/70 hover:border-primary/40"
            )}>
              {/* Enhanced Priority Indicator */}
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full transition-all duration-300",
                getPriorityIndicator(activity.priority),
                "group-hover/item:w-2"
              )} />
              
              {/* Enhanced Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-accent/8 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-start gap-4">
                {/* Enhanced Icon with animated background */}
                <div className={cn(
                  "flex-shrink-0 p-3 rounded-2xl transition-all duration-300 group-hover/item:scale-110 border border-current/20",
                  "bg-gradient-to-br", config.bg,
                  "shadow-sm group-hover/item:shadow-lg"
                )}>
                  <Icon className={cn("h-4 w-4 transition-colors duration-300", config.text)} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title and Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-semibold text-foreground group-hover/item:text-primary transition-colors duration-300 line-clamp-2 leading-5">
                      {activity.title}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs font-semibold border-0 shadow-sm flex-shrink-0 transition-all duration-300 group-hover/item:scale-105",
                        config.bg.replace('/10', '/20').replace('/5', '/10'),
                        config.text
                      )}
                    >
                      {config.label}
                    </Badge>
                  </div>
                  
                  {/* User and Timestamp */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="h-5 w-5 ring-2 ring-white ring-offset-1 ring-offset-gray-100">
                      <AvatarFallback className="text-[10px] font-semibold bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                        {activity.user.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-gray-400">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(activity.timestamp, { 
                        addSuffix: true, 
                        locale: id 
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Timeline connector */}
              {index < activities.length - 1 && (
                <div className="absolute left-7 -bottom-1 w-[2px] h-4 bg-gradient-to-b from-gray-200 to-transparent" />
              )}
            </div>
          );
        })}
        
        {/* View All Button */}
        <div className="pt-4 text-center">
          <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-300 hover:underline">
            Lihat semua aktivitas →
          </button>
        </div>
      </div>
    );
  }