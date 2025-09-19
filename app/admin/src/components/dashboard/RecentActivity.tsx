import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { FileText, Image, Users, CheckCircle, Clock, Edit } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "../../lib/utils";

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
      bgColor: "bg-emerald-50", 
      textColor: "text-emerald-700", 
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-100",
      label: "Published"
    },
    created: { 
      bgColor: "bg-blue-50", 
      textColor: "text-blue-700", 
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      label: "Created"
    },
    updated: { 
      bgColor: "bg-amber-50", 
      textColor: "text-amber-700", 
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100",
      label: "Updated"
    },
  };
  
  return configs[action] || {
    bgColor: "bg-gray-50", 
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
    iconBg: "bg-gray-100",
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

const getTypeIconClass = (type: string) => {
  switch (type) {
    case "news": return "text-blue-600";
    case "gallery": return "text-purple-600";
    case "structure": return "text-green-600";
    default: return "text-gray-600";
  }
};

export function RecentActivity() {
  return (
    <div className="space-y-3">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type, activity.action);
        const config = getActivityConfig(activity.action);
        
        return (
          <div 
            key={activity.id} 
            className="group relative p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 bg-white"
          >
            {/* Priority indicator */}
            <div className={cn(
              "absolute left-0 top-4 bottom-4 w-1 rounded-r-full",
              getPriorityDot(activity.priority)
            )} />
            
            <div className="flex items-start gap-3 ml-3">
              {/* Type Icon */}
              <div className={cn(
                "flex-shrink-0 p-2.5 rounded-lg transition-all duration-200 group-hover:scale-105",
                config.iconBg,
                getTypeIconClass(activity.type)
              )}>
                <Icon className="h-4 w-4" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title and Status */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200 leading-relaxed">
                    {activity.title}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 border",
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
                  <Avatar className="h-6 w-6 ring-2 ring-white ring-offset-1">
                    <AvatarFallback className="text-[10px] bg-blue-600 text-white font-medium">
                      {activity.user.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-700">{activity.user}</span>
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
            
            {/* Timeline connector */}
            {index < activities.length - 1 && (
              <div className="absolute left-[26px] -bottom-1.5 w-[2px] h-6 bg-gray-200" />
            )}
          </div>
        );
      })}
      
      {/* View All Button */}
      <div className="pt-4 text-center border-t border-gray-100">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline px-4 py-2 rounded-lg hover:bg-blue-50">
          Lihat semua aktivitas →
        </button>
      </div>
    </div>
  );
}