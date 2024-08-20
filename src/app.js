// var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
var cors = require("cors");
const compression = require("compression");
require("dotenv").config();

const useragent = require("express-useragent");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");
const domainRoute = require("./routes/whiteLabelRoute");
const connectDb = require("./models/db");
const documentRoute = require("./routes/documentRoute");
const bankRoute = require("./routes/BankingDetailsRoute");
const businessRoute = require("./routes/BusinessDetailsRoute");
const categoryRoute = require("./routes/categoryRoute");
const appRoute = require("./routes/appRoute");
const merchantAppRequestRoute = require("./routes/merchantAppRequestRoute");
const merchantAppsModeRoute = require("./routes/merchantAppModeRoute");
const transactionRoute = require("./routes/transactionRoute");
const settlementRoute = require("./routes/settlementRoute");
const reportsRoute = require("./routes/reportsRoute");
const payLinkRoute = require("./routes/payLinkRoute");
const orderRoute = require("./routes/orderRoute");

const PayinChargebackRoute = require("./routes/payin/chargebackRoute");
// const liveCasesRoute = require("./routes/liveCasesRoute");
// const liveApiKeysRoute = require("./routes/liveApikeysRoute");
// const liveWebhook = require("./routes/liveWebhookRoute");
// const liveWhiteList = require("./routes/liveWhitelistRoute");
// const { verifyToken } = require("./middleware/authorization");
const session = require("express-session");
// reseller-operation
const resellerRoute = require("./reseller/resellerRoute");

// RESELLER ADMIN OPERATION
const resellerAdminRoute = require("./resellerAdmin/resellerAdminRoute");

const payOutwebhookRoute = require("./routes/payout/webhookRoute");
const payInwebhookRoute = require("./routes/payin/webhookRoute");
const payInApiKeyRoute = require("./routes/payin/apiKeyRoute");
const payOutApiKeyRoute = require("./routes/payout/apiKeyRoute");

const payInWhitelistRoute = require("./routes/payin/whiteListRoute");
const payOutWhitelistRoute = require("./routes/payout/whiteListRoute");

const payInSettlementRoute = require("./routes/payin/settlementRoute");
const payInTransactionRoute = require("./routes/payin/transactionRoute");
const payOutTransactionRoute = require("./routes/payout/transactionRoute");

const payOutBeneficiaryRoute = require("./routes/payout/beneficiaryRoute");
const payOutAccountRoute = require("./routes/payout/accountRoute");
const payOutFundStatementRoute = require("./routes/payout/fundStatementRoute");

const payInCasesRoute = require("./routes/payin/casesRoute");

const RefundRoute = require("./routes/payin/refundRoute");

const loginActivity = require("./routes/loginActivityRoute");
const fileUploadRouter = require("./routes/fileUploadRoute");
const payInOrderRoute = require("./routes/payin/orderRoute");

// MERCHANT ONBOARD BYSELF
const merchantSelfOnboardRoute = require("./routes/onboardRoute");
const AdminRouter = require("./superAdmin/adminRoute");

connectDb();
var app = express();

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Allow requests from multiple frontend URLs
const allowedOrigins = [
  "http://localhost:3000/axonaio",
  "http://localhost:3000",
  // Add more frontend URLs as needed
];
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the list of allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Enable credentials (e.g., cookies, authentication headers)
};
app.use(useragent.express());
//configuring session middleware
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cors(corsOptions));
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use("/", indexRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/domain", domainRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/apps", appRoute);
app.use("/api/v1/merchantapprequest", merchantAppRequestRoute);
app.use("/api/v1/merchantappsmode", merchantAppsModeRoute);
app.use("/api/v1/transaction", transactionRoute);
app.use("/api/v1/settlement", settlementRoute);
app.use("/api/v1/reports", reportsRoute);
app.use("/api/v1/paylink", payLinkRoute);
app.use("/api/v1/order", orderRoute);

app.use("/api/v1/loginactivity", loginActivity);

// -------------------------------------------

// -----------------------------------------
app.use("/api/v1/payinchargeback", PayinChargebackRoute);
app.use("/api/v1/fileupload", fileUploadRouter);
app.use("/api/v1/inapikeys", payInApiKeyRoute);
app.use("/api/v1/outapikeys", payOutApiKeyRoute);
app.use("/api/v1/outwebhook", payOutwebhookRoute);
app.use("/api/v1/inwebhook", payInwebhookRoute);
app.use("/api/v1/inwhitelist", payInWhitelistRoute);
app.use("/api/v1/outwhitelist", payOutWhitelistRoute);
app.use("/api/v1/insettlement", payInSettlementRoute);

app.use("/api/v1/payinorder", payInOrderRoute);
app.use("/api/v1/payintransaction", payInTransactionRoute);
app.use("/api/v1/payinsettlement", payInSettlementRoute);
app.use("/api/v1/payincase", payInCasesRoute);

app.use("/api/v1/payinrefund", RefundRoute);

app.use("/api/v1/payouttransfer", payOutTransactionRoute);
app.use("/api/v1/payoutbeneficiary", payOutBeneficiaryRoute);
app.use("/api/v1/payoutaccount", payOutAccountRoute);
app.use("/api/v1/payoutfundstatement", payOutFundStatementRoute);

app.use("/api/v1/merchantbyself/onboard", merchantSelfOnboardRoute);

// reseller-operation
app.use("/api/v1/reseller/merchants", resellerRoute);

// RESELLER-ADMIN-OPERATION
app.use("/api/v1/radmin", resellerAdminRoute);

/* -------------------------------------------------------------------------- */
/*                                 Admin                                  */
/* -----------------------------------------------------    ------------- */
app.use("/api/v1/admin", AdminRouter);
/* -------------------------------------------------------------------------- */

// app.use("/api/v1/merchant/payout", PayOutRouter);

if (process.env.NODE_ENV === "development") {
  // configure the application for development
  app.use(morgan("dev"));
} else {
  // configure the application for production
  app.use(compression());
}

module.exports = app;
