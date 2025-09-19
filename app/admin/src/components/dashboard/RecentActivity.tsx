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
      bgColor: "bg-[#16A34A]/10", 
      textColor: "text-[#16A34A]", 
      borderColor: "border-[#16A34A]/20",
      iconBg: "bg-[#16A34A]/10",
      label: "Published"
    },
    created: { 
      bgColor: "bg-[#2563EB]/10", 
      textColor: "text-[#2563EB]", 
      borderColor: "border-[#2563EB]/20",
      iconBg: "bg-[#2563EB]/10",
      label: "Created"
    },
    updated: { 
      bgColor: "bg-[#F59E0B]/10", 
      textColor: "text-[#F59E0B]", 
      borderColor: "border-[#F59E0B]/20",
      iconBg: "bg-[#F59E0B]/10",
      label: "Updated"
    },
  };
  
  return configs[action] || {
    bgColor: "bg-[#6B7280]/10", 
    textColor: "text-[#6B7280]",
    borderColor: "border-[#6B7280]/20",
    iconBg: "bg-[#6B7280]/10",
    label: action
  };
};

const getPriorityDot = (priority?: string) => {
  switch (priority) {
    case "high": return "bg-[#C81E1E]";
    case "medium": return "bg-[#F59E0B]";
    case "low": return "bg-[#16A34A]";
    default: return "bg-[#6B7280]";
  }
};

const getTypeIconClass = (type: string) => {
  switch (type) {
    case "news": return "text-[#001B55]";
    case "gallery": return "text-[#FF9C04]";
    case "structure": return "text-[#16A34A]";
    default: return "text-[#6B7280]";
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
            className="group relative p-4 rounded-xl border bg-white hover:border-[#FF9C04]/30 hover:shadow-md transition-all duration-300"
            style={{ borderColor: 'rgba(0,0,0,0.08)' }}
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
                  <h4 className="font-medium text-sm text-[#001B55] line-clamp-2 group-hover:text-[#FF9C04] transition-colors duration-300 leading-relaxed">
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
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <Avatar className="h-6 w-6 ring-2 ring-white ring-offset-1">
                    <AvatarFallback className="text-[10px] bg-[#001B55] text-white font-medium">
                      {activity.user.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-[#001B55]">{activity.user}</span>
                  <span className="text-[#6B7280]/50">•</span>
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
              <div className="absolute left-[26px] -bottom-1.5 w-[2px] h-6 bg-[#6B7280]/20" />
            )}
          </div>
        );
      })}
      
      {/* View All Button */}
      <div className="pt-4 text-center border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <button className="text-sm text-[#001B55] hover:text-[#FF9C04] font-medium transition-colors duration-300 hover:underline px-4 py-2 rounded-lg hover:bg-[#FF9C04]/10">
          Lihat semua aktivitas →
        </button>
      </div>
    </div>
  );
}