document.getElementById("adminRegisterForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/admin/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById("success").innerText = data.message;
            document.getElementById("error").innerText = "";
        } else {
            document.getElementById("error").innerText = data.error;
        }
    } catch (err) {
        console.error(err);
        document.getElementById("error").innerText = "Server error";
    }
});
