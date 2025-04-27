
import React from "react";
import { Button } from "@/components/ui/button";

export interface SettingsFooterProps {
  isSaving?: boolean;
  isSubmitting?: boolean;
  onReset?: () => void;
  onCancel?: () => void;
  onApply?: () => void;
  showSaveButton?: boolean;
}

const SettingsFooter: React.FC<SettingsFooterProps> = ({
  isSaving = false,
  isSubmitting = false,
  onReset,
  onCancel,
  onApply,
  showSaveButton = true
}) => {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
      {onCancel && (
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      )}
      
      {onReset && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onReset}
          disabled={isSaving || isSubmitting}
        >
          Reset to Defaults
        </Button>
      )}
      
      {showSaveButton && (
        <Button 
          type="submit" 
          disabled={isSaving || isSubmitting}
        >
          {isSaving || isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      )}
      
      {onApply && (
        <Button 
          type="button" 
          onClick={onApply}
          disabled={isSaving || isSubmitting}
        >
          Apply
        </Button>
      )}
    </div>
  );
};

export default SettingsFooter;
