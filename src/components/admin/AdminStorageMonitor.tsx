import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Database, HardDrive, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface StorageData {
  user_id: string;
  email: string;
  storage_used: number;
  storage_limit: number;
  is_premium: boolean;
  document_count: number;
  signature_count: number;
}

export function AdminStorageMonitor() {
  const [storageData, setStorageData] = useState<StorageData[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalUsed: 0,
    totalLimit: 0,
    userCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorageData();
  }, []);

  const fetchStorageData = async () => {
    try {
      setLoading(true);
      
      // Fetch all user profiles with storage information
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;

      // Fetch document and signature counts for each user
      const userStorageData = await Promise.all(
        (profiles || []).map(async (profile) => {
          const [documentsResult, signaturesResult] = await Promise.all([
            supabase
              .from('documents')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', profile.id),
            supabase
              .from('signatures')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', profile.id)
          ]);

          return {
            user_id: profile.id,
            email: 'Email not available', // We can't easily get auth emails here
            storage_used: profile.storage_used || 0,
            storage_limit: profile.storage_limit || 0,
            is_premium: profile.is_premium || false,
            document_count: documentsResult.count || 0,
            signature_count: signaturesResult.count || 0
          };
        })
      );

      setStorageData(userStorageData);

      // Calculate total stats
      const totalUsed = userStorageData.reduce((sum, user) => sum + user.storage_used, 0);
      const totalLimit = userStorageData.reduce((sum, user) => sum + user.storage_limit, 0);
      
      setTotalStats({
        totalUsed,
        totalLimit,
        userCount: userStorageData.length
      });

    } catch (error: any) {
      console.error('Failed to fetch storage data:', error);
      toast.error('Failed to load storage data');
    } finally {
      setLoading(false);
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
    if (percentage >= 90) return { color: 'text-red-500', status: 'Critical' };
    if (percentage >= 75) return { color: 'text-yellow-500', status: 'Warning' };
    return { color: 'text-green-500', status: 'Normal' };
  };

  // Sort users by usage percentage (highest first)
  const sortedStorageData = [...storageData].sort((a, b) => {
    const aPercentage = getUsagePercentage(a.storage_used, a.storage_limit);
    const bPercentage = getUsagePercentage(b.storage_used, b.storage_limit);
    return bPercentage - aPercentage;
  });

  return (
    <div className="space-y-6">
      {/* Overall Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {totalStats.totalLimit > 0 ? Math.round((totalStats.totalUsed / totalStats.totalLimit) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall utilization rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.userCount}</div>
            <p className="text-xs text-muted-foreground">
              Users with storage data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Storage Monitor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Storage Monitor</CardTitle>
              <CardDescription>Monitor user storage usage and limits</CardDescription>
            </div>
            <Button onClick={fetchStorageData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                    <TableHead>Plan</TableHead>
                    <TableHead>Storage Usage</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStorageData.map((user) => {
                    const usagePercentage = getUsagePercentage(user.storage_used, user.storage_limit);
                    const status = getUsageStatus(usagePercentage);
                    
                    return (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{user.email}</p>
                            <p className="text-xs text-muted-foreground">{user.user_id.slice(0, 8)}...</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_premium ? 'default' : 'secondary'}>
                            {user.is_premium ? 'Premium' : 'Free'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{formatBytes(user.storage_used)}</span>
                              <span className="text-muted-foreground">
                                / {formatBytes(user.storage_limit)}
                              </span>
                            </div>
                            <Progress value={usagePercentage} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {usagePercentage.toFixed(1)}% used
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{user.document_count} documents</p>
                            <p className="text-muted-foreground">{user.signature_count} signatures</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {usagePercentage >= 90 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            <span className={`text-sm font-medium ${status.color}`}>
                              {status.status}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}