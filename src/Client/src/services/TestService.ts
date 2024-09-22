import { WeatherForecast } from "../models/WeatherForecast";
import { HttpClient } from "./HttpClient";

export class TestService {
  public baseQueryKey = ["testService"];

  constructor(protected httpClient: HttpClient) {}

  public fetchData = () =>
    this.httpClient.get<WeatherForecast[]>("weatherforecast");

  public fetchDataQueryConfig = () => ({
    queryFn: this.fetchData,
    queryKey: this.baseQueryKey,
  });
}
