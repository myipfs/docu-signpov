import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserPlus, Crown, Shield, User } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  created_at: string;
  is_premium: boolean;
  storage_used: number;
  storage_limit: number;
  admin_role?: string;
}

interface AdminUserManagerProps {
  adminRole: string | null;
}

export function AdminUserManager({ adminRole }: AdminUserManagerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users with profile data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;

      // Fetch admin users
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id, role, is_active');

      if (adminError) throw adminError;

      // Get auth users (need to fetch from admin endpoint or use RPC)
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      // Combine data
      const combinedUsers = authData.users.map(authUser => {
        const profile = profiles?.find(p => p.id === authUser.id);
        const adminRole = adminUsers?.find(a => a.user_id === authUser.id && a.is_active);
        
        return {
          id: authUser.id,
          email: authUser.email || 'No email',
          created_at: authUser.created_at,
          is_premium: profile?.is_premium || false,
          storage_used: profile?.storage_used || 0,
          storage_limit: profile?.storage_limit || 0,
          admin_role: adminRole?.role
        };
      });

      setUsers(combinedUsers);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
      
      // Fallback: fetch from profiles table only
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (!error && profiles) {
          setUsers(profiles.map(profile => ({
            id: profile.id,
            email: 'Email not available',
            created_at: profile.created_at,
            is_premium: profile.is_premium || false,
            storage_used: profile.storage_used || 0,
            storage_limit: profile.storage_limit || 0
          })));
        }
      } catch (fallbackError) {
        console.error('Fallback fetch failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePremiumStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: !currentStatus,
          storage_limit: !currentStatus ? 1073741824 : 524288000 // 1GB for premium, 500MB for free
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast.success(`User ${!currentStatus ? 'upgraded to' : 'downgraded from'} premium`);
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to update premium status:', error);
      toast.error('Failed to update user status');
    }
  };

  const grantAdminAccess = async (userId: string, email: string, role: 'admin' | 'moderator' = 'admin') => {
    if (adminRole !== 'super_admin') {
      toast.error('Only super admins can grant admin access');
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .upsert({
          user_id: userId,
          email: email,
          role: role,
          is_active: true
        });
      
      if (error) throw error;
      
      toast.success(`Admin access granted to ${email}`);
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to grant admin access:', error);
      toast.error('Failed to grant admin access');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || 
      (selectedRole === 'premium' && user.is_premium) ||
      (selectedRole === 'free' && !user.is_premium) ||
      (selectedRole === 'admin' && user.admin_role);
    
    return matchesSearch && matchesRole;
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'moderator': return <User className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts, permissions, and subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="premium">Premium Users</SelectItem>
                <SelectItem value="free">Free Users</SelectItem>
                <SelectItem value="admin">Admin Users</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchUsers} variant="outline">
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.admin_role)}
                          <div>
                            <p className="font-medium">{user.email}</p>
                            <p className="text-xs text-muted-foreground">{user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={user.is_premium ? 'default' : 'secondary'}>
                            {user.is_premium ? 'Premium' : 'Free'}
                          </Badge>
                          {user.admin_role && (
                            <Badge variant="outline" className="text-xs">
                              {user.admin_role.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatBytes(user.storage_used)} / {formatBytes(user.storage_limit)}</p>
                          <div className="w-20 bg-muted rounded-full h-1 mt-1">
                            <div 
                              className="bg-primary h-1 rounded-full" 
                              style={{ 
                                width: `${user.storage_limit > 0 ? Math.min((user.storage_used / user.storage_limit) * 100, 100) : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePremiumStatus(user.id, user.is_premium)}
                          >
                            {user.is_premium ? 'Downgrade' : 'Upgrade'}
                          </Button>
                          {adminRole === 'super_admin' && !user.admin_role && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => grantAdminAccess(user.id, user.email)}
                            >
                              <UserPlus className="h-3 w-3 mr-1" />
                              Admin
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}