import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, MoreHorizontal } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  type?: "primary" | "upcoming";
  showCheckin?: boolean;
  showMore?: boolean;
  onCheckin?: () => void;
  onMore?: () => void;
}

export const EventCard = ({ 
  title, 
  date, 
  time, 
  type = "upcoming",
  showCheckin = false,
  showMore = false,
  onCheckin,
  onMore
}: EventCardProps) => {
  return (
    <Card className={`shadow-card transition-smooth ${
      type === "primary" ? "border-primary/20 bg-accent" : ""
    }`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">{title}</h3>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
          </div>

          {(showCheckin || showMore) && (
            <div className="flex gap-2 pt-1">
              {showCheckin && (
                <Button 
                  onClick={onCheckin}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check-in
                </Button>
              )}
              {showMore && (
                <Button 
                  onClick={onMore}
                  variant="outline"
                  size="sm"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};