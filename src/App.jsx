import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Login = lazy(() => import("./pages/auth/login"));
const ForgotPass = lazy(() => import("./pages/auth/forgot-password"));
const Error = lazy(() => import("./pages/404"));

const ServicesPage = lazy(() => import("./pages/app/ServicesPage"));
const UserProfile = lazy(() => import("./pages/app/Profile"));
const AdminDashbord = lazy(() => import("./pages/app/Dashboard"));
const UsersPage = lazy(() => import("./pages/app/UsersPage"));
const PaymentPage = lazy(() => import("./pages/app/Payments"));
const ReservationsPage = lazy(() => import("./pages/app/ReservationsPage"));

// middelwares
import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";

import Loading from "@/components/Loading";

function App() {
  return (
    <main className="App  relative">
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPass />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<AdminDashbord />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="paiments" element={<PaymentPage />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        <Route
          path="/*"
          element={
            <Suspense fallback={<Loading />}>
              <Error />
            </Suspense>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
