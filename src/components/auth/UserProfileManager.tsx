
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Settings, CreditCard, Shield } from 'lucide-react';
import { useAuth } from './AuthProvider';

const UserProfileManager: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    displayName: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    avatarUrl: '',
    tradingExperience: 'beginner',
    riskTolerance: 'medium',
    preferredCurrency: 'AUD',
    subscriptionTier: 'free'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Save profile updates
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatarUrl} />
              <AvatarFallback>
                {profile.displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{profile.displayName}</h3>
              <p className="text-muted-foreground">{profile.email}</p>
              <Badge variant="outline">
                {profile.subscriptionTier.charAt(0).toUpperCase() + profile.subscriptionTier.slice(1)} Plan
              </Badge>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Trading Experience</Label>
                  <select
                    id="experience"
                    className="w-full p-2 border rounded"
                    value={profile.tradingExperience}
                    onChange={(e) => setProfile({ ...profile, tradingExperience: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk">Risk Tolerance</Label>
                  <select
                    id="risk"
                    className="w-full p-2 border rounded"
                    value={profile.riskTolerance}
                    onChange={(e) => setProfile({ ...profile, riskTolerance: e.target.value })}
                  >
                    <option value="low">Conservative</option>
                    <option value="medium">Moderate</option>
                    <option value="high">Aggressive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trading Experience</Label>
                <p className="text-sm font-medium capitalize">{profile.tradingExperience}</p>
              </div>
              <div className="space-y-2">
                <Label>Risk Tolerance</Label>
                <p className="text-sm font-medium capitalize">{profile.riskTolerance}</p>
              </div>
              <div className="space-y-2">
                <Label>Preferred Currency</Label>
                <p className="text-sm font-medium">{profile.preferredCurrency}</p>
              </div>
              <div className="space-y-2">
                <Label>Member Since</Label>
                <p className="text-sm font-medium">January 2024</p>
              </div>
            </div>
          )}

          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">Enable 2FA</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Password</h4>
              <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
            </div>
            <Button variant="outline" size="sm">Change Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription & Billing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Current Plan: Free</h4>
              <p className="text-sm text-muted-foreground">Limited features available</p>
            </div>
            <Button>Upgrade Plan</Button>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h5 className="font-medium mb-2">Upgrade to Pro for:</h5>
            <ul className="text-sm space-y-1">
              <li>• Unlimited AI bot strategies</li>
              <li>• Advanced analytics & reporting</li>
              <li>• Real-time alerts & notifications</li>
              <li>• Priority customer support</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileManager;
