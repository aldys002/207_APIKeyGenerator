const API_URL = "http://localhost:3000"; // backend kamu

// -------------------------
// Generate API Key
// -------------------------
async function generateKey() {
    try {
        const res = await fetch(`${API_URL}/users/generate-api`);
        const data = await res.json();

        if (data.key) {
            document.getElementById("apikey").value = data.key;
            alert("API Key berhasil dibuat!");
        } else {
            alert("Gagal generate API key");
        }
    } catch (err) {
        alert("Error: " + err.message);
    }
}

// -------------------------
// SAVE USER + CONNECT API KEY
// -------------------------
async function saveUser() {
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const key = document.getElementById("apikey").value;

    if (!firstname || !lastname || !email || !key) {
        alert("Lengkapi semua field dan generate API key!");
        return;
    }

    const body = { firstname, lastname, email, key };

    try {
        const res = await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (data.success) {
            alert("User + API Key berhasil disimpan!");
            document.getElementById("firstname").value = "";
            document.getElementById("lastname").value = "";
            document.getElementById("email").value = "";
            document.getElementById("apikey").value = "";
        } else {
            alert("Gagal menyimpan: " + data.error);
        }
    } catch (err) {
        alert("Error: " + err.message);
    }
}
