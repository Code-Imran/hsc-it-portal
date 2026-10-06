# Student profile and Google sign-in

The portal keeps student identity separate from the practice-exam seat-number flow.
Google sign-in is an OAuth authorization-code flow with PKCE; Google passwords are
never requested or stored. The portal stores the verified Google profile fields
(name, email, subject ID, and optional photo) in an HTTP-only server session. Access
tokens are used only to retrieve the profile and are not persisted.

“Continue without Google” creates an unverified student profile, not a password
account and not an authenticated identity. Do not use that profile alone to grant
access to protected features.

## Practice attempts and results

Each new mock exam selects a randomized paper using its unique exam-session ID while
keeping the paper pattern at 10 fill-in-the-blanks, 10 true/false, 10 single-correct,
5 two-correct, 2 three-correct, and one four-pair matching group. Topic MCQ pages also
shuffle their question order each time they load. Results count only questions the
student answered; the mock-exam score denominator is the marks available for those
answered questions. Chapter quizzes include a share action that uses the browser share
sheet where available and otherwise copies a link.

After a completed assessment, another attempt in the same browser requires Google
sign-in; the guest-profile option is hidden. This lightweight gate uses browser
`localStorage` and is intended for the student experience, not enforcement against
clearing browser data or using another device. Server-enforced attempt limits would
require persistent per-student storage.

## Configure Google OAuth

1. In Google Cloud Console, create an OAuth client ID for a Web application.
2. Add each exact callback URI to the OAuth Web client’s **Authorized redirect URIs**.
   The callback is built from the host that starts sign-in, so register the
   production origin(s) you use:
   - `https://it-portal.imranshaikh.workers.dev/api/auth/google/callback`
   - `https://<your-custom-domain>/api/auth/google/callback` if students will
     start sign-in on that custom domain.
   - `http://localhost:4321/api/auth/google/callback` for local development.

   The `workers.dev` callback can remain in use after adding a custom domain as
   long as users continue to start sign-in on the `workers.dev` host. If both
   hosts are used, register both redirect URIs on the same OAuth client. This
   server-side OAuth flow does not require an authorized JavaScript origin.
3. For local development, copy `.env.example` to `.env.local` and set
   both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. The sign-in flow checks
   both values before redirecting to Google and returns to the page where sign-in
   was started if configuration is missing.
4. Set the production credentials as secrets on the deployed Cloudflare Worker,
   using the deployed Worker name `it-portal`:

   ```powershell
   npx wrangler secret put GOOGLE_CLIENT_ID --name it-portal
   npx wrangler secret put GOOGLE_CLIENT_SECRET --name it-portal
   ```

   Enter the values only at Wrangler's secure prompt. Do not put the client secret
   in frontend variables, source files, or committed configuration.

The development server uses in-memory sessions and values from `.env.local`.
Production uses Astro's Cloudflare-backed session storage and secure, HTTP-only
cookies. Guest profile data is session-scoped and expires with that session.
