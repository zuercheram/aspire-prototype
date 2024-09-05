import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import { Home } from "./Home";
import { Layout } from "./Layout";
import { ApiTest } from "./components/ApiTest";
import { AuthGuard } from "./auth/AuthGuard";
import { AdminComponent } from "./components/AdminComponent";
import { DrinksComponent } from "./components/drinks/DrinksComponent";
import { DrinkDetails } from "./components/drinks/DrinkDetails";
import { DrinkCreateForm } from "./components/drinks/DrinkCreateForm";
import { ScrollTableDemo } from "./components/ScrollTableDemo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/test",
        element: (
          <AuthGuard>
            <ApiTest />
          </AuthGuard>
        ),
      },
      {
        path: "/drinks",
        element: (
          <AuthGuard>
            <DrinksComponent />
          </AuthGuard>
        ),
        children: [{ path: "create", element: <DrinkCreateForm /> }],
      },
      {
        path: "/drinks/:id",
        element: (
          <AuthGuard>
            <DrinkDetails />
          </AuthGuard>
        ),
      },
      {
        path: "/scrollTableDemo",
        element: <ScrollTableDemo />,
      },
      {
        path: "/admin",
        element: (
          <AuthGuard requiredRole="Admin">
            <AdminComponent />
          </AuthGuard>
        ),
      },
    ],
  },
]);
