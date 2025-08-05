import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Book, MessageCircle, Calendar, Users, User } from "lucide-react";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigationItems = [
    { icon: Home, label: "Início", path: "/dashboard" },
    { icon: Book, label: "Devocional", path: "/devocional" },
    { icon: MessageCircle, label: "Oração", path: "/oracao" },
    { icon: Calendar, label: "Check-in", path: "/checkin" },
    { icon: Users, label: "Discípulos", path: "/agenda-discipulos" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-2 ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};