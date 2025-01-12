import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { SnackbarProvider } from "./contexts/SnackbarContext.jsx";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";
import { ClientInfoProvider } from "./contexts/ClientInfoContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { ResponsiveProvider } from "./contexts/ResponsiveContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <SnackbarProvider>
        <LoadingProvider>
          <ClientInfoProvider>
            <ResponsiveProvider>
              <UserProvider>
                <div
                  style={{
                    fontFamily:
                      '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  <App />
                </div>
              </UserProvider>
            </ResponsiveProvider>
          </ClientInfoProvider>
        </LoadingProvider>
      </SnackbarProvider>
    </StrictMode>
  </BrowserRouter>
);
