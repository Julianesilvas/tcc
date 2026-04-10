// ================================================
//  HAPPY BABY — script.js
//  Apenas animações e efeitos visuais.
//  Navegação entre páginas é feita pelo HTML/CSS.
// ================================================


// ===== EFEITO DE CLIQUE NOS BOTÕES =====
// Todos os elementos com classe .btn-anim ganham
// um "pulso" ao serem clicados.

document.addEventListener("DOMContentLoaded", () => {

    // --- Efeito de pulso ao clicar ---
    document.querySelectorAll(".btn-anim").forEach(el => {
        el.addEventListener("click", () => {
            el.style.transform = "scale(0.94)";
            setTimeout(() => {
                el.style.transform = "";
            }, 150);
        });
    });


    // --- Cards das babás: aparecem com fade ao carregar a página ---
    const cards = document.querySelectorAll(".baba");
    cards.forEach((card, i) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.4s ease, transform 0.4s ease";

        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 80 * i); // cada card aparece um pouco depois do anterior
    });


    // --- Botão ativo no menu: marca a página atual automaticamente ---
    const paginaAtual = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-btn").forEach(link => {
        const href = link.getAttribute("href");
        if (href === paginaAtual || (paginaAtual === "" && href === "index.html")) {
            link.classList.add("ativo");
        }
    });

});


// ===== LÓGICA DOS PERFIS (apenas mostrar/esconder dentro da baba.html) =====
// Esta parte só controla o painel de perfil DENTRO da mesma página,
// não navega entre arquivos HTML — por isso permanece no script.js.

function mostrarPerfil(id) {
    document.getElementById("listaBabas").style.display = "none";

    document.querySelectorAll(".perfil").forEach(p => {
        p.style.display = "none";
    });

    const perfil = document.getElementById(id);
    if (perfil) {
        perfil.style.display = "block";
        perfil.style.animation = "none";
        // Reinicia a animação
        requestAnimationFrame(() => {
            perfil.style.animation = "";
        });
    }
}

function voltarBabas() {
    document.querySelectorAll(".perfil").forEach(p => {
        p.style.display = "none";
    });
    document.getElementById("listaBabas").style.display = "grid";
}
