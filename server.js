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
    { username: "wiener", password: "wiener", role: "user" },
    { username: "administrator", password: "admin", role: "admin" },
    {username: "carlos", password: "carlos", role: "user"},
    {username: "khadidja", password: "0000", role: "user"},
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
//   res.sendFile(path.join(__dirname, "public", "admin.html"));
res.send(`
    <!DOCTYPE html>
    <html>
        <head>
            <title>Referer-based access control</title>
            <style>
           
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f4f8;
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
}

/* Main container and page box */
.maincontainer {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
}

.container.is-page {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 40px 30px;
  width: 100%;
  max-width: 600px;
}

/* Navigation header */
.navigation-header {
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
}

.top-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 16px;
}

.top-links a {
  color: #0056b3;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.top-links a:hover {
  color: #0056b3;
}

.top-links p {
  color: #aaa;
}

/* Form styling */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.login-form label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

/* .login-form select {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fafafa;
} */


select {
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    margin: 4px 0px;
    height: 30px;
    border: 1px solid #e6e6e6;
    padding: 4px;
    background-color: white !important;
    color: #333332;
    font-family: inherit;
    font-size: inherit;
    min-width: 120px;
    max-width: 320px;
  }
  select::-ms-expand {
    display: none;
  }
  select:hover {
    border: 1px solid #cbd0d1;
  }
  select:focus {
    border: 1px solid #0071bc;
  }

/* Buttons */
.button {
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #0056b3;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 10px;
}

.button:hover {
  background-color: #0056b3;
}

/* Footer placeholder */
.footer-wrapper {
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
  color: #aaa;
}

        </style>
        </head>
        <body>
            <script src="scripte.js"></script>
            <div theme="">
                <section class="maincontainer">
                    <div class="container is-page">
                        <header class="navigation-header">
                            <section class="top-links">
                                <a href="/">Home</a><p>|</p>
                                <a href="/admin">Admin panel</a><p>|</p>
                                <a href="/my-account">My account</a><p>|</p>
                            </section>
                        </header>
                        <header class="notification-header"></header>
                        <form style='margin-top: 1em' class='login-form' action='/admin-roles' method='GET'>
                            <label>User</label>
                            <select name='username'>
                                ${users.map(user => 
                                    `<option value='${user.username}'>
                                        ${user.username} (${user.role})
                                    </option>`
                                ).join('')}
                            </select>
                            <button class='button' name='action' value='upgrade' type='submit'> Upgrade user </button>
                            <button class='button' name='action' value='downgrade' type='submit'> Downgrade user </button>
                        </form>
                    </div>
                </section>
                <div class="footer-wrapper"></div>
            </div>
        </body>
    </html>
    `);

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

app.get("/logout", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
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
// app.get("/admin-roles", (req, res) => {
//     const { username, action } = req.query; // الحصول على اسم المستخدم والإجراء (upgrade أو downgrade)
//     const referer = req.get("Referer");
//     // if (!req.session.user || req.session.user.role !== "admin") {
//     //     return res.status(401).send("Unauthorized: Admins only.");
//     //   }
//     if (!referer || !referer.includes("/admin")) {
//       return res.status(403).send("Access denied. Invalid referer.");
//     }
//     // التحقق من وجود المستخدم في القائمة
//     const user = users.find((u) => u.username === username);

//     if (!user) {
//         return res.status(404).send("User not found.");
//     }

//     // تنفيذ الإجراء بناءً على القيمة المرسلة في الزر
//     if (action === "upgrade") {
//         // رفع مستوى المستخدم إلى "مسؤول"
//         user.role = "admin";
//         // res.send(`${username} has been upgraded to admin.`);
//         console.log(`${username} has been upgraded to admin.`);
//     } else if (action === "downgrade") {
//         // تقليص مستوى المستخدم إلى "مستخدم عادي"
//         user.role = "user";
//         // res.send(`${username} has been downgraded to user.`);
//         console.log(`${username} has been downgraded to user.`);
//     } else {
//         res.status(400).send("Invalid action.");
//     }
// });



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



app.listen(PORT, () => {
    console.log(users);
  console.log(`Server running on https://localhost:${PORT}`);
});
