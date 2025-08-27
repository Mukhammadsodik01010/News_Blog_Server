const express = require("express");
const cors = require("cors");
const { PORT } = require("./utils/secrets");
const ConnectDB = require("./utils/config.database");
const router = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

void ConnectDB();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/", router);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
