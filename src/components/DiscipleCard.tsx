import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Phone, MessageCircle } from "lucide-react";

interface DiscipleCardProps {
  name: string;
  nextMeeting: {
    date: string;
    time: string;
  };
  stage: string;
  phone: string;
  onCall?: () => void;
  onWhatsApp?: () => void;
}

export const DiscipleCard = ({ 
  name, 
  nextMeeting, 
  stage, 
  phone,
  onCall,
  onWhatsApp
}: DiscipleCardProps) => {
  return (
    <Card className="shadow-card transition-smooth hover:shadow-soft">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">{stage}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{nextMeeting.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{nextMeeting.time}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button 
              onClick={onCall}
              variant="outline"
              size="sm"
              className="flex-1 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <Phone className="w-4 h-4 mr-1" />
              Ligar
            </Button>
            <Button 
              onClick={onWhatsApp}
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};