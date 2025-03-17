
import { ReactNode } from 'react';

export interface Template {
  id: string;
  title: string;
  description: string;
  details: string;
  category: 'contract' | 'agreement' | 'form' | 'legal';
  popular: boolean;
  icon: ReactNode;
}
