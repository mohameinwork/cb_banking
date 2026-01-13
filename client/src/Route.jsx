import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import MyAccountsPage from "./pages/AccountsPage";
import ExchangePage from "./pages/ExchangePage";
import TransactionPage from "./pages/TransactionPage";
import LoansPage from "./pages/LoanPage";
import ReportPage from "./pages/ReportPage";
import QuotationPage from "./pages/QuotationPage";
import UsersPage from "./pages/UsersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "transactions",
        element: <TransactionPage />,
      },
      {
        path: "accounts",
        element: <MyAccountsPage />,
      },
      {
        path: "exchange",
        element: <ExchangePage />,
      },
      {
        path: "quotations",
        element: <QuotationPage />,
      },
      {
        path: "loans",
        element: <LoansPage />,
      },
      {
        path: "reports",
        element: <ReportPage />,
      },
    ],
  },
]);
