export abstract class AuthProviderService {

  abstract signIn(
    tokenUrl: string,
    onSuccess: () => void,
    onFailure: (err: Error) => void,
  ): void;

  abstract signOut(): void;

  abstract getAccessToken(): string;

  abstract isValid(): boolean;

  protected getCallbackUrl() {
    return "https://" + window.location.hostname + '/login';
  }
}
