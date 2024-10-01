import { AuthData } from "../models/AuthData";
import { HttpClient } from "./HttpClient";

export class AuthService {
  public baseQueryKey = ["Auth"];

  constructor(protected httpClient: HttpClient) {}

  public fetchAuthData = () => this.httpClient.get<AuthData>("Auth/User");

  public fetchAuthDataQueryConfig = () => ({
    queryFn: this.fetchAuthData,
    queryKey: [...this.baseQueryKey, "fetchAuth"],
  });
}
