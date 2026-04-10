// ===== NAVEGAÇÃO ENTRE PÁGINAS =====

function mostrarInicio() {
    document.getElementById("inicio").style.display = "block";
    document.getElementById("babas").style.display = "none";
    document.getElementById("contato").style.display = "none";
}

function mostrarBabas() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("babas").style.display = "block";
    document.getElementById("contato").style.display = "none";
}

function mostrarContato() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("babas").style.display = "none";
    document.getElementById("contato").style.display = "block";
}

// ===== BOTÃO ATIVO (SEM QUEBRAR COR) =====

function ativarBotao(botao) {
    let botoes = document.querySelectorAll("nav button");

    botoes.forEach(btn => {
        btn.classList.remove("ativo");
    });

    botao.classList.add("ativo");
}

// ===== PERFIL DAS BABÁS =====

function mostrarPerfil(id) {
    document.getElementById("listaBabas").style.display = "none";

    let perfis = document.querySelectorAll(".perfil");
    perfis.forEach(p => p.style.display = "none");

    document.getElementById(id).style.display = "block";
}

function voltarBabas() {
    document.getElementById("listaBabas").style.display = "flex";

    let perfis = document.querySelectorAll(".perfil");
    perfis.forEach(p => p.style.display = "none");
}