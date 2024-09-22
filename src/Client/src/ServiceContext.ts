import React from "react";
import { TestService } from "./services/TestService";
import { AuthService } from "./services/AuthService";
import { DrinkService } from "./services/DrinkService";

export interface ServiceContextContent {
  test: TestService;
  auth: AuthService;
  drinkService: DrinkService;
}

export const ServiceContext = React.createContext<ServiceContextContent>(
  {} as ServiceContextContent
);
