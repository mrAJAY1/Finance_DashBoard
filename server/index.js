import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import kpiRoutes from "./routes/kpi.js";
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
// import Transaction from "./models/Transaction.js";
// import KPI from "./models/KPI.js";
// import Product from "./models/Product.js";
// import { kpis, products, transactions } from "./data/data.js";

// CONFIGURATIONS
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Then use __dirname as before
app.use(express.static(path.join(__dirname, "../client", "dist")));
// ROUTES
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);

if (process.env.NODE_ENV === "production") {
  // serves static file from dist folder of client
  app.use(express.static(path.join(__dirname, "../client", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 6000;

// MONGOOSE SETUP
const { MONGO_URL } = process.env;
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    app.listen(PORT, () => console.log(`Server Listening on port ${PORT}`));
    // ADD DATA ONETIME ONLY OR AS NEEDED

    // await mongoose.connection.db.dropDatabase();
    // await KPI.insertMany(kpis);
    // await Product.insertMany(products);
    // Transaction.insertMany(transactions)
  })
  .catch((error) => console.log(`${error} did not connect`));
