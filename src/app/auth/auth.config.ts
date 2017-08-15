export class AuthConfig {
  ClientId: string;
  AppWebDomain: string;
  TokenScopesArray: string[];
  RedirectUriSignIn: string;
  RedirectUriSignOut: string;

  constructor(
      clientId: string,
      appDomain: string,
      scopes: string[] = [],
      signInUri = '/',
      signOutUri = '/'
    ) {

    this.ClientId = clientId;
    this.AppWebDomain = appDomain;
    this.TokenScopesArray = scopes;
    this.RedirectUriSignIn = signInUri;
    this.RedirectUriSignOut = signOutUri;
  }
}
