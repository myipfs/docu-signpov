import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, RefreshCw, Users, HardDrive, Shield, Trash2, Power, PowerOff } from 'lucide-react';
import { toast } from 'sonner';

interface StorageData {
  user_id: string;
  email: string;
  storage_used: number;
  storage_limit: number;
  is_premium: boolean;
  document_count: number;
  signatures_count: number;
  last_activity_at?: string;
  is_dormant?: boolean;
  dormant_reason?: string;
}

interface DormantUser {
  id: string;
  email: string;
  last_activity_at: string;
  dormant_reason: string;
  storage_used: number;
  is_premium: boolean;
  created_at: string;
}

export function AdminStorageMonitor() {
  const [storageData, setStorageData] = useState<StorageData[]>([]);
  const [dormantUsers, setDormantUsers] = useState<DormantUser[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalUsed: 0,
    totalLimit: 0,
    averageUsage: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState<string | null>(null);

  useEffect(() => {
    fetchStorageData();
    fetchDormantUsers();
  }, []);

  const fetchStorageData = async () => {
    try {
      setLoading(true);
      
      const { data: users, error } = await supabase.rpc('get_all_users_admin');
      
      if (error) throw error;
      
      console.log('Admin users data:', users); // Debug log
      
      if (users && Array.isArray(users)) {
        const mappedData: StorageData[] = users.map((user: any) => ({
          user_id: user.id,
          email: user.email || 'Email not available',
          storage_used: user.storage_used || 0,
          storage_limit: user.storage_limit || 524288000,
          is_premium: user.is_premium || false,
          document_count: 0,
          signatures_count: 0,
          last_activity_at: user.last_activity_at,
          is_dormant: user.is_dormant || false,
          dormant_reason: user.dormant_reason
        }));
        
        setStorageData(mappedData);
        
        // Calculate total stats
        const totalUsed = mappedData.reduce((sum, user) => sum + user.storage_used, 0);
        const totalLimit = mappedData.reduce((sum, user) => sum + user.storage_limit, 0);
        const averageUsage = mappedData.length > 0 ? (totalUsed / totalLimit) * 100 : 0;
        
        setTotalStats({
          totalUsed,
          totalLimit,
          averageUsage,
          activeUsers: mappedData.filter(user => !user.is_dormant).length
        });
      }
    } catch (error: any) {
      console.error('Error fetching storage data:', error);
      toast.error('Failed to fetch storage data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDormantUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_dormant_users');
      
      if (error) throw error;
      
      if (data && Array.isArray(data)) {
        setDormantUsers(data as unknown as DormantUser[]);
      }
    } catch (error: any) {
      console.error('Error fetching dormant users:', error);
      toast.error('Failed to fetch dormant users');
    }
  };

  const clearUserStorage = async (userId: string, userEmail: string) => {
    if (processingUser) return;
    
    try {
      setProcessingUser(userId);
      
      const { data, error } = await supabase.rpc('admin_clear_user_storage', {
        p_user_id: userId
      });
      
      if (error) throw error;
      
      const result = data as any;
      toast.success(`Storage cleared for ${userEmail}. Deleted ${result.deleted_documents} documents and ${result.deleted_signatures} signatures.`);
      await fetchStorageData();
    } catch (error: any) {
      console.error('Error clearing user storage:', error);
      toast.error(`Failed to clear storage for ${userEmail}`);
    } finally {
      setProcessingUser(null);
    }
  };

  const markUsersDormant = async () => {
    try {
      const { data, error } = await supabase.rpc('mark_dormant_users');
      
      if (error) throw error;
      
      const result = data as any;
      toast.success(`Marked ${result.marked_dormant} users as dormant`);
      await fetchStorageData();
      await fetchDormantUsers();
    } catch (error: any) {
      console.error('Error marking users dormant:', error);
      toast.error('Failed to mark users as dormant');
    }
  };

  const reactivateUser = async (userId: string, userEmail: string) => {
    if (processingUser) return;
    
    try {
      setProcessingUser(userId);
      
      const { data, error } = await supabase.rpc('admin_reactivate_user', {
        p_user_id: userId
      });
      
      if (error) throw error;
      
      toast.success(`Reactivated user: ${userEmail}`);
      await fetchStorageData();
      await fetchDormantUsers();
    } catch (error: any) {
      console.error('Error reactivating user:', error);
      toast.error(`Failed to reactivate user: ${userEmail}`);
    } finally {
      setProcessingUser(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return 'Critical';
    if (percentage >= 75) return 'Warning';
    return 'Normal';
  };

  // Sort users by usage percentage (highest first)
  const sortedStorageData = [...storageData].sort((a, b) => {
    const aPercentage = getUsagePercentage(a.storage_used, a.storage_limit);
    const bPercentage = getUsagePercentage(b.storage_used, b.storage_limit);
    return bPercentage - aPercentage;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Storage Monitor</h2>
          <p className="text-muted-foreground">Monitor user storage usage and manage dormant accounts</p>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <PowerOff className="h-4 w-4" />
                Mark Dormant Users
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mark Inactive Users as Dormant</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark all users who haven't been active for 3+ months as dormant. 
                  Dormant users can be reactivated later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={markUsersDormant}>
                  Mark Dormant
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            onClick={() => {
              fetchStorageData();
              fetchDormantUsers();
            }}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage Used</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(totalStats.totalUsed)}</div>
            <p className="text-xs text-muted-foreground">
              of {formatBytes(totalStats.totalLimit)} allocated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Efficiency</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStats.averageUsage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall utilization rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Users with storage data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dormant Users</CardTitle>
            <PowerOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dormantUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              Inactive for 3+ months
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Storage Management Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Users</TabsTrigger>
          <TabsTrigger value="dormant">Dormant Users ({dormantUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active User Storage</CardTitle>
              <CardDescription>
                Storage usage for active users with management options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Storage Usage</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStorageData.filter(user => !user.is_dormant).map((user) => {
                    const usagePercentage = getUsagePercentage(user.storage_used, user.storage_limit);
                    const status = getUsageStatus(usagePercentage);
                    
                    return (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {user.email || 'Email not available'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.user_id.substring(0, 8)}...
                            </div>
                            {user.last_activity_at && (
                              <div className="text-xs text-muted-foreground">
                                Last active: {new Date(user.last_activity_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_premium ? "default" : "secondary"}>
                            {user.is_premium ? 'Premium' : 'Free'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{formatBytes(user.storage_used)}</span>
                              <span>/ {formatBytes(user.storage_limit)}</span>
                            </div>
                            <Progress value={usagePercentage} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              {usagePercentage.toFixed(1)}% used
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{user.document_count} documents</div>
                            <div>{user.signatures_count} signatures</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              status === 'Normal' ? 'default' : 
                              status === 'Warning' ? 'secondary' : 
                              'destructive'
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                disabled={processingUser === user.user_id || user.storage_used === 0}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                Clear Storage
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Clear User Storage</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete all documents and signatures for user {user.email}. 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => clearUserStorage(user.user_id, user.email)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Clear Storage
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dormant">
          <Card>
            <CardHeader>
              <CardTitle>Dormant Users</CardTitle>
              <CardDescription>
                Users marked as dormant due to inactivity (3+ months)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Storage Used</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dormantUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.email}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.id.substring(0, 8)}...
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_premium ? "default" : "secondary"}>
                          {user.is_premium ? 'Premium' : 'Free'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(user.last_activity_at).toLocaleDateString()}
                          <div className="text-xs text-muted-foreground">
                            {Math.floor((Date.now() - new Date(user.last_activity_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatBytes(user.storage_used)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {user.dormant_reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={processingUser === user.id}
                            onClick={() => reactivateUser(user.id, user.email)}
                            className="flex items-center gap-1"
                          >
                            <Power className="h-3 w-3" />
                            Reactivate
                          </Button>
                          
                          {user.storage_used > 0 && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  disabled={processingUser === user.id}
                                  className="flex items-center gap-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Clear Storage
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Clear Dormant User Storage</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete all documents and signatures for dormant user {user.email}. 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => clearUserStorage(user.id, user.email)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Clear Storage
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {dormantUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No dormant users found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}