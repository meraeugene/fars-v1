import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { store, persistor } from "./store.ts";
import { PersistGate } from "redux-persist/integration/react";
import LazyLoader from "./components/LazyLoader.tsx";

// Lazy load your components
const Home = lazy(() => import("./pages/Home.tsx"));
const Error = lazy(() => import("./pages/Error.tsx"));

// Create a router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LazyLoader />}>
            <Home />
          </Suspense>
        ),
      },

      {
        path: "/*",
        element: (
          <Suspense fallback={<LazyLoader />}>
            <Error />
          </Suspense>
        ),
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement as Element)?.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
