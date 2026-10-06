export type PortalProfile =
  | {
      kind: 'google';
      authenticated: true;
      sub: string;
      name: string;
      email: string;
      picture: string | null;
      createdAt: string;
    }
  | {
      kind: 'student';
      authenticated: false;
      name: string;
      email: string | null;
      whatsapp: string;
      school: string;
      city: string;
      createdAt: string;
    };

export interface GoogleOAuthFlow {
  state: string;
  verifier: string;
  returnTo: string;
  createdAt: number;
}
