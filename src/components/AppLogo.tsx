import { TreePine, Cross } from 'lucide-react';

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const AppLogo = ({ size = "md", showText = true }: AppLogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full gradient-primary flex items-center justify-center shadow-glow`}>
          <div className="relative">
            <TreePine className="text-white w-6 h-6" />
            <Cross className="absolute -top-1 -right-1 text-white w-3 h-3" />
          </div>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold text-primary`}>Raízes</h1>
          <p className="text-xs text-muted-foreground -mt-1">Discipulado</p>
        </div>
      )}
    </div>
  );
};