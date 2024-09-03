import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { GamePage } from "./pages/game";
import { CollisionPage } from "./pages/collision";

const router = createBrowserRouter([
  {
    path: "/game",
    element: <GamePage />,
  },
  {
    path: "/collision",
    element: <CollisionPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
