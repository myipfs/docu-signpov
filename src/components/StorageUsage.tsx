
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStorageLimit } from '@/hooks/useStorageLimit';
import { Link } from 'react-router-dom';
import { HardDrive, Upload } from 'lucide-react';

const StorageUsage = () => {
  const { 
    percentUsed, 
    formattedUsed, 
    formattedLimit, 
    formattedRemaining,
    isLimitReached,
    isPremium,
    loading
  } = useStorageLimit();
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive className="mr-2 h-5 w-5" />
            Storage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted"></div>
        </CardContent>
      </Card>
    );
  }
  
  // Determine progress bar color based on usage
  const getProgressColor = () => {
    if (percentUsed > 90) return "bg-destructive";
    if (percentUsed > 75) return "bg-yellow-500";
    return "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HardDrive className="mr-2 h-5 w-5" />
          Storage {isPremium && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Premium</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress
          value={percentUsed} 
          className="h-2 mb-2"
          indicatorClassName={getProgressColor()}
        />
        
        <div className="flex justify-between text-sm">
          <span>{formattedUsed} used</span>
          <span>{formattedLimit} total</span>
        </div>
        
        {isLimitReached ? (
          <div className="mt-4">
            <p className="text-destructive mb-2">Storage limit reached!</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/plans">
                Upgrade for More Storage
              </Link>
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">
            {formattedRemaining} available
          </p>
        )}
        
        {!isPremium && percentUsed > 75 && (
          <Button asChild variant="outline" size="sm" className="w-full mt-4">
            <Link to="/plans">
              Upgrade for 2x Storage
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StorageUsage;
