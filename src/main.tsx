import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";
import { Toaster } from "react-hot-toast";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Toaster
      gutter={15}
      containerStyle={{ margin: "0", zIndex: "100000" }}
      toastOptions={{
        success: {
          duration: 3000,
        },
        error: {
          duration: 5000,
        },
        style: {
          fontSize: "1.4rem",
          // padding: "1.6rem 2.4rem",
          padding: "1.6rem 1.4rem",
          maxWidth: "50rem",
          color: "var(--color-grey-700)",
          minWidth: "25rem",
        },
      }}
    />
    {/* <ReactQueryDevtools initialIsOpen={flase} /> */}
    <App />
  </QueryClientProvider>
  // </React.StrictMode>
);
