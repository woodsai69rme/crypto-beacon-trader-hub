
import React from "react";
import ThemeSwitcher from "./settings/ThemeSwitcher";
import { TooltipProvider } from "@/components/ui/tooltip";

const ThemeToggle = () => (
  <TooltipProvider>
    <ThemeSwitcher />
  </TooltipProvider>
);

export default ThemeToggle;
