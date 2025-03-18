
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailPayload {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    
    // Extract temp email from the 'to' field
    const tempEmail = payload.to;
    
    // Look up the forwarding address in our database
    const { data: emailData, error: lookupError } = await supabase
      .from('temporary_emails')
      .select('forwarding_to')
      .eq('temp_email', tempEmail)
      .eq('active', true)
      .single();

    if (lookupError || !emailData) {
      console.error('Error looking up forwarding address:', lookupError);
      return new Response(
        JSON.stringify({ error: 'Temporary email not found or inactive' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Forward the email using Resend
    const { data, error } = await resend.emails.send({
      from: `Forwarded <forwarding@yourdomain.com>`,
      to: emailData.forwarding_to,
      subject: `Fwd: ${payload.subject}`,
      text: `Original From: ${payload.from}\n\n${payload.text}`,
      html: payload.html ? 
        `<p><strong>Original From:</strong> ${payload.from}</p>${payload.html}` :
        `<p><strong>Original From:</strong> ${payload.from}</p><pre>${payload.text}</pre>`,
    });

    if (error) {
      console.error('Error forwarding email:', error);
      throw error;
    }

    console.log('Email forwarded successfully:', data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in forward-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
