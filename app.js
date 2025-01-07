const express = require("express")
const connectDb = require("./config/db");
const user_route = require("./routes/user_route")

const app = express();

connectDb();


app.use(express.json());

app.use("/api/user", user_route);


const port = 3001;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})