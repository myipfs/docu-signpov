
import React from 'react';

export const DocumentLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
};
