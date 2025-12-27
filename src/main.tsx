import "@fontsource/inter/index.css";
import "@fontsource/open-sans/index.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {store} from "@redux/store.ts";
import App from "./App.tsx";
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
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>,
);
