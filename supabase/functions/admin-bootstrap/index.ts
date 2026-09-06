import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-bootstrap-token",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const expected = Deno.env.get("ADMIN_BOOTSTRAP_TOKEN");
  if (!expected || req.headers.get("x-bootstrap-token") !== expected) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { email, password } = await req.json();
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "email and password required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Find existing user by email
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listErr) {
    return new Response(JSON.stringify({ error: listErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let user = list.users.find((u) => u.email?.toLowerCase() === String(email).toLowerCase());

  if (user) {
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error || !data.user) {
      return new Response(JSON.stringify({ error: error?.message ?? "create failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    user = data.user;
  }

  await admin.from("user_roles").upsert(
    { user_id: user!.id, role: "super_admin" },
    { onConflict: "user_id,role" },
  );

  return new Response(JSON.stringify({ ok: true, user_id: user!.id, email: user!.email }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
