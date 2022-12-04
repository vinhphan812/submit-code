// environment config from .env
require("dotenv").config();

//require all model
require("./models");

// import modules
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const favicon = require("serve-favicon");

const { errorMiddleware } = require("./middlewares/error.middleware");

// import route
const indexRoute = require("./routes/index.route");
// import middleware
const { morganConfig } = require("./utils/constaints");

// import config
const { initDatabase } = require("./configs/config");

const { seoConfigMiddleware } = require("./middlewares/seo.middleware");

const { SECRET_KEY } = process.env;

// get PORT
const PORT = process.env.port || 3010;

// init app
const app = express();

initDatabase();

// use cookies
app.use(cookieParser(SECRET_KEY));

// use middleware
app.use(morgan(morganConfig));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(favicon("./public/images/coding.png"));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));

app.use(seoConfigMiddleware);

// use route
app.use(indexRoute);

app.use(errorMiddleware);

app.listen(PORT, () => {
	console.log(`server run in port ${PORT}`);
});
