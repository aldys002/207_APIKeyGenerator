// admin_dashboard.js
const BASE_URL = "http://localhost:3000";

// FIX TANPA MENGUBAH FORMAT
// Backend kamu pakenya port 3000, maka harus 3000 juga
const REAL_BASE_URL = "http://192.168.100.8:3000";


const token = localStorage.getItem("token");

// EXTRA DEBUG — tidak mengubah format, cuma nambah
console.log("DEBUG TOKEN =", token);

if (!token) {
  window.location.href = "login_admin.html";
}

const headers = {
  "Authorization": "Bearer " + token,
  "Content-Type": "application/json"
};

function handleUnauthorized(res) {
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "login_admin.html";
    return true;
  }
  return false;
}

// ======= USERS =======
async function fetchUsers() {
  try {
    const res = await fetch(`${REAL_BASE_URL}/users/all`, { headers });

    // EXTRA DEBUG — tidak ubah format
    console.log("GET /users/all status =", res.status);

    if (handleUnauthorized(res)) return;
    if (!res.ok) {
      console.error("Gagal fetch users", res.status);
      document.getElementById("usersInfo").textContent =
        "Gagal memuat daftar user.";
      return;
    }
    const users = await res.json();
    renderUsers(users);
  } catch (err) {
    console.error(err);
    document.getElementById("usersInfo").textContent =
      "Terjadi kesalahan saat memuat user.";
  }
}

function renderUsers(users) {
  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  if (!Array.isArray(users) || users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:18px;">Belum ada user</td></tr>`;
    document.getElementById("usersInfo").textContent = "";
    return;
  }

  users.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.id ?? ""}</td>
      <td>${escapeHtml(u.firstname ?? u.firstName ?? "-")}</td>
      <td>${escapeHtml(u.lastname ?? u.lastName ?? "-")}</td>
      <td>${escapeHtml(u.email ?? "-")}</td>
      <td style="text-align:right">
        <button class="action-btn" onclick="deleteUser(${u.id})">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("usersInfo").textContent = `Total: ${users.length} user`;
}

async function deleteUser(id) {
  if (!confirm("Hapus user ini?")) return;
  try {
    const res = await fetch(`${REAL_BASE_URL}/users/delete/${id}`, {
      method: "DELETE",
      headers,
    });

    if (handleUnauthorized(res)) return;
    if (!res.ok) {
      alert("Gagal menghapus user");
      return;
    }
    await fetchUsers();
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat menghapus user");
  }
}

// ======= API KEYS =======
async function fetchApiKeys() {
  try {
    const res = await fetch(`${REAL_BASE_URL}/apikey/all`, { headers });

    // EXTRA DEBUG
    console.log("DEBUG: GET /apikey/all status =", res.status);

    if (handleUnauthorized(res)) return;
    if (!res.ok) {
      console.error("Gagal fetch apikeys", res.status);
      document.getElementById("keysInfo").textContent =
        "Gagal memuat daftar API Key.";
      return;
    }

    const keys = await res.json();

    // DEBUG tambahan
    console.log("DEBUG: API Keys fetched =", keys);

    renderApiKeys(keys);
  } catch (err) {
    console.error(err);
    document.getElementById("keysInfo").textContent =
      "Terjadi kesalahan saat memuat API Key.";
  }
}

function renderApiKeys(keys) {
  const tbody = document.querySelector("#apiKeyTable tbody");
  tbody.innerHTML = "";

  if (!Array.isArray(keys) || keys.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:18px;">Belum ada API Key</td></tr>`;
    document.getElementById("keysInfo").textContent = "";
    return;
  }

  const now = new Date();

  keys.forEach((k) => {
    const id = k.id ?? k.key_id ?? "";
    const keyValue = k.key ?? k.api_key ?? k.value ?? k.token ?? "";
    const outRaw =
      k.out_date ??
      k.outDate ??
      k.expire_at ??
      k.expires_at ??
      k.expired_at ??
      null;
    const dipakai =
      k.used ?? k.dipakai ?? k.is_used ?? k.isUsed ?? k.used_by ?? false;

    let outDateStr = "-";
    let status = k.status ?? null;
    if (outRaw) {
      const outDate = new Date(outRaw);
      if (!isNaN(outDate)) {
        outDateStr = outDate.toLocaleString();
        if (status === null) {
          status = outDate > now;
        }
      }
    }
    const statusStr =
      status === true || status === "on" || status === "active" ? "on" : "off";
    const dipakaiStr =
      dipakai === true || dipakai === "true" ? "true" : "false";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${id}</td>
      <td style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">${escapeHtml(
        keyValue
      )}</td>
      <td>${statusStr}</td>
      <td>${dipakaiStr}</td>
      <td>${escapeHtml(outDateStr)}</td>
      <td style="text-align:right">
        <button class="action-btn" onclick="deleteKey(${id})">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("keysInfo").textContent = `Total: ${keys.length} API Key`;
}

async function deleteKey(id) {
  if (!confirm("Hapus API Key ini?")) return;
  try {
    const res = await fetch(`${REAL_BASE_URL}/apikey/${id}`, {
      method: "DELETE",
      headers,
    });
    if (handleUnauthorized(res)) return;
    if (!res.ok) {
      alert("Gagal menghapus API Key");
      return;
    }
    await fetchApiKeys();
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat menghapus API Key");
  }
}

// ======= LOGOUT =======
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login_admin.html";
});

function escapeHtml(unsafe) {
  if (unsafe === null || unsafe === undefined) return "";
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// initial load
fetchUsers();
fetchApiKeys();
