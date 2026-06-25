document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("assessmentForm");
    if (!form) return;

    const saved = localStorage.getItem("userProfile");
    if (saved) {
        const u = JSON.parse(saved);
        const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
        const check = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };

        set("nome", u.nome);
        set("idade", u.idade);
        set("peso", u.peso);
        set("altura", u.altura);
        set("objetivo", u.objetivo);
        check("lombar", u.lombar);
        check("joelho", u.joelho);
        check("tornozelo", u.tornozelo);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const dados = {
            nome:      document.getElementById("nome").value.trim(),
            idade:     document.getElementById("idade").value,
            peso:      document.getElementById("peso").value,
            altura:    document.getElementById("altura").value,
            objetivo:  document.getElementById("objetivo").value,
            lombar:    document.getElementById("lombar").checked,
            joelho:    document.getElementById("joelho").checked,
            tornozelo: document.getElementById("tornozelo").checked
        };

        localStorage.setItem("userProfile", JSON.stringify(dados));

        const resultado = document.getElementById("resultado");
        resultado.innerHTML = "✅ Dados salvos com sucesso!";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);
    });

});
