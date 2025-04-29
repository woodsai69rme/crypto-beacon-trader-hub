
import React from "react";
import { Button } from "@/components/ui/button";
import { Sliders, Grid2X2, List } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardCustomizerProps {
  onLayoutChange?: (layout: any) => void;
  className?: string;
}

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
  onLayoutChange,
  className = "",
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`gap-2 ${className}`}>
          <Sliders className="h-4 w-4" />
          <span className="hidden md:inline">Customize</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Layout Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onLayoutChange?.({ type: "grid" })}>
          <Grid2X2 className="h-4 w-4 mr-2" />
          Grid View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onLayoutChange?.({ type: "list" })}>
          <List className="h-4 w-4 mr-2" />
          List View
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onLayoutChange?.({ density: "comfortable" })}>
          Comfortable Density
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onLayoutChange?.({ density: "compact" })}>
          Compact Density
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onLayoutChange?.({ density: "spacious" })}>
          Spacious Density
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardCustomizer;
