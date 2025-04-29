
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  
  const [registerName, setRegisterName] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState<string>("");
  
  const [notifications, setNotifications] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would authenticate with your backend
    console.log("Login with:", { loginEmail, loginPassword });
    
    // For demo purposes, we'll simulate success
    toast({
      title: "Logged in successfully",
      description: "Welcome back to the crypto trading platform!",
    });
    
    // Create mock user
    const mockUser = {
      id: "user-123",
      name: "Demo User",
      email: loginEmail,
      avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=Felix",
      preferences: {
        theme: darkMode ? "dark" : "light",
        notifications: {
          email: notifications,
          push: notifications,
          priceAlerts: notifications
        },
        currency: "USD"
      }
    };
    
    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(mockUser));
    
    onOpenChange(false);
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (registerPassword !== registerPasswordConfirm) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate terms agreement
    if (!agreeTerms) {
      toast({
        title: "Terms not accepted",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would register with your backend
    console.log("Register:", { registerName, registerEmail, registerPassword });
    
    // For demo purposes, we'll simulate success
    toast({
      title: "Account created successfully",
      description: "Welcome to the crypto trading platform!",
    });
    
    // Create mock user
    const mockUser = {
      id: "user-" + Math.random().toString(36).substring(2, 8),
      name: registerName,
      email: registerEmail,
      avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${registerName}`,
      preferences: {
        theme: darkMode ? "dark" : "light",
        notifications: {
          email: notifications,
          push: notifications,
          priceAlerts: notifications
        },
        currency: "USD"
      }
    };
    
    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(mockUser));
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            Login or create an account to access all features.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="py-4">
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    placeholder="name@example.com" 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password" 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="login-remember"
                    defaultChecked
                  />
                  <Label htmlFor="login-remember">Remember me</Label>
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  Forgot Password?
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="py-4">
            <form onSubmit={handleRegister}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input 
                    id="register-name" 
                    placeholder="John Doe" 
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    placeholder="name@example.com" 
                    type="email" 
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="register-password-confirm">Confirm Password</Label>
                  <Input 
                    id="register-password-confirm" 
                    type="password" 
                    value={registerPasswordConfirm}
                    onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                  <Label htmlFor="notifications">Receive Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={setAgreeTerms}
                  />
                  <Label htmlFor="terms">I agree to the Terms & Conditions</Label>
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
            This is a demo application. No real credentials are stored.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
