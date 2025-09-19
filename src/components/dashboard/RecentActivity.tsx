import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { FileText, Image, Users, CheckCircle, Clock, Edit, AlertCircle } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { cn } from "@/src/lib/utils";

interface ActivityItem {
  id: string;
  type: "news" | "gallery" | "structure";
  action: "created" | "published" | "updated";
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
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    priority: "high"
  },
  {
    id: "2", 
    type: "news",
    action: "created",
    title: "Rapat Koordinasi DPD Partai NasDem",
    user: "Editor User",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    priority: "medium"
  },
  {
    id: "3",
    type: "gallery",
    action: "created",
    title: "Foto Kegiatan Sosialisasi Program",
    user: "Media Officer",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    priority: "low"
  },
  {
    id: "4",
    type: "structure",
    action: "updated", 
    title: "Data Pengurus DPD Sidoarjo",
    user: "Admin User",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    priority: "medium"
  },
];

const getActivityIcon = (type: ActivityItem["type"], action: ActivityItem["action"]) => {
  if (action === "published") return CheckCircle;
  if (action === "updated") return Edit;
  
  switch (type) {
    case "news": return FileText;
    case "gallery": return Image;
    case "structure": return Users;
    default: return Clock;
  }
};

const getActivityConfig = (action: ActivityItem["action"]) => {
  const configs = {
    published: { 
      bgColor: "bg-green-100", 
      textColor: "text-green-700", 
      borderColor: "border-green-200",
      label: "Published"
    },
    created: { 
      bgColor: "bg-blue-100", 
      textColor: "text-blue-700", 
      borderColor: "border-blue-200",
      label: "Created"
    },
    updated: { 
      bgColor: "bg-orange-100", 
      textColor: "text-orange-700", 
      borderColor: "border-orange-200",
      label: "Updated"
    },
  };
  
  return configs[action] || {
    bgColor: "bg-gray-100", 
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
    label: action
  };
};

const getPriorityDot = (priority?: string) => {
  switch (priority) {
    case "high": return "bg-red-500";
    case "medium": return "bg-yellow-500";
    case "low": return "bg-green-500";
    default: return "bg-gray-400";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "news": return "bg-blue-100 text-blue-600";
    case "gallery": return "bg-purple-100 text-purple-600";
    case "structure": return "bg-green-100 text-green-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

export function RecentActivity() {
  return (
    <div className="space-y-3">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type, activity.action);
        const config = getActivityConfig(activity.action);
        
        return (
          <div key={activity.id} className="group relative p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-200">
            {/* Priority indicator */}
            <div className={cn(
              "absolute left-0 top-4 bottom-4 w-1 rounded-r-full",
              getPriorityDot(activity.priority)
            )} />
            
            <div className="flex items-start gap-3 ml-2">
              {/* Type Icon */}
              <div className={cn(
                "flex-shrink-0 p-2 rounded-lg transition-transform duration-200 group-hover:scale-105",
                getTypeIcon(activity.type)
              )}>
                <Icon className="h-4 w-4" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title and Status */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-nasdem-blue transition-colors duration-200">
                    {activity.title}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full flex-shrink-0",
                      config.bgColor,
                      config.textColor,
                      config.borderColor
                    )}
                  >
                    {config.label}
                  </Badge>
                </div>
                
                {/* User and Timestamp */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px] bg-nasdem-blue text-white font-medium">
                      {activity.user.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(activity.timestamp, { 
                        addSuffix: true, 
                        locale: id 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Connection line for timeline */}
            {index < activities.length - 1 && (
              <div className="absolute left-[18px] -bottom-1.5 w-[2px] h-6 bg-gray-200" />
            )}
          </div>
        );
      })}
      
      {/* View All Button */}
      <div className="pt-4 text-center border-t border-gray-200">
        <button className="text-sm text-nasdem-blue hover:text-nasdem-orange font-medium transition-colors duration-200 hover:underline">
          Lihat semua aktivitas →
        </button>
      </div>
    </div>
  );
}