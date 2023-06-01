# Faker

Generate fake example JSON from any schema available, powered by GPT

## Local Development

Run local supabase docker
```
npx supabase start
```

Serve the function within this project
```
npx supabase functions serve --env-file .env
```

Call the local function
```
curl -i --location --request POST 'http://localhost:54321/functions/v1/generate-json-example' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
  --header 'Content-Type: application/json' \
  --data '{"payload":"type Row = {\n  name: string; \n}"}'
```
