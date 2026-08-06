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

// ================================================
//  CONTRATAR — navegação entre etapas do formulário
// ================================================

let etapaAtual = 1;
const totalEtapas = 5;

function mostrarEtapa(numero) {
    // Esconde todas as etapas
    document.querySelectorAll(".etapa").forEach(etapa => {
        etapa.style.display = "none";
    });

    // Mostra só a etapa pedida
    const etapa = document.getElementById("etapa" + numero);
    if (etapa) {
        etapa.style.display = "block";
    }

    // Atualiza a barra de progresso (vamos estilizar no próximo passo)
    document.querySelectorAll(".progresso").forEach(barra => {
        barra.classList.remove("ativa");
    });
    const barraAtual = document.querySelector(".etapa" + numero);
    if (barraAtual) {
        barraAtual.classList.add("ativa");
    }

    etapaAtual = numero;

    // Sobe a página pro topo ao trocar de etapa
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function irProximaEtapa() {
    const etapa = document.getElementById("etapa" + etapaAtual);
    const camposObrigatorios = etapa.querySelectorAll("[required]");

    // Verifica se todos os campos obrigatórios da etapa atual estão preenchidos
    for (const campo of camposObrigatorios) {
        if (!campo.checkValidity()) {
            campo.reportValidity(); // mostra a mensagem padrão do navegador
            return; // impede de avançar
        }
    }

    if (etapaAtual < totalEtapas) {
        mostrarEtapa(etapaAtual + 1);
    } else {
        finalizarContratacao();
    }
}

function voltarEtapa() {
    if (etapaAtual > 1) {
        mostrarEtapa(etapaAtual - 1);
    }
}

// Inicializa mostrando só a etapa 1 e escondendo a tela de sucesso
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("etapa1")) {
        mostrarEtapa(1);
    }
    const sucesso = document.getElementById("sucesso");
    if (sucesso) {
        sucesso.style.display = "none";
    }
});