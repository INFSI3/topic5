
document.addEventListener("DOMContentLoaded", () => {
    // /my-account
    if (window.location.pathname === "/my-account") {
      fetch("/api/user", { credentials: "include" })
        .then(res => {
          if (!res.ok) throw new Error("Not logged in");
          return res.json();
        })
        .then(data => {
          const span = document.getElementById("username");
          if (span) span.textContent = data.username;
        })
        .catch(err => {
          console.error("Error fetching user:", err);
        });
    }
  
    // /admin
    if (window.location.pathname === "/admin") {
      fetch("/api/users", { credentials: "include" })
        .then(res => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then(users => {
          const select = document.querySelector("select[name='username']");
          if (!select) return console.error("Select element not found");
          select.innerHTML = "";
          users.forEach(user => {
            const option = document.createElement("option");
            option.value = user.username;
            option.textContent = `${user.username} (${user.role})`;
            select.appendChild(option);
          });
        })
        .catch(err => {
          console.error("Error loading users", err);
        });
    }
  });
  
  



