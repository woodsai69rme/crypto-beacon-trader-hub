
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const SettingsFooter = () => {
  return (
    <div className="flex justify-end">
      <Button type="submit">
        <Save className="mr-2 h-4 w-4" />
        Save Settings
      </Button>
    </div>
  );
};

export default SettingsFooter;
