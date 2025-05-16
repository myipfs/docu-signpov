
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SignatureTabsProps {
  isAuthenticated: boolean;
}

export function SignatureTabs({ isAuthenticated }: SignatureTabsProps) {
  return (
    <TabsList className={`grid ${isAuthenticated ? 'grid-cols-4' : 'grid-cols-3'}`}>
      <TabsTrigger value="draw">Draw</TabsTrigger>
      <TabsTrigger value="type">Type</TabsTrigger>
      <TabsTrigger value="upload">Upload</TabsTrigger>
      {isAuthenticated && (
        <TabsTrigger value="saved">Saved</TabsTrigger>
      )}
    </TabsList>
  );
}
