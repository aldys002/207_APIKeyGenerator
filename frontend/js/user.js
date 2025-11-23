// user.js

let currentApiKey = null;

// Tombol Generate API Key
document.getElementById("generateApiKeyBtn").addEventListener("click", async () => {
    try {
        const res = await fetch("http://localhost:3000/apikey/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        if (res.ok) {
            currentApiKey = data.apikey;
            document.getElementById("apiKeyField").value = currentApiKey;
            document.getElementById("apiKeyStatus")?.remove(); // hapus status lama jika ada
            const status = document.createElement("p");
            status.id = "apiKeyStatus";
            status.innerText = "Status: false (belum disimpan)";
            document.getElementById("userForm").appendChild(status);
        } else {
            alert("Error generating API key");
        }
    } catch (err) {
        console.error(err);
        alert("Server error saat generate API key");
    }
});

// Tombol Save User + Activate API Key
document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!currentApiKey) {
        alert("Generate API Key dulu!");
        return;
    }

    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!firstname || !lastname || !email) {
        alert("Semua field harus diisi!");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/users/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstname, lastname, email, apikey: currentApiKey })
        });

        const data = await res.json();

        if (res.status === 200 || res.status === 201) {
            document.getElementById("success").innerText = data.message || "User saved!";
            document.getElementById("error").innerText = "";

            // Reset form & API key
            document.getElementById("userForm").reset();
            document.getElementById("apiKeyField").value = "";
            document.getElementById("apiKeyStatus")?.remove();
            currentApiKey = null;
        } else {
            document.getElementById("error").innerText = data.error || "Server error";
            document.getElementById("success").innerText = "";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("error").innerText = "Server error";
        document.getElementById("success").innerText = "";
    }
});
