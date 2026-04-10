import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import accountsRoutes from "./routes/accounts.route.js";
import transactionRoute from "./routes/transaction.route.js";
import exchangeRoute from "./routes/exchange.route.js";
import loanRoute from "./routes/loan.route.js";
import quotationRoute from "./routes/quotation.route.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/transactions", transactionRoute);
app.use("/api/exchange", exchangeRoute);
app.use("/api/loans", loanRoute);
app.use("/api/quotations", quotationRoute);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
