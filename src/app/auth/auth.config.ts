export class AuthConfig {
  constructor(
    public readonly clientId: string,
    public readonly domain: string,
    public readonly apiKeys: { Authorization: string },
  ) {}
}
