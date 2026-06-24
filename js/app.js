document.addEventListener("DOMContentLoaded", function () {

    const welcomeCard = document.getElementById("welcomeCard");

    if (!welcomeCard) {
        console.log("welcomeCard não encontrado");
        return;
    }

    const userProfileString = localStorage.getItem("userProfile");

    if (!userProfileString) {

        welcomeCard.innerHTML = `
            <div class="profile-summary">
                <h3>Bem-vinda ao MarinaFit Pro 👋</h3>
                <p>Faça sua avaliação física para personalizar seus treinos.</p>
            </div>
        `;

        return;
    }

    const userData = JSON.parse(userProfileString);

    welcomeCard.innerHTML = `
        <div class="profile-summary">
            <h3>Olá, ${userData.nome || "Atleta"} 👋</h3>
            <p>Objetivo: ${userData.objetivo || "-"}</p>
            <p>Peso atual: ${userData.peso || "-"} kg</p>
        </div>
    `;

});