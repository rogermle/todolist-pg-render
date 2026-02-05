const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
// const routes = require("./controllers");
const helpers = require("./utils/helpers");
const db = require("./config/connection");
// Import and require Pool (node-postgres)
// We'll be creating a Connection Pool. Read up on the benefits here: https://node-postgres.com/features/pooling

const PORT = process.env.PORT || 3001;
const app = express();

const hbs = exphbs.create({ helpers });

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Query database
app.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }

    const users = result.rows; // <-- pg returns rows here
    console.log(users);

    res.render("homepage", { users });
  });
});

app.get("/todo", (req, res) => {
  res.render("todo");
});

app.get("/api/weatherData", (req, res) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPENWEATHER_API_KEY}&q=London`,
  )
    .then((response) => response.json())
    .then((data) => res.render("weather", { data }))
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
