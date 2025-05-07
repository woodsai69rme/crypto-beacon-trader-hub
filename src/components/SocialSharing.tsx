
import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const SocialSharing: React.FC = () => {
  const handleShare = () => {
    toast({
      title: "Sharing",
      description: "Sharing functionality will be implemented here",
    });
  };
  
  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
};

export default SocialSharing;
