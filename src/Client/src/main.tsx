// the hashes for all fontsource imports need to be added to the CSP style directive
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./i18n/config";
// the setLocale function from yup needs to be called before importing yup in another place, otherwise it has no effect
import "./i18n/yupLocaleSettings";
import React from "react";
import ReactDOM from "react-dom/client";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import createCache from "@emotion/cache";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { theme } from "./Theme";
import { AuthContextProvider } from "./auth/AuthContextProvider";
import { router } from "./router";
import { ServiceContextProvider } from "./ServiceContextProvider";

// Get the nonce for emotion/MUI
const nonce = (
  document.querySelector('meta[name="CSP-nonce"]') as HTMLMetaElement
)?.content;

const cache = createCache({
  key: `mui-emotion-prefix`,
  nonce,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      networkMode: "always", // needed for service-worker cached queries to fire
      refetchOnReconnect: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <ServiceContextProvider>
              <AuthContextProvider>
                <CssBaseline />
                <RouterProvider router={router} />
              </AuthContextProvider>
            </ServiceContextProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </CacheProvider>
  </React.StrictMode>
);
