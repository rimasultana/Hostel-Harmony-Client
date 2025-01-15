import { createBrowserRouter } from "react-router";
import NotFound from "@/components/shared/NotFound";
import MainLayout from "@/layout/MainLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import Home from "@/pages/Home/Home";
import About from "@/pages/About/About";
import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import Meals from "@/pages/Meals/Meals";
import UpcomingMeals from "@/pages/UpcomingMeals/UpcomingMeals";
import AdminProfile from "@/pages/Dashboard/AdminProfile/AdminProfile";
import ManageUsers from "@/pages/Dashboard/ManageUsers/ManageUsers";
import AddMeal from "@/pages/Dashboard/AddMeal/AddMeal";
import AllMeals from "@/pages/Dashboard/AllMeals/AllMeals";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/meals",
        element: <Meals />,
      },
      {
        path: "/upcoming-meals",
        element: <UpcomingMeals />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Admin Routes
      {
        path: "admin-profile",
        element: <AdminProfile />,
      },
      {
        path: "manage-users",
        element: <ManageUsers />,
      },
      {
        path: "add-meal",
        element: <AddMeal />,
      },
      {
        path: "all-meals",
        element: <AllMeals />,
      },
      {
        path: "all-reviews",
        element: <h1>All Reviews</h1>,
      },
      {
        path: "serve-meals",
        element: <h1>Serve Meals</h1>,
      },
      {
        path: "upcoming-meals",
        element: <h1>Upcoming Meals</h1>,
      },
      // User Routes
      {
        path: "my-profile",
        element: <h1>My Profile</h1>,
      },
      {
        path: "requested-meals",
        element: <h1>Requested Meals</h1>,
      },
      {
        path: "my-reviews",
        element: <h1>My Reviews</h1>,
      },
      {
        path: "payment-history",
        element: <h1>Payment History</h1>,
      },
    ],
  },
]);

export default router;
