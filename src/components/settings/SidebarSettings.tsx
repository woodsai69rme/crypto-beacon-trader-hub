
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { SettingsComponentProps } from './types';

const SidebarSettings: React.FC<SettingsComponentProps> = ({ form }) => {
  const sidebarEnabled = form.watch('sidebar.enabled');
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Sidebar Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize the sidebar appearance and behavior
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="sidebar.enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Sidebar Navigation
                    </FormLabel>
                    <FormDescription>
                      Enable sidebar navigation for quick access to sections
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {sidebarEnabled && (
              <>
                <FormField
                  control={form.control}
                  name="sidebar.position"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Sidebar Position</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="left" id="position-left" />
                            <Label htmlFor="position-left">Left</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="right" id="position-right" />
                            <Label htmlFor="position-right">Right</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Select which side of the screen the sidebar appears
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sidebar.collapsed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Default Collapsed
                        </FormLabel>
                        <FormDescription>
                          Start with the sidebar in collapsed state
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sidebar.showLabels"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Show Labels
                        </FormLabel>
                        <FormDescription>
                          Display text labels next to sidebar icons
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sidebar.autoHide"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Auto-hide on Mobile
                        </FormLabel>
                        <FormDescription>
                          Automatically hide sidebar on small screens
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={Boolean(field.value)}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarSettings;
