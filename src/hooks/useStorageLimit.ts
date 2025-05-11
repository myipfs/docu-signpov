
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/context/SessionContext';
import { z } from 'zod';

interface StorageData {
  used: number;
  limit: number;
  percentUsed: number;
  isPremium: boolean;
  isLimitReached: boolean;
}

// Define a Zod schema for the response data
const StorageDataResponseSchema = z.object({
  total_storage: z.number(),
  used_storage: z.number(),
  document_count: z.number(),
  signatures_count: z.number(),
  storage_buckets: z.array(z.string()).optional()
});

// Type based on the schema
type UserStorageDataV2 = z.infer<typeof StorageDataResponseSchema>;

// Type guard for runtime checking
function isValidStorageData(data: unknown): data is UserStorageDataV2 {
  try {
    StorageDataResponseSchema.parse(data);
    return true;
  } catch (error) {
    console.error("Invalid storage data:", error);
    return false;
  }
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
      
      // Call the correct RPC function without parameters since it uses auth.uid() internally
      const { data, error: rpcError } = await supabase
        .rpc('get_user_storage_data_v2')
        .single();
      
      if (rpcError) throw rpcError;
      
      if (data && isValidStorageData(data)) {
        // Validate data with Zod
        const validatedData = StorageDataResponseSchema.parse(data);
        
        const used = validatedData.used_storage || 0;
        const limit = validatedData.total_storage || 0;
        const percentUsed = limit > 0 ? (used / limit) * 100 : 0;
        
        // Check if user is premium by querying the profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', session.user.id)
          .single();
        
        setStorageData({
          used,
          limit,
          percentUsed,
          isPremium: profileData?.is_premium || false,
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
