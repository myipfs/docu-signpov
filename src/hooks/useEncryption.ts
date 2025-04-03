
import { useState, useEffect } from 'react';
import { signatureEncryption, setupUserEncryption, retrieveEncryptionKey } from '@/utils/encryption';
import { supabase } from '@/integrations/supabase/client';

export function useEncryption() {
  const [isReady, setIsReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  
  // Check for authenticated user and existing encryption key
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user?.id) {
        const currentUserId = data.session.user.id;
        setUserId(currentUserId);
        
        // Check for existing encryption key
        const existingKey = retrieveEncryptionKey(currentUserId);
        
        if (existingKey) {
          setEncryptionKey(existingKey);
          setIsReady(true);
        } else {
          // Set up encryption for new user
          try {
            await setupUserEncryption(currentUserId);
            const newKey = retrieveEncryptionKey(currentUserId);
            setEncryptionKey(newKey);
            setIsReady(true);
          } catch (error) {
            console.error('Failed to set up encryption:', error);
          }
        }
      } else {
        setIsReady(true); // Still ready, just not authenticated
      }
    };
    
    checkAuth();
  }, []);
  
  // Encrypt data before saving to database
  const encryptData = async (data: string): Promise<string> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    return signatureEncryption.encrypt(data, userId);
  };
  
  // Decrypt data after retrieving from database
  const decryptData = async (encryptedData: string): Promise<string> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    return signatureEncryption.decrypt(encryptedData, userId);
  };
  
  return {
    isReady,
    isAuthenticated: !!userId,
    encryptData,
    decryptData
  };
}
