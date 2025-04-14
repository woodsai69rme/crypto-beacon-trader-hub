
import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import GeneralSettings from "./settings/GeneralSettings";
import AppearanceSettings from "./settings/AppearanceSettings";
import NotificationSettings from "./settings/NotificationSettings";
import DataPrivacySettings from "./settings/DataPrivacySettings";
import { SettingsFormValues } from "./settings/types";

interface UserSettingsProps {
  className?: string;
}

const UserSettings = ({ className }: UserSettingsProps) => {
  const [open, setOpen] = useState(false);
  
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      darkMode: true,
      notifications: true,
      language: "en",
      layout: "default",
      timeZone: "UTC",
      exportFormat: "csv"
    }
  });

  const onSubmit = (data: SettingsFormValues) => {
    // In a real application, save these settings to a database or localStorage
    localStorage.setItem("userSettings", JSON.stringify(data));
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved successfully.",
      variant: "default"
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
          <DialogDescription>
            Customize your dashboard experience and preferences
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="data">Data & Privacy</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TabsContent value="general">
                <GeneralSettings form={form} />
              </TabsContent>
              
              <TabsContent value="appearance">
                <AppearanceSettings form={form} />
              </TabsContent>
              
              <TabsContent value="notifications">
                <NotificationSettings form={form} />
              </TabsContent>
              
              <TabsContent value="data">
                <DataPrivacySettings form={form} />
              </TabsContent>
              
              <div className="flex justify-end">
                <Button type="submit">Save Settings</Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettings;
