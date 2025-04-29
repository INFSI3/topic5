import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
dotenv.config();

const app = express();
const PORT = 3000;

const users = [
    { username: "wiener", password: "peter", role: "user" },
    { username: "administrator", password: "admin", role: "admin" },
    {username: "carlos", password: "carlos", role: "user"},
    {username: "khadidja", password: "0000", role: "user"},
    {username: "ahmed", password: "0000", role: "user"},
];

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "veryweaksecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
    },
  })
);

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/login", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/admin", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/api/users", (_, res) => {
    res.json(users); 
  });

app.get("/my-account1", (_, res) => {
    res.sendFile(path.join(__dirname, "public", "normal.html"));
  });

app.get("/my-account", (req, res) => {
  const username = req.query.id;

  if (!username) {
    return res.sendFile(path.join(__dirname, "public", "account.html"));
  }
 
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(404).send("User not found.");
  }

  if (user.role === "admin") {
    return res.sendFile(path.join(__dirname, "public", "account.html"));
  }
 
  return res.sendFile(path.join(__dirname, "public", "normal.html"));
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  console.log("Received data: ", req.body); 
  
 
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

 
  req.session.user = {
    username: user.username,
    role: user.role,
  };

  
  res.redirect(`/my-account?id=${encodeURIComponent(user.username)}`);
});

app.get("/admin-roles", (req, res) => {
    const { username, action } = req.query; 
    const referer = req.get("Referer");

    if (!referer || !referer.includes("/admin")) {
      return res.status(403).send("Access denied. Invalid referer.");
    }

   
    const user = users.find((u) => u.username === username);

    if (!user) {
        return res.status(404).send("User not found.");
    }

   
    if (action === "upgrade") {
       
        user.role = "admin";
        console.log(`${username} has been upgraded to admin.`);
    } else if (action === "downgrade") {
       
        user.role = "user";
        console.log(`${username} has been downgraded to user.`);
    } else {
        return res.status(400).send("Invalid action.");
    }

   
    console.log(users);

    
    res.redirect("/admin");
});

app.get("/api/user", (req, res) => {
    if (req.session.user) {
      res.json({ username: req.session.user.username });
    } else {
      res.status(401).json({ error: "Not logged in" });
    }
  });

  
  


app.listen(PORT, () => {
    console.log(users);
  console.log(`Server running on https://localhost:${PORT}`);
});
