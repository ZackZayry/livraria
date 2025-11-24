const app = require("./config/express");
const routes = require("./routes");
const db = require("./database/sqlite");
db.init();
const errorHandler = require("./middleware/errorHandler");

app.use("/api", routes);
app.use(errorHandler);
app.use((req, res)=>{
    res.status(404).json({ erro:"Endpoint não encontrado"})
});

module.exports =app;