
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Download, Trash } from 'lucide-react';

export const PrivacySettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Privacy Preferences</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="share-data" className="flex-1">Share Trading Data for Analytics</Label>
            <Switch id="share-data" defaultChecked />
          </div>
          <p className="text-sm text-muted-foreground">
            We use anonymized trading data to improve our algorithms and provide better insights.
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="personalized-ads" className="flex-1">Personalized Content</Label>
            <Switch id="personalized-ads" defaultChecked />
          </div>
          <p className="text-sm text-muted-foreground">
            Allow us to customize content and recommendations based on your activity.
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="activity-status" className="flex-1">Show Online Status</Label>
            <Switch id="activity-status" defaultChecked />
          </div>
          <p className="text-sm text-muted-foreground">
            Let others see when you're active on the platform.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Social Sharing</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="share-trades" className="flex-1">Share My Trades</Label>
            <Select defaultValue="friends">
              <SelectTrigger id="share-trades" className="w-[180px]">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="share-portfolio" className="flex-1">Share My Portfolio</Label>
            <Select defaultValue="private">
              <SelectTrigger id="share-portfolio" className="w-[180px]">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your Data</h3>
        
        <div className="flex flex-col space-y-2">
          <Button variant="outline" className="justify-between">
            <span className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download My Data
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" className="justify-between text-destructive border-destructive/20 hover:bg-destructive/10">
            <span className="flex items-center">
              <Trash className="mr-2 h-4 w-4" />
              Delete My Account
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
