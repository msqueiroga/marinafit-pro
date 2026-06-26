document.addEventListener("DOMContentLoaded", function () {

    const welcomeCard = document.getElementById("welcomeCard");
    if (!welcomeCard) return;

    const userProfileString = localStorage.getItem("userProfile");

    if (!userProfileString) {
        welcomeCard.innerHTML = `
            <h3>Bem-vinda ao MarinaFit Pro 👋</h3>
            <p>Faça sua avaliação física para personalizar seus treinos.</p>
            <a href="avaliacao.html" style="display:inline-block;margin-top:14px;padding:10px 18px;background:linear-gradient(135deg,#7C3AED,#EC4899);border-radius:12px;font-size:13px;font-weight:600;color:white;text-decoration:none;">Começar avaliação →</a>
        `;
        return;
    }

    const u = JSON.parse(userProfileString);

    const nome     = u.nome     || "Atleta";
    const objetivo = u.objetivo || null;
    const peso     = u.peso     || null;

    welcomeCard.innerHTML = `
        <h3>Olá, ${nome} 👋</h3>
        <p>Objetivo: ${objetivo || "-"}</p>
        <p>Peso atual: ${peso || "-"} kg</p>
    `;

    const statPeso = document.getElementById("statPeso");
    const statMeta = document.getElementById("statMeta");

    if (statPeso && peso) statPeso.textContent = peso + " kg";
    if (statMeta && objetivo) {
        const abrev = { "Definição": "Def.", "Força": "Força", "Condicionamento": "Cond." };
        statMeta.textContent = abrev[objetivo] || objetivo;
    }

    const avatarEl = document.getElementById("avatarInitial");
    if (avatarEl && nome) avatarEl.textContent = nome.charAt(0).toUpperCase();

});

const fotoPerfil = localStorage.getItem("fotoPerfil");
    if (avatarEl && fotoPerfil) {
        avatarEl.innerHTML = `<img src="${fotoPerfil}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    }
