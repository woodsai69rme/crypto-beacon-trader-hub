
import React from "react";
import ThemeSwitcher from "./settings/ThemeSwitcher";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// We're forwarding to our enhanced ThemeSwitcher with tooltip
const ThemeToggle = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div>
        <ThemeSwitcher />
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>Toggle theme</p>
    </TooltipContent>
  </Tooltip>
);

export default ThemeToggle;
