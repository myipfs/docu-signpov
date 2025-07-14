import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const moonshotApiKey = Deno.env.get('MOONSHOT_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!moonshotApiKey) {
      throw new Error('MOONSHOT_API_KEY is not configured');
    }

    const { prompt, type, file_content } = await req.json();

    let systemPrompt = '';
    let userMessage = '';

    switch (type) {
      case 'chat-pdf':
        systemPrompt = `You are an AI assistant specialized in analyzing PDF documents. Provide clear, accurate answers based on the document content. Always cite specific sections when possible.`;
        userMessage = `Document content: ${file_content}\n\nUser question: ${prompt}`;
        break;
      
      case 'document-query':
        systemPrompt = `You are an AI assistant that provides document summaries and answers queries. Be concise but comprehensive in your responses.`;
        userMessage = `Document content: ${file_content}\n\nQuery: ${prompt}`;
        break;
      
      case 'proposal-drafter':
        systemPrompt = `You are an expert business proposal writer. Create professional, persuasive proposals that are well-structured and tailored to the client's needs.`;
        userMessage = `Create a business proposal based on these requirements: ${prompt}`;
        break;
      
      case 'offer-letter-generator':
        systemPrompt = `You are an HR specialist who creates professional offer letters. Ensure legal compliance and professional formatting.`;
        userMessage = `Generate an offer letter with these details: ${prompt}`;
        break;
      
      case 'legal-research':
        systemPrompt = `You are a legal research assistant. Provide comprehensive analysis, identify key points, and offer practical recommendations based on legal documents.`;
        userMessage = `Legal document content: ${file_content}\n\nResearch request: ${prompt}`;
        break;
      
      case 'contract-analyzer':
        systemPrompt = `You are a contract analysis expert. Review contracts for key terms, potential risks, compliance issues, and provide actionable insights.`;
        userMessage = `Contract content: ${file_content}\n\nAnalysis request: ${prompt}`;
        break;
      
      default:
        systemPrompt = `You are a helpful AI assistant specialized in document processing and analysis.`;
        userMessage = prompt;
    }

    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${moonshotApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Moonshot API error:', errorText);
      throw new Error(`Moonshot API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      type: type,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in moonshot-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});