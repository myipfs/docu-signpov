import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast';
import { BankStatementTable } from '@/components/bank-converter/BankStatementTable';
import { BankStatementUploader } from '@/components/bank-converter/BankStatementUploader';

interface ConversionResult {
  success: boolean;
  data?: any[];
  fileName?: string;
  bankName?: string;
  accountNumber?: string;
  statementPeriod?: string;
  summary?: {
    totalTransactions: number;
    totalCredits: number;
    totalDebits: number;
    openingBalance: number;
    closingBalance: number;
  };
  error?: string;
}

export default function BankStatementConverter() {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ConversionResult | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setResult(null);

    try {
      // Convert file to base64
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 500);

        try {
          const { data, error } = await supabase.functions.invoke('convert-bank-statement', {
            body: {
              fileData: base64Data.split(',')[1], // Remove data:application/pdf;base64, prefix
              fileName: file.name
            }
          });

          clearInterval(progressInterval);
          setProgress(100);

          if (error) {
            throw new Error(error.message);
          }

          setResult(data);
          toast({
            title: "Conversion successful",
            description: `Bank statement converted successfully with ${data.data?.length || 0} transactions.`,
          });
        } catch (error) {
          clearInterval(progressInterval);
          console.error('Conversion error:', error);
          setResult({
            success: false,
            error: error instanceof Error ? error.message : 'Conversion failed'
          });
          toast({
            title: "Conversion failed",
            description: "Please try again or contact support if the issue persists.",
            variant: "destructive",
          });
        }
      };

      fileReader.readAsDataURL(file);
    } catch (error) {
      console.error('File reading error:', error);
      setIsConverting(false);
      toast({
        title: "File reading failed",
        description: "Could not read the uploaded file.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsConverting(false);
        setProgress(0);
      }, 1000);
    }
  };

  const exportToCSV = () => {
    if (!result?.data) return;

    const headers = ['Date', 'Description', 'Amount', 'Type', 'Balance'];
    const csvContent = [
      headers.join(','),
      ...result.data.map((row: any) => 
        [row.date, `"${row.description}"`, row.amount, row.type, row.balance].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName?.replace('.pdf', '')}_converted.csv` || 'bank_statement.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export successful",
      description: "CSV file downloaded successfully.",
    });
  };

  const exportToExcel = () => {
    if (!result?.data) return;

    // Create a simple Excel-compatible CSV
    const headers = ['Date', 'Description', 'Amount', 'Type', 'Balance'];
    const csvContent = [
      headers.join('\t'),
      ...result.data.map((row: any) => 
        [row.date, row.description, row.amount, row.type, row.balance].join('\t')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName?.replace('.pdf', '')}_converted.xls` || 'bank_statement.xls';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export successful",
      description: "Excel file downloaded successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Bank Statement <span className="text-gradient">Converter</span>
        </h1>
        <p className="text-foreground/70 max-w-2xl mx-auto mb-6">
          Convert PDF bank statements from any bank into clean Excel or CSV format. 
          Powered by advanced AI technology for accurate data extraction.
        </p>
        <div className="flex justify-center gap-4 mb-8">
          <Badge variant="secondary" className="flex items-center gap-2">
            <CheckCircle size={16} />
            Secure Processing
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <FileText size={16} />
            Any Bank Format
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Download size={16} />
            Excel & CSV Export
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload size={20} />
                Upload Bank Statement
              </CardTitle>
              <CardDescription>
                Upload your PDF bank statement to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BankStatementUploader 
                onFileUpload={handleFileUpload}
                isConverting={isConverting}
              />
              
              {isConverting && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 size={16} className="animate-spin" />
                    Converting bank statement...
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {result && !result.success && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {result.error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Summary Card */}
          {result?.success && result.summary && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Statement Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Bank:</span>
                  <span className="font-medium">{result.bankName || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Account:</span>
                  <span className="font-medium">{result.accountNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/70">Period:</span>
                  <span className="font-medium">{result.statementPeriod || 'N/A'}</span>
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/70">Transactions:</span>
                    <span className="font-medium">{result.summary.totalTransactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/70">Total Credits:</span>
                    <span className="font-medium text-green-600">
                      ${result.summary.totalCredits?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/70">Total Debits:</span>
                    <span className="font-medium text-red-600">
                      ${result.summary.totalDebits?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Closing Balance:</span>
                    <span className={result.summary.closingBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${result.summary.closingBalance?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {result?.success ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Converted Data</CardTitle>
                  <CardDescription>
                    {result.data?.length} transactions extracted from {result.fileName}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={exportToCSV}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    Export CSV
                  </Button>
                  <Button 
                    onClick={exportToExcel}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    Export Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <BankStatementTable data={result.data || []} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-96 text-center">
                <FileText size={64} className="text-foreground/20 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No data converted yet</h3>
                <p className="text-foreground/70 mb-4">
                  Upload a PDF bank statement to see the extracted data here
                </p>
                <p className="text-sm text-foreground/50">
                  Supported formats: PDF bank statements from any bank worldwide
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}