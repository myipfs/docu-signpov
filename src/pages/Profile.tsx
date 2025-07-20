import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, Mail, Calendar, HardDrive, Crown, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData {
  id: string;
  email: string;
  created_at: string;
  is_premium: boolean;
  storage_used: number;
  storage_limit: number;
}

const Profile = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      navigate('/auth');
      return;
    }
    fetchProfileData();
  }, [session, navigate]);

  const fetchProfileData = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      
      // Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      setProfileData({
        id: session.user.id,
        email: session.user.email || 'No email',
        created_at: session.user.created_at,
        is_premium: profileData?.is_premium || false,
        storage_used: profileData?.storage_used || 0,
        storage_limit: profileData?.storage_limit || 524288000, // 500MB default
      });
    } catch (error: any) {
      console.error('Failed to fetch profile data:', error);
      toast.error('Failed to load profile data');
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

  const storagePercentage = profileData ? 
    Math.min((profileData.storage_used / profileData.storage_limit) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-6 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Account Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and view your plan details</p>
            </div>

            {profileData && (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Account Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                    <CardDescription>Your basic account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{profileData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Member Since</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(profileData.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">User ID</p>
                        <p className="text-xs text-muted-foreground font-mono">{profileData.id}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Plan Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5" />
                      Plan & Subscription
                    </CardTitle>
                    <CardDescription>Your current plan and benefits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Plan</span>
                      <Badge variant={profileData.is_premium ? 'default' : 'secondary'} className="flex items-center gap-1">
                        {profileData.is_premium && <Crown className="h-3 w-3" />}
                        {profileData.is_premium ? 'Premium' : 'Free'}
                      </Badge>
                    </div>
                    {profileData.is_premium ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">✓ Unlimited document storage</p>
                        <p className="text-sm text-muted-foreground">✓ Advanced templates</p>
                        <p className="text-sm text-muted-foreground">✓ Priority support</p>
                        <p className="text-sm text-muted-foreground">✓ Temporary email management</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">• Limited storage ({formatBytes(profileData.storage_limit)})</p>
                        <p className="text-sm text-muted-foreground">• Basic templates</p>
                        <Button size="sm" onClick={() => navigate('/pricing')} className="w-full mt-2">
                          Upgrade to Premium
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Storage Usage */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5" />
                      Storage Usage
                    </CardTitle>
                    <CardDescription>Track your document and signature storage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Used Storage</span>
                      <span className="text-sm text-muted-foreground">
                        {formatBytes(profileData.storage_used)} / {formatBytes(profileData.storage_limit)}
                      </span>
                    </div>
                    <Progress value={storagePercentage} className="h-2" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Documents</p>
                        <p className="text-xs text-muted-foreground">Stored securely</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Signatures</p>
                        <p className="text-xs text-muted-foreground">Digital assets</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Templates</p>
                        <p className="text-xs text-muted-foreground">Quick access</p>
                      </div>
                    </div>
                    {storagePercentage > 80 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          ⚠️ You're running low on storage space. Consider upgrading to premium for unlimited storage.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;