import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  balance?: number;
  category?: string;
  reference?: string;
}

interface ConversionResult {
  success: boolean;
  data?: Transaction[];
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileData, fileName } = await req.json();

    if (!fileData) {
      return new Response(
        JSON.stringify({ success: false, error: 'No file data provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing bank statement:', fileName);

    // First, extract text from PDF using Anthropic's vision capabilities
    const extractPrompt = `You are a bank statement parser. Analyze this PDF bank statement image and extract ALL transaction data in a structured format.

IMPORTANT INSTRUCTIONS:
1. Extract EVERY transaction visible in the statement
2. For each transaction, identify: date, description, amount, whether it's a credit or debit
3. Extract account information: bank name, account number, statement period
4. Calculate running balances if not provided
5. Categorize transactions when possible (e.g., ATM, Transfer, Payment, Deposit, etc.)

Return your response as a JSON object with this exact structure:
{
  "bankName": "string",
  "accountNumber": "string (mask sensitive digits as ****1234)",
  "statementPeriod": "string (e.g., 'Jan 1 - Jan 31, 2024')",
  "openingBalance": number,
  "closingBalance": number,
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "description": "string",
      "amount": number (positive number, we'll determine credit/debit separately),
      "type": "credit" or "debit",
      "balance": number (running balance after transaction),
      "category": "string (optional)",
      "reference": "string (optional reference number)"
    }
  ]
}

Be extremely accurate with numbers and dates. If you can't determine something clearly, use reasonable defaults or null values.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: extractPrompt
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: fileData
              }
            }
          ]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    console.log('Raw AI response:', content);

    // Try to extract JSON from the response
    let parsedData;
    try {
      // Look for JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      
      // Fallback: try to extract data using a second Anthropic call
      const fallbackPrompt = `The previous response couldn't be parsed as JSON. Please convert this bank statement data into valid JSON format following this structure:

{
  "bankName": "string",
  "accountNumber": "string",
  "statementPeriod": "string",
  "openingBalance": number,
  "closingBalance": number,
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "description": "string",
      "amount": number,
      "type": "credit" or "debit",
      "balance": number,
      "category": "string",
      "reference": "string"
    }
  ]
}

Original response: ${content}

Return ONLY valid JSON, no other text.`;

      const fallbackResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${anthropicApiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: fallbackPrompt
          }]
        }),
      });

      const fallbackData = await fallbackResponse.json();
      const fallbackContent = fallbackData.content[0].text;
      
      const fallbackJsonMatch = fallbackContent.match(/\{[\s\S]*\}/);
      if (fallbackJsonMatch) {
        parsedData = JSON.parse(fallbackJsonMatch[0]);
      } else {
        throw new Error('Could not extract valid JSON from bank statement');
      }
    }

    // Process and validate the extracted data
    const transactions: Transaction[] = parsedData.transactions?.map((t: any) => ({
      date: t.date,
      description: t.description || 'Unknown transaction',
      amount: Math.abs(Number(t.amount) || 0),
      type: t.type === 'credit' ? 'credit' : 'debit',
      balance: Number(t.balance) || undefined,
      category: t.category || undefined,
      reference: t.reference || undefined,
    })) || [];

    // Calculate summary statistics
    const totalCredits = transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDebits = transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    const result: ConversionResult = {
      success: true,
      data: transactions,
      fileName: fileName || 'bank_statement.pdf',
      bankName: parsedData.bankName || 'Unknown Bank',
      accountNumber: parsedData.accountNumber || 'Unknown',
      statementPeriod: parsedData.statementPeriod || 'Unknown Period',
      summary: {
        totalTransactions: transactions.length,
        totalCredits: totalCredits,
        totalDebits: totalDebits,
        openingBalance: Number(parsedData.openingBalance) || 0,
        closingBalance: Number(parsedData.closingBalance) || 0,
      }
    };

    console.log('Conversion successful:', {
      fileName,
      transactionCount: transactions.length,
      bankName: result.bankName
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error converting bank statement:', error);
    
    const errorResult: ConversionResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred during conversion'
    };

    return new Response(JSON.stringify(errorResult), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});