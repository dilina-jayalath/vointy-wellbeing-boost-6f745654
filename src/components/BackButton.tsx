import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  label?: string;
  fallback?: string;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const BackButton = ({
  label = "Back",
  fallback = "/",
  className,
  variant = "ghost",
  size = "sm",
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(fallback);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn("gap-1", className)}
      aria-label={label}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
};

export default BackButton;
