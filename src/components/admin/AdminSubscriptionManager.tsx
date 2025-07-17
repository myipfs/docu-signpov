import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, CreditCard, TrendingUp, DollarSign, Users, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionData {
  user_id: string;
  email: string;
  is_premium: boolean;
  created_at: string;
  storage_limit: number;
  document_count: number;
}

export function AdminSubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      
      // Fetch all user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;

      // Get document counts for each user
      const subscriptionData = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { count: documentCount } = await supabase
            .from('documents')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);

          return {
            user_id: profile.id,
            email: 'Email not available', // We can't easily get auth emails here
            is_premium: profile.is_premium || false,
            created_at: profile.created_at,
            storage_limit: profile.storage_limit || 0,
            document_count: documentCount || 0
          };
        })
      );

      setSubscriptions(subscriptionData);
    } catch (error: any) {
      console.error('Failed to fetch subscription data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: !currentStatus,
          storage_limit: !currentStatus ? 1073741824 : 524288000 // 1GB for premium, 500MB for free
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast.success(`Subscription ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchSubscriptionData();
    } catch (error: any) {
      console.error('Failed to update subscription:', error);
      toast.error('Failed to update subscription');
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'premium' && sub.is_premium) ||
      (filterType === 'free' && !sub.is_premium);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: subscriptions.length,
    premium: subscriptions.filter(s => s.is_premium).length,
    free: subscriptions.filter(s => !s.is_premium).length,
    conversionRate: subscriptions.length > 0 ? 
      Math.round((subscriptions.filter(s => s.is_premium).length / subscriptions.length) * 100) : 0
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Subscription Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.premium}</div>
            <p className="text-xs text-muted-foreground">Active subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.free}</div>
            <p className="text-xs text-muted-foreground">Potential conversions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Free to premium</p>
          </CardContent>
        </Card>
      </div>

      {/* Stripe Integration Note */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Stripe Integration
          </CardTitle>
          <CardDescription>
            For complete subscription management, integrate with Stripe webhooks to sync subscription status automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="https://dashboard.stripe.com/customers" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Stripe Dashboard
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Configure Webhooks
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Management */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>Manage user subscriptions and premium access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter subscriptions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="premium">Premium Only</SelectItem>
                <SelectItem value="free">Free Only</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchSubscriptionData} variant="outline">
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
                    <TableHead>Status</TableHead>
                    <TableHead>Storage Limit</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.user_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{subscription.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {subscription.user_id.slice(0, 8)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subscription.is_premium ? 'default' : 'secondary'}>
                          {subscription.is_premium ? 'Premium' : 'Free'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {formatBytes(subscription.storage_limit)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{subscription.document_count} documents</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {new Date(subscription.created_at).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleSubscription(subscription.user_id, subscription.is_premium)}
                        >
                          {subscription.is_premium ? 'Deactivate' : 'Activate'}
                        </Button>
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