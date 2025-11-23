document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://192.168.40.200:3000/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("admin_id", data.admin_id);
            window.location.href = "dashboard_admin.html";
        } else {
            document.getElementById("error").innerText = data.error;
        }
    } catch (err) {
        console.error(err);
        document.getElementById("error").innerText = "Server error";
    }
});
