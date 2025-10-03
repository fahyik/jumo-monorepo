# Supabase Local Development Setup

## 1. Generate Signing Keys

Run the following command:

```bash
supabase gen signing-key
```

Save the generated key to `supabase/signing_keys.json`

## 2. Update Config

Update your `supabase/config.toml` with the new keys path:

```toml
[auth]
signing_keys_path = "./signing_keys.json"
```

## 3. Generate Bearer JWT Token for Local Dev

Run the following command to generate a token:

```bash
supabase gen bearer-jwt --role service_role --payload "{\"iss\": \"http://127.0.0.1:54321/auth/v1\", \"aud\": \"authenticated\"}" --valid-for "5256000m"
```

Example token:

```
eyJhbGciOiJFUzI1NiIsImtpZCI6IjI0MzBjZDk4LTNlYzAtNDRmMS1hODQ5LWFhNTdiM2UxYThlYiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzkxMDI5MTk3LCJpYXQiOjE3NTk0OTMxOTcsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6NTQzMjEvYXV0aC92MSIsInJvbGUiOiJzZXJ2aWNlX3JvbGUifQ.OsarvGRtdn_z9pZ46NWsj9jd0JgwuhoCMRyCzj6pHHL2DDl8hr9AexHCKbWENpWkA2HPKg6x83iFCV4s8hBwUg
```
