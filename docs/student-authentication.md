# Student profile and Google sign-in

The portal offers Google sign-in using an OAuth authorization-code flow with PKCE.
Google passwords are never requested or stored. The verified Google profile is
kept in an HTTP-only server session; access tokens are used only to retrieve the
profile and are not persisted.

“Continue without Google” creates an unverified, session-only student profile. It
is not password authentication and does not verify identity.

## Practice attempts and results

Topic MCQ pages shuffle their question order each time they load. Results count
only questions answered. After one completed quiz attempt, another attempt in the
same browser requires Google sign-in. This is a lightweight client-side restriction,
not tamper-proof enforcement.

## Configure Google OAuth

1. In Google Cloud Console, create a new OAuth client ID for a Web application. If a
   client secret was ever committed to a repository, revoke that client and use a
   newly generated client ID and secret.
2. Add this exact **Authorized redirect URI**:

   ```text
   https://hsc-it-portal.imranshaikh.workers.dev/api/auth/google/callback
   ```

3. Configure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` as secrets on the
   `hsc-it-portal` Cloudflare Worker. Do not commit these values or put them in
   frontend code:

   ```powershell
   npx wrangler secret put GOOGLE_CLIENT_ID --name hsc-it-portal
   npx wrangler secret put GOOGLE_CLIENT_SECRET --name hsc-it-portal
   ```

The login flow must start on the Worker site so its session cookie and OAuth
callback stay on the same origin. GitHub Pages cannot serve the authentication API.
Production sessions use Cloudflare KV; local development uses in-memory sessions
and local environment variables.
