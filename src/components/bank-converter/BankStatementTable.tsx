import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, X, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  balance?: number;
  category?: string;
  reference?: string;
}

interface BankStatementTableProps {
  data: Transaction[];
  onClear?: () => void;
}

export function BankStatementTable({ data, onClear }: BankStatementTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Calculate summary statistics
  const totalCredits = data.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = data.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const netAmount = totalCredits - totalDebits;
  const creditCount = data.filter(t => t.type === 'credit').length;
  const debitCount = data.filter(t => t.type === 'debit').length;

  // Show empty state when no real data
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <FileText className="mx-auto h-16 w-16 text-foreground/20" />
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-foreground/60">No Transactions Available</h3>
          <p className="text-foreground/50 max-w-md mx-auto">
            Upload a PDF bank statement to view your transaction history and financial summary
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Header with Financial Summary */}
      <div className="bg-background border rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Transaction Summary</h2>
          {onClear && (
            <Button variant="outline" size="sm" onClick={onClear} className="flex items-center gap-2">
              <X size={16} />
              Clear Data
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">Total Credits</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</div>
            <div className="text-xs text-green-600/80">{creditCount} transactions</div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">Total Debits</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebits)}</div>
            <div className="text-xs text-red-600/80">{debitCount} transactions</div>
          </div>
          
          <div className={`${netAmount >= 0 ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'} border rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className={`h-5 w-5 ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-sm font-medium ${netAmount >= 0 ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                Net Amount
              </span>
            </div>
            <div className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netAmount >= 0 ? '+' : ''}{formatCurrency(netAmount)}
            </div>
            <div className={`text-xs ${netAmount >= 0 ? 'text-green-600/80' : 'text-red-600/80'}`}>
              {netAmount >= 0 ? 'Positive balance' : 'Negative balance'}
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Transactions</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{data.length}</div>
            <div className="text-xs text-blue-600/80">
              {data.length > 0 && `${formatDate(data[data.length - 1]?.date)} - ${formatDate(data[0]?.date)}`}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-background border rounded-lg">
        <div className="border-b p-4">
          <h3 className="text-lg font-semibold">Transaction Details</h3>
        </div>
        
        <ScrollArea className="h-[500px] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="min-w-[300px]">Description</TableHead>
                <TableHead className="w-[120px] text-right">Amount</TableHead>
                <TableHead className="w-[80px]">Type</TableHead>
                {data.some(item => item.balance !== undefined) && (
                  <TableHead className="w-[120px] text-right">Balance</TableHead>
                )}
                {data.some(item => item.category) && (
                  <TableHead className="w-[100px]">Category</TableHead>
                )}
                {data.some(item => item.reference) && (
                  <TableHead className="w-[120px]">Reference</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((transaction, index) => (
                <TableRow key={`transaction-${index}-${transaction.date}`} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm" title={transaction.description}>
                        {transaction.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={transaction.type === 'credit' ? 'default' : 'secondary'}
                      className={`${transaction.type === 'credit' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                    </Badge>
                  </TableCell>
                  {data.some(item => item.balance !== undefined) && (
                    <TableCell className="text-right font-medium">
                      {transaction.balance !== undefined ? (
                        <span className={transaction.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(transaction.balance)}
                        </span>
                      ) : (
                        <span className="text-foreground/50">-</span>
                      )}
                    </TableCell>
                  )}
                  {data.some(item => item.category) && (
                    <TableCell>
                      {transaction.category ? (
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      ) : (
                        <span className="text-foreground/50">-</span>
                      )}
                    </TableCell>
                  )}
                  {data.some(item => item.reference) && (
                    <TableCell className="text-sm text-foreground/70">
                      {transaction.reference || '-'}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      
      <div className="flex justify-between items-center text-sm text-foreground/50">
        <span>Showing {data.length} transactions</span>
        {data.length > 0 && (
          <span>
            Period: {formatDate(data[data.length - 1]?.date)} - {formatDate(data[0]?.date)}
          </span>
        )}
      </div>
    </div>
  );
}
