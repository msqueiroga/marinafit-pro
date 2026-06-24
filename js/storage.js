document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("assessmentForm");

if(!form) return;

form.addEventListener("submit", (e)=>{

e.preventDefault();

const dados = {

nome: document.getElementById("nome").value,

idade: document.getElementById("idade").value,

peso: document.getElementById("peso").value,

altura: document.getElementById("altura").value,

objetivo: document.getElementById("objetivo").value,

lombar: document.getElementById("lombar").checked,

joelho: document.getElementById("joelho").checked,

tornozelo: document.getElementById("tornozelo").checked

};

localStorage.setItem(
"userProfile",
JSON.stringify(dados)
);

document.getElementById("resultado").innerHTML =
"<h2>Dados salvos com sucesso ✅</h2>";

});

});