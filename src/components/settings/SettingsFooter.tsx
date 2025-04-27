
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface SettingsFooterProps {
  onCancel?: () => void;
  isSubmitting?: boolean;
  onReset?: () => void;
  isSaving?: boolean;
}

const SettingsFooter = ({ onCancel, isSubmitting = false, onReset, isSaving = false }: SettingsFooterProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <div className={`flex ${isMobile ? "flex-col gap-2" : "justify-end gap-4"} mt-6`}>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || isSaving}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      )}
      
      {onReset && (
        <Button type="button" variant="outline" onClick={onReset} disabled={isSubmitting || isSaving}>
          Reset
        </Button>
      )}
      
      <Button type="submit" disabled={isSubmitting || isSaving} className={isMobile ? "w-full" : ""}>
        {isSubmitting || isSaving ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </>
        )}
      </Button>
    </div>
  );
};

export default SettingsFooter;
