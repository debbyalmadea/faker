// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatGPTAPI } from "https://esm.sh/chatgpt@5.2.5";
import { corsHeaders } from '../_shared/cors.ts'
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

type Request = {
  payload: string;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const redis = new Redis({
      url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
      token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
    });

    // Create a new ratelimiter, that allows 10 requests per 10 seconds
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
      analytics: true,
    });
  
    const identifier = "api";
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return new Response(JSON.stringify({ status: 429, message: "Daily limit exceeded" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json"},
      });
    }

    const { payload }: Request = await req.json();
    const apiKey = Deno.env.get("CHATGPT_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ status: 400, message: "Invalid api key" }));
    }
  
    const api = new ChatGPTAPI({
      apiKey: apiKey,
    });
  
    let res;
    try {
      res = await api.sendMessage(`
        Generate an example JSON from this type,
        do not add any other text beside the JSON example\n${payload}`);
    } catch (e) {
      console.error("unable to call gpt api", e);
      return new Response(JSON.stringify({ status: 400, message: "Unable to call gpt api" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  
    // Find all things enclosed in curly bratches, e.g {}
    // Hence, we can clean out all unecessary things from GPT
    const jsonRegex = /\{[^{}]*\}/g;
    const jsonMatches = res?.text?.match(jsonRegex);
    if (!jsonMatches) {
      return new Response(
        JSON.stringify({ status: 400, message: "Unable to generate json example" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  
    const exampleJson = jsonMatches[0];
  
    return new Response(JSON.stringify({ status: 200, example: exampleJson }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: 500, message: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json"},
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
