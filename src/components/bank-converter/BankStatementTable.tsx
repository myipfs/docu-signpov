import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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
}

export function BankStatementTable({ data }: BankStatementTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/50">
        No transaction data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <ScrollArea className="h-[500px] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="min-w-[300px]">Description</TableHead>
              <TableHead className="w-[100px] text-right">Amount</TableHead>
              <TableHead className="w-[80px]">Type</TableHead>
              <TableHead className="w-[120px] text-right">Balance</TableHead>
              {data.some(item => item.reference) && (
                <TableHead className="w-[120px]">Reference</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((transaction, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px]">
                    <p className="truncate" title={transaction.description}>
                      {transaction.description}
                    </p>
                    {transaction.category && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {transaction.category}
                      </Badge>
                    )}
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
                <TableCell className="text-right font-medium">
                  {transaction.balance !== undefined && (
                    <span className={transaction.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(transaction.balance)}
                    </span>
                  )}
                </TableCell>
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
      
      <div className="mt-4 text-sm text-foreground/50 text-center">
        Showing {data.length} transactions
      </div>
    </div>
  );
}