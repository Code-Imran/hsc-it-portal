/// <reference types="astro/client" />

declare namespace App {
  interface SessionData {
    portalProfile: import('./lib/auth/profile').PortalProfile | undefined;
    googleOAuthFlow: import('./lib/auth/profile').GoogleOAuthFlow | undefined;
  }
}
