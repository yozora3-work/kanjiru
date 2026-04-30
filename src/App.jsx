import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy } from "react";
import store from "./store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import PageNotFound from "./pages/PageNotFound";
import Vocabulary from "./pages/vocabulary";

const Homepage = lazy(() => import("./pages/Homepage"));
const CardView = lazy(() => import("./pages/CardView"));
const ReadingPage = lazy(() => import("./pages/ReadingPage"));

const queryClient = new QueryClient({
  defautOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <Suspence></Suspence> */}
        <Toaster />
        <Routes>
          <Route index element={<Homepage />} />
          <Route
            path="cards/:learn"
            element={
              <Provider store={store}>
                <CardView actionType="learn" />
              </Provider>
            }
          />
          <Route
            path="read"
            element={
              <Provider store={store}>
                <ReadingPage />
              </Provider>
            }
          />
          <Route
            path="vocabulary"
            element={
              <Provider store={store}>
                <Vocabulary />
              </Provider>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
