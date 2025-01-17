import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { SnackbarProvider } from "./contexts/SnackbarContext.jsx";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";
import { ClientInfoProvider } from "./contexts/ClientInfoContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { ResponsiveProvider } from "./contexts/ResponsiveContext.jsx";
import { FriendProvider } from "./contexts/FriendContext.jsx";
import { ChatProvider } from "./contexts/ChatContext.jsx";
import { SocketProvider } from "./contexts/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <SnackbarProvider>
        <LoadingProvider>
          <ClientInfoProvider>
            <SocketProvider>
              <ResponsiveProvider>
                <UserProvider>
                  <FriendProvider>
                    <ChatProvider>
                      <div
                        style={{
                          fontFamily:
                            '"DM Sans", "Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        <App />
                      </div>
                    </ChatProvider>
                  </FriendProvider>
                </UserProvider>
              </ResponsiveProvider>
            </SocketProvider>
          </ClientInfoProvider>
        </LoadingProvider>
      </SnackbarProvider>
    </StrictMode>
  </BrowserRouter>
);
