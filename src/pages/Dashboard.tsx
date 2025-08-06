
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { useStorageLimit } from '@/hooks/useStorageLimit';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StorageUsage from '@/components/StorageUsage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, FileText, CreditCard, Activity, Calendar, Crown, Shield } from 'lucide-react';

interface DashboardStats {
  documentCount: number;
  signatureCount: number;
  recentActivity: any[];
}

export default function Dashboard() {
  const { session, loading, user } = useSession();
  const { isPremium } = useStorageLimit();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    documentCount: 0,
    signatureCount: 0,
    recentActivity: []
  });
  const [statsLoading, setStatsLoading] = useState(true);
  
  useEffect(() => {
    if (!loading && !session) {
      navigate('/auth', { state: { returnTo: '/dashboard' } });
    }
  }, [session, loading, navigate]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardStats();
    }
  }, [session?.user?.id]);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      
      // Fetch document count
      const { count: docCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session?.user?.id);

      // Fetch signature count
      const { count: sigCount } = await supabase
        .from('signatures')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session?.user?.id);

      // Fetch recent documents
      const { data: recentDocs } = await supabase
        .from('documents')
        .select('id, title, created_at')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        documentCount: docCount || 0,
        signatureCount: sigCount || 0,
        recentActivity: recentDocs || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">Welcome back!</h1>
                <p className="text-muted-foreground mt-2">
                  {user?.email}
                  {isPremium && (
                    <Badge variant="default" className="ml-2">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </p>
              </div>
              <Button asChild>
                <Link to="/templates">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Document
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Documents</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statsLoading ? '...' : stats.documentCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total documents created
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Signatures</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statsLoading ? '...' : stats.signatureCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Saved signatures
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Plan Status</CardTitle>
                    <Crown className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isPremium ? 'Premium' : 'Free'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current subscription
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '...'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Account created
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Storage Usage */}
                <div className="lg:col-span-1">
                  <StorageUsage />
                </div>

                {/* Recent Activity */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Recent Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-4 bg-muted animate-pulse rounded"></div>
                        ))}
                      </div>
                    ) : stats.recentActivity.length > 0 ? (
                      <div className="space-y-3">
                        {stats.recentActivity.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{doc.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/document/${doc.id}`}>View</Link>
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full mt-4" asChild>
                          <Link to="/my-documents">View All Documents</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No documents yet</p>
                        <Button className="mt-2" asChild>
                          <Link to="/templates">Create Your First Document</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Type</label>
                    <div className="flex items-center mt-1">
                      <Badge variant={isPremium ? "default" : "secondary"}>
                        {isPremium ? (
                          <>
                            <Crown className="w-3 h-3 mr-1" />
                            Premium Account
                          </>
                        ) : (
                          'Free Account'
                        )}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Member Since</label>
                    <p className="text-muted-foreground">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : '...'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates about your documents</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Privacy Settings</p>
                      <p className="text-sm text-muted-foreground">Manage your data and privacy preferences</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Security</p>
                      <p className="text-sm text-muted-foreground">Password and security settings</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Billing & Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Current Plan</label>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant={isPremium ? "default" : "secondary"} className="text-sm">
                        {isPremium ? 'Premium Plan' : 'Free Plan'}
                      </Badge>
                      {!isPremium && (
                        <Button asChild>
                          <Link to="/plans">Upgrade to Premium</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {isPremium && (
                    <div>
                      <label className="text-sm font-medium">Benefits</label>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• 1GB storage (2x more than free)</li>
                        <li>• Priority support</li>
                        <li>• Advanced features</li>
                        <li>• Premium templates</li>
                      </ul>
                    </div>
                  )}
                  
                  {!isPremium && (
                    <div>
                      <label className="text-sm font-medium">Upgrade Benefits</label>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Get 2x more storage (1GB)</li>
                        <li>• Priority customer support</li>
                        <li>• Access to premium features</li>
                        <li>• Exclusive templates</li>
                      </ul>
                      <Button className="w-full mt-4" asChild>
                        <Link to="/plans">View Pricing Plans</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
