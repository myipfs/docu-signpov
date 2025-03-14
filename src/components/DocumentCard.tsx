
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DocumentCardProps {
  id: string;
  title: string;
  date: string;
  status: 'draft' | 'waiting' | 'completed';
  signers?: { name: string; status: 'signed' | 'waiting' | 'not_sent' }[];
  className?: string;
}

export default function DocumentCard({ id, title, date, status, signers, className }: DocumentCardProps) {
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    waiting: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  const statusText = {
    draft: 'Draft',
    waiting: 'Waiting for signatures',
    completed: 'Completed'
  };

  return (
    <div className={cn(
      "bg-card border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md group",
      className
    )}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-lg mb-1 truncate">{title}</h3>
            <p className="text-xs text-foreground/60">{date}</p>
          </div>
          <span className={cn(
            "inline-block text-xs px-2 py-1 rounded-full font-medium", 
            statusColors[status]
          )}>
            {statusText[status]}
          </span>
        </div>
        
        {signers && signers.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-foreground/70 mb-2">Signers:</p>
            <div className="space-y-2">
              {signers.map((signer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm truncate">{signer.name}</span>
                  {signer.status === 'signed' && (
                    <span className="text-xs text-green-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      Signed
                    </span>
                  )}
                  {signer.status === 'waiting' && (
                    <span className="text-xs text-blue-600">Waiting</span>
                  )}
                  {signer.status === 'not_sent' && (
                    <span className="text-xs text-foreground/60">Not sent</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          {status === 'draft' && (
            <Button asChild size="sm" className="w-full rounded-lg">
              <Link to={`/sign/${id}`}>Continue signing</Link>
            </Button>
          )}
          {status === 'waiting' && (
            <Button asChild size="sm" variant="outline" className="w-full rounded-lg">
              <Link to={`/document/${id}`}>View document</Link>
            </Button>
          )}
          {status === 'completed' && (
            <Button asChild size="sm" variant="outline" className="w-full rounded-lg">
              <Link to={`/document/${id}`}>View document</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
