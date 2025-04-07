
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';

interface StorageData {
  used: number;
  limit: number;
  percentUsed: number;
  isPremium: boolean;
  isLimitReached: boolean;
}

// Define the type for the RPC function response
interface UserStorageData {
  storage_used: number;
  storage_limit: number;
  is_premium: boolean;
}

export const useStorageLimit = () => {
  const { session } = useSession();
  const [storageData, setStorageData] = useState<StorageData>({
    used: 0,
    limit: 0,
    percentUsed: 0,
    isPremium: false,
    isLimitReached: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStorageData = async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Use raw SQL query with RPC to avoid TypeScript errors
      // This is a workaround until the types are properly updated
      const { data, error } = await supabase.rpc<UserStorageData, Record<string, unknown>>('get_user_storage_data');

      if (error) throw error;

      if (data) {
        const used = data.storage_used || 0;
        const limit = data.storage_limit || 0;
        const percentUsed = limit > 0 ? (used / limit) * 100 : 0;
        
        setStorageData({
          used,
          limit,
          percentUsed,
          isPremium: data.is_premium || false,
          isLimitReached: used >= limit,
        });
      }
    } catch (err: any) {
      console.error('Error fetching storage data:', err);
      setError(err.message || 'Failed to load storage information');
    } finally {
      setLoading(false);
    }
  };

  // Convert bytes to a readable format
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculate remaining storage
  const remainingStorage = storageData.limit - storageData.used;
  const formattedUsed = formatBytes(storageData.used);
  const formattedLimit = formatBytes(storageData.limit);
  const formattedRemaining = formatBytes(remainingStorage);

  useEffect(() => {
    fetchStorageData();
  }, [session]);

  return {
    ...storageData,
    loading,
    error,
    formattedUsed,
    formattedLimit,
    formattedRemaining,
    formatBytes,
    refreshStorageData: fetchStorageData
  };
};
