import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, FileText, PenTool, Mail, Database, TrendingUp, Shield, Settings } from 'lucide-react';
import { AdminUserManager } from '@/components/admin/AdminUserManager';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { AdminStorageMonitor } from '@/components/admin/AdminStorageMonitor';
import { AdminSubscriptionManager } from '@/components/admin/AdminSubscriptionManager';
import { toast } from 'sonner';

interface AdminData {
  total_users: number;
  premium_users: number;
  total_documents: number;
  total_signatures: number;
  total_temp_emails: number;
  storage_usage: {
    total_used: number;
    total_limit: number;
  };
  recent_signups: number;
}

export default function AdminDashboard() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [session]);

  const checkAdminAccess = async () => {
    if (!session?.user) {
      navigate('/auth');
      return;
    }

    try {
      // Check if user is admin
      const { data: adminCheck, error: adminError } = await supabase
        .rpc('is_admin');
      
      if (adminError) throw adminError;
      
      if (!adminCheck) {
        toast.error('Access denied: Admin privileges required');
        navigate('/');
        return;
      }

      setIsAdmin(true);

      // Get admin role
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_admin_role');
      
      if (!roleError && roleData) {
        setAdminRole(roleData);
      }

      // Fetch admin analytics
      await fetchAdminData();
    } catch (error: any) {
      console.error('Admin access check failed:', error);
      toast.error('Failed to verify admin access');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_analytics');
      
      if (error) throw error;
      
      if (data && typeof data === 'object') {
        setAdminData(data as AdminData);
      }
    } catch (error: any) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin analytics');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                System administration and monitoring
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={adminRole === 'super_admin' ? 'default' : 'secondary'}>
                {adminRole?.replace('_', ' ').toUpperCase()}
              </Badge>
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to App
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        {adminData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminData.total_users}</div>
                <p className="text-xs text-muted-foreground">
                  {adminData.recent_signups} new this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{adminData.premium_users}</div>
                <p className="text-xs text-muted-foreground">
                  {adminData.total_users > 0 ? Math.round((adminData.premium_users / adminData.total_users) * 100) : 0}% conversion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminData.total_documents}</div>
                <p className="text-xs text-muted-foreground">
                  {adminData.total_signatures} signatures created
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBytes(adminData.storage_usage.total_used)}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {formatBytes(adminData.storage_usage.total_limit)} total
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Admin Tabs */}
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="storage">Storage Monitor</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AdminAnalytics data={adminData} onRefresh={fetchAdminData} />
          </TabsContent>

          <TabsContent value="users">
            <AdminUserManager adminRole={adminRole} />
          </TabsContent>

          <TabsContent value="subscriptions">
            <AdminSubscriptionManager />
          </TabsContent>

          <TabsContent value="storage">
            <AdminStorageMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}