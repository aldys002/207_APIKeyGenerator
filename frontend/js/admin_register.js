const API_ADMIN = "http://localhost:3000";

async function adminRegister() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_ADMIN}/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
        alert("Admin berhasil diregister!");
        window.location.href = "login_admin.html";
    } else {
        alert("Gagal: " + data.error);
    }
}
