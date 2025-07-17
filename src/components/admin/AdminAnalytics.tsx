import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Users, FileText, Mail } from 'lucide-react';

interface AdminAnalyticsProps {
  data: any;
  onRefresh: () => void;
}

export function AdminAnalytics({ data, onRefresh }: AdminAnalyticsProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">System Analytics</h2>
        <Button onClick={onRefresh} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Growth
            </CardTitle>
            <CardDescription>User registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Users:</span>
                <span className="font-medium">{data.total_users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Premium Users:</span>
                <span className="font-medium text-primary">{data.premium_users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">New This Month:</span>
                <span className="font-medium">{data.recent_signups}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Usage
            </CardTitle>
            <CardDescription>Document and signature activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Documents:</span>
                <span className="font-medium">{data.total_documents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Signatures:</span>
                <span className="font-medium">{data.total_signatures}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg per User:</span>
                <span className="font-medium">
                  {data.total_users > 0 ? Math.round(data.total_documents / data.total_users * 10) / 10 : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Services
            </CardTitle>
            <CardDescription>Temporary email usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Temp Emails:</span>
                <span className="font-medium">{data.total_temp_emails}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Usage Rate:</span>
                <span className="font-medium">
                  {data.premium_users > 0 ? Math.round((data.total_temp_emails / data.premium_users) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Storage Analytics
          </CardTitle>
          <CardDescription>System storage utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Storage Used:</span>
              <span className="font-medium">
                {formatBytes(data.storage_usage?.total_used || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Storage Limit:</span>
              <span className="font-medium">
                {formatBytes(data.storage_usage?.total_limit || 0)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ 
                  width: `${data.storage_usage?.total_limit > 0 ? (data.storage_usage.total_used / data.storage_usage.total_limit) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {data.storage_usage?.total_limit > 0 ? 
                Math.round((data.storage_usage.total_used / data.storage_usage.total_limit) * 100) : 0
              }% of total capacity used
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}