import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Users } from 'lucide-react';

interface SignatureStatus {
  id: string;
  signerName: string;
  signerEmail: string;
  status: 'pending' | 'signed' | 'viewed';
  signedAt?: Date;
  viewedAt?: Date;
}

interface SignatureTrackerProps {
  signatures: SignatureStatus[];
  className?: string;
}

const SignatureTracker: React.FC<SignatureTrackerProps> = ({
  signatures,
  className = ''
}) => {
  const getStatusIcon = (status: SignatureStatus['status']) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'viewed':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: SignatureStatus['status']) => {
    switch (status) {
      case 'signed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Signed</Badge>;
      case 'viewed':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Viewed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const signedCount = signatures.filter(s => s.status === 'signed').length;
  const totalCount = signatures.length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Signature Status ({signedCount}/{totalCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {signatures.map((signature) => (
            <div key={signature.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(signature.status)}
                <div>
                  <p className="font-medium">{signature.signerName}</p>
                  <p className="text-sm text-muted-foreground">{signature.signerEmail}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {getStatusBadge(signature.status)}
                {signature.signedAt && (
                  <p className="text-xs text-muted-foreground">
                    Signed: {signature.signedAt.toLocaleDateString()}
                  </p>
                )}
                {signature.viewedAt && signature.status === 'viewed' && (
                  <p className="text-xs text-muted-foreground">
                    Viewed: {signature.viewedAt.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {signatures.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No signatures requested yet</p>
              <p className="text-sm">Share this document to collect signatures</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureTracker;