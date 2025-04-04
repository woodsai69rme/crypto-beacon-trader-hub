
import { useState } from "react";
import { Share2, Twitter, Facebook, Linkedin, Link, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface SocialSharingProps {
  title?: string;
  url?: string;
  description?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const SocialSharing = ({ 
  title = "Check out this cryptocurrency insight on CryptoBeacon", 
  url = window.location.href,
  description = "I found this interesting crypto info that I wanted to share.",
  variant = "outline",
  size = "sm"
}: SocialSharingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description);
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard.",
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share with your network</DialogTitle>
          <DialogDescription>
            Choose how you want to share this crypto insight
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4 justify-center">
            <a 
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Share on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href={shareLinks.email}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Share via Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={url}
              className="flex-1"
            />
            <Button type="button" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialSharing;
