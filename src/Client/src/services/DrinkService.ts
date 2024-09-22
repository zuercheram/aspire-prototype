import { Drink } from "../models/drinks/Drink";
import { DrinkCreate } from "../models/drinks/DrinkCreate";
import { DrinkUpdate, DrinkUpdateWithId } from "../models/drinks/DrinkUpdate";
import { HttpClient } from "./HttpClient";

export class DrinkService {
  public baseQueryKey = ["drinks"];

  constructor(protected httpClient: HttpClient) {}

  public fetchAll = () => this.httpClient.get<Drink[]>("Drinks");

  public fetchAllQueryConfig = () => ({
    queryFn: this.fetchAll,
    queryKey: [...this.baseQueryKey, "all"],
  });

  public fetchAdminInfo = () => this.httpClient.get<string>("Drinks/AdminInfo");

  public fetchAdminInfoQueryConfig = () => ({
    queryFn: this.fetchAdminInfo,
    queryKey: [...this.baseQueryKey, "adminInfo"],
  });

  public create = (value: DrinkCreate) =>
    this.httpClient.post<Drink, DrinkCreate>("Drinks", value);

  public update = (id: number, value: DrinkUpdate) => {
    const valueWithId = value as DrinkUpdateWithId;
    valueWithId.drinkId = id;
    return this.httpClient.post<Drink, DrinkUpdate>("Drinks", value);
  };
}
