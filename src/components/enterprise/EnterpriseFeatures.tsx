
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Shield, 
  Key, 
  BarChart3, 
  Settings, 
  Download, 
  Upload,
  Crown,
  Building,
  Globe,
  Lock
} from 'lucide-react';

const EnterpriseFeatures: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState(245);
  const [apiUsage, setApiUsage] = useState(78);
  const [selectedTenant, setSelectedTenant] = useState('main');

  // Mock data for enterprise features
  const userManagementData = [
    { id: 1, name: 'John Smith', email: 'john@university.edu', role: 'Admin', status: 'Active', lastLogin: '2 hours ago' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@university.edu', role: 'Instructor', status: 'Active', lastLogin: '1 day ago' },
    { id: 3, name: 'Mike Wilson', email: 'mike@university.edu', role: 'Student', status: 'Inactive', lastLogin: '1 week ago' },
    { id: 4, name: 'Lisa Davis', email: 'lisa@university.edu', role: 'Student', status: 'Active', lastLogin: '30 minutes ago' }
  ];

  const apiKeys = [
    { id: 1, name: 'Production API', key: 'pk_live_...a1b2c3', permissions: ['read', 'write'], lastUsed: '5 minutes ago', status: 'Active' },
    { id: 2, name: 'Development API', key: 'pk_test_...d4e5f6', permissions: ['read'], lastUsed: '2 hours ago', status: 'Active' },
    { id: 3, name: 'Integration API', key: 'pk_live_...g7h8i9', permissions: ['read', 'write', 'admin'], lastUsed: '1 day ago', status: 'Revoked' }
  ];

  const tenants = [
    { id: 'main', name: 'Main Instance', users: 245, domain: 'main.cryptotrader.edu' },
    { id: 'econ', name: 'Economics Dept', users: 89, domain: 'econ.cryptotrader.edu' },
    { id: 'business', name: 'Business School', users: 156, domain: 'business.cryptotrader.edu' }
  ];

  const whiteLabelSettings = {
    logo: '/api/placeholder/200/60',
    primaryColor: '#1f2937',
    secondaryColor: '#3b82f6',
    companyName: 'University Trading Platform',
    customDomain: 'trading.university.edu',
    favicon: '/api/placeholder/32/32'
  };

  return (
    <div className="space-y-6">
      {/* Enterprise Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            Enterprise Dashboard
          </h2>
          <p className="text-muted-foreground">Advanced features for institutional deployment</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          Enterprise Plan
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">API Usage</p>
                <p className="text-2xl font-bold">{apiUsage}%</p>
              </div>
              <Key className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tenants</p>
                <p className="text-2xl font-bold">{tenants.length}</p>
              </div>
              <Building className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold">99.9%</p>
              </div>
              <Shield className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
          <TabsTrigger value="tenants">Multi-Tenant</TabsTrigger>
          <TabsTrigger value="whitelabel">White-Label</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Users
                  </Button>
                  <Button size="sm">Add User</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Search users..." className="flex-1" />
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userManagementData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>API Key Management</CardTitle>
                <Button size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Generate New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {key.key}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {key.permissions.map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{key.lastUsed}</TableCell>
                      <TableCell>
                        <Badge variant={key.status === 'Active' ? 'default' : 'secondary'}>
                          {key.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Multi-Tenant Management</CardTitle>
                <Button size="sm">
                  <Building className="h-4 w-4 mr-2" />
                  Create Tenant
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name} ({tenant.users} users)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tenants.map((tenant) => (
                    <Card key={tenant.id} className={tenant.id === selectedTenant ? 'ring-2 ring-primary' : ''}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{tenant.name}</h4>
                          <p className="text-sm text-muted-foreground">{tenant.domain}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{tenant.users} users</span>
                            <Badge variant="outline">Active</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whitelabel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>White-Label Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Company Name</label>
                    <Input defaultValue={whiteLabelSettings.companyName} />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Custom Domain</label>
                    <Input defaultValue={whiteLabelSettings.customDomain} />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Primary Color</label>
                    <Input type="color" defaultValue={whiteLabelSettings.primaryColor} />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Secondary Color</label>
                    <Input type="color" defaultValue={whiteLabelSettings.secondaryColor} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Features</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Custom Logo</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Custom Colors</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Remove Branding</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Logo Upload</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload logo</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Preview</label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="text-center">
                        <h3 className="font-bold text-lg" style={{ color: whiteLabelSettings.primaryColor }}>
                          {whiteLabelSettings.companyName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                          Your customized trading platform
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button>Save Changes</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Advanced Reporting</CardTitle>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <h4 className="font-semibold">Usage Analytics</h4>
                      <p className="text-sm text-muted-foreground">User activity and engagement</p>
                      <Button variant="outline" size="sm" className="mt-2">View Report</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <h4 className="font-semibold">User Performance</h4>
                      <p className="text-sm text-muted-foreground">Learning outcomes and progress</p>
                      <Button variant="outline" size="sm" className="mt-2">View Report</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <h4 className="font-semibold">Security Audit</h4>
                      <p className="text-sm text-muted-foreground">Access logs and security events</p>
                      <Button variant="outline" size="sm" className="mt-2">View Report</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseFeatures;
