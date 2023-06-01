// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatGPTAPI } from "https://esm.sh/chatgpt@5.2.5";

type Request = {
  payload: string;
};

serve(async (req) => {
  const { payload }: Request = await req.json();
  const apiKey = Deno.env.get("CHATGPT_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ message: "invalid api key" }));
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
    return new Response(JSON.stringify({ message: "unable to call gpt api" }));
  }

  const exampleJson = res.text;

  return new Response(JSON.stringify({ example: exampleJson }), {
    headers: { "Content-Type": "application/json" },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
