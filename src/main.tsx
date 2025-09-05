import "@fontsource/inter/index.css";
import "@fontsource/open-sans/index.css";
import store from "@redux/store.ts";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import App from "./App.tsx";
// import "./i18n";
import "./styles/main.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
