const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("."));
//---------------------------------------------------------------
app.listen(3000, () => {});

const rootRouter = require("./routers/rootRouter");

app.use("/api", rootRouter);

app.get("/test", (req, res) => {
  res.send("hiiiihihi");
});
