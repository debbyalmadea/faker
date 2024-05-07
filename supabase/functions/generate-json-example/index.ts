// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatGPTAPI } from "https://esm.sh/chatgpt@5.2.5";
import { corsHeaders } from "../_shared/cors.ts";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

type Request = {
  payload: string;
  count: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const redis = new Redis({
      url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
      token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
    });

    // Create a new ratelimiter, that allows 10 requests per 10 seconds
    const limit = Deno.env.get("EDGE_FUNCTION_RATE_LIMIT")!;
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, "1 d"),
      analytics: true,
    });
    const identifier = "api";
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return new Response(
        JSON.stringify({ status: 429, message: "Daily limit exceeded" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { payload, count }: Request = await req.json();
    const apiKey = Deno.env.get("CHATGPT_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ status: 400, message: "Invalid api key" })
      );
    }

    const api = new ChatGPTAPI({
      apiKey: apiKey,
      completionParams: {
        model: "gpt-3.5-turbo",
        max_tokens: 2048,
        temperature: 0.2,
        top_p: 0.1,
      },
    });

    let res;
    try {
      res = await api.sendMessage(
        `
        Generate an example JSON of an array from this type with ${
          count ?? 1
        } elements,
        do not add any other text beside the JSON example. Write the result in text. Do not use markdown or any text editor.\n${payload}`
      );
    } catch (e) {
      console.error("unable to call gpt api", e);
      return new Response(
        JSON.stringify({ status: 400, message: "Unable to call gpt api" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(res);

    return new Response(JSON.stringify({ status: 200, example: res?.text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: 500, message: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
