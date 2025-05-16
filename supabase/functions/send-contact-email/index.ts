
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const SUPPORT_EMAIL = "support@signpov.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactFormData = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Here you would integrate with an email service like Resend, SendGrid, etc.
    console.log("Sending email to:", SUPPORT_EMAIL);
    console.log("From:", email);
    console.log("Name:", name);
    console.log("Message:", message);

    // For demo purposes, just return success
    // In production, you would use a service like Resend
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your message has been sent to support@signpov.com" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in contact form:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
