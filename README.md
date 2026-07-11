# Supabase
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Groq AI (used client-side for chat assistant + vision search demo calls)
# In production, prefer routing these through Supabase Edge Functions so the
# key never ships to the browser. See supabase/functions/ai-chat and
# supabase/functions/vision-search.
VITE_GROQ_API_KEY=your-groq-api-key

# The following are set as Supabase Edge Function secrets, NOT in the browser:
# supabase secrets set GROQ_API_KEY=xxx
# supabase secrets set RESEND_API_KEY=xxx
# supabase secrets set RESEND_FROM_EMAIL="Shelfie <orders@yourdomain.com>"
GROQ_API_KEY=your-groq-api-key
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL="Shelfie <orders@yourdomain.com>"
