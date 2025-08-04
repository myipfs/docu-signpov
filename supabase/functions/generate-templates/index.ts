import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, count = 10 } = await req.json();

    const templates = [];
    
    for (let i = 0; i < count; i++) {
      const prompt = `Generate a professional ${category} template with the following structure:
      - title: A clear, specific title for the ${category}
      - description: A brief 1-2 sentence description of what this ${category} covers
      - details: Detailed template content in markdown format with placeholders like [PARTY_NAME], [DATE], [AMOUNT], etc.

      Make it legally sound and professionally written. Focus on practical, commonly needed ${category} types.
      
      Return only a JSON object with title, description, and details fields.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${anthropicApiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content[0].text;
      
      try {
        const templateData = JSON.parse(content);
        templates.push({
          ...templateData,
          category,
          id: `${category}_${Date.now()}_${i}`,
          popular: Math.random() > 0.7
        });
      } catch (e) {
        console.error('Failed to parse template JSON:', e);
        // Fallback template if JSON parsing fails
        templates.push({
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} Template ${i + 1}`,
          description: `A professional ${category} template for common business needs.`,
          details: `# ${category.charAt(0).toUpperCase() + category.slice(1)} Template\n\nThis is a professional ${category} template with standard terms and conditions.`,
          category,
          id: `${category}_${Date.now()}_${i}`,
          popular: false
        });
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return new Response(JSON.stringify({ templates }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating templates:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});