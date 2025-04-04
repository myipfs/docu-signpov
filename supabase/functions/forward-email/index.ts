
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
  console.log(`[${new Date().toISOString()}] Received ${req.method} request to forward-email function`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[${new Date().toISOString()}] Handling OPTIONS request`);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    console.log(`[${new Date().toISOString()}] Processing email to: ${payload.to}, subject: ${payload.subject}`);
    
    let recipientEmail = payload.to;
    let isTemporaryEmail = false;
    
    // Check if this is a temporary email that needs forwarding
    if (payload.to.includes('@signdocs.temp')) {
      console.log(`[${new Date().toISOString()}] Temporary email detected: ${payload.to}`);
      isTemporaryEmail = true;
      
      // Look up the forwarding address in our database
      console.log(`[${new Date().toISOString()}] Looking up forwarding address for: ${payload.to}`);
      const { data: emailData, error: lookupError } = await supabase
        .from('temporary_emails')
        .select('forwarding_to')
        .eq('temp_email', payload.to)
        .eq('active', true)
        .single();

      if (lookupError) {
        console.error(`[${new Date().toISOString()}] Database lookup error:`, lookupError);
        return new Response(
          JSON.stringify({ error: 'Temporary email not found or inactive', details: lookupError }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!emailData) {
        console.error(`[${new Date().toISOString()}] No forwarding address found for: ${payload.to}`);
        return new Response(
          JSON.stringify({ error: 'Temporary email not found or inactive' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Use the forwarding address
      recipientEmail = emailData.forwarding_to;
      console.log(`[${new Date().toISOString()}] Email will be forwarded to: ${recipientEmail}`);
    }

    // Send the email using Resend
    const subject = isTemporaryEmail ? `Fwd: ${payload.subject}` : payload.subject;
    const text = isTemporaryEmail ? 
      `Original From: ${payload.from}\n\n${payload.text}` : 
      payload.text;
    const html = payload.html ? 
      (isTemporaryEmail ? 
        `<p><strong>Original From:</strong> ${payload.from}</p>${payload.html}` : 
        payload.html) :
      (isTemporaryEmail ?
        `<p><strong>Original From:</strong> ${payload.from}</p><pre>${payload.text}</pre>` :
        `<pre>${payload.text}</pre>`);

    console.log(`[${new Date().toISOString()}] Sending email to ${recipientEmail}`);
    const { data, error } = await resend.emails.send({
      from: `${isTemporaryEmail ? 'Forwarded' : 'SignDocs'} <support@signpov.com>`,
      to: recipientEmail,
      subject: subject,
      text: text,
      html: html,
    });

    if (error) {
      console.error(`[${new Date().toISOString()}] Error sending email:`, error);
      throw error;
    }

    console.log(`[${new Date().toISOString()}] Email sent successfully:`, data);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in forward-email function:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
