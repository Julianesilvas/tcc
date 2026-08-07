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

// "Banco de dados" das babás (site estático, sem back-end).
// Se as fotos das babás estiverem em outra pasta, ajuste os caminhos abaixo.
const bancoBabas = {
    "Ana Laura": {
        foto: "imgs/AnaLaura.jpeg",
        cidade: "São Carlos - SP",
        avaliacoes: 18,
        preco: "R$ 30/hora",
        experiencia: "4 anos de experiência",
        destaques: ["Primeiros Socorros", "Recreação Infantil"]
    },
    "Mariany Ruas": {
        foto: "imgs/Mariany.jpeg",
        cidade: "Belo Horizonte - MG",
        avaliacoes: 13,
        preco: "R$ 35/hora",
        experiencia: "3 anos de experiência",
        destaques: []
    },
    "Julia Penedo": {
        foto: "imgs/Julia.jpeg",
        cidade: "Rio Branco - AC",
        avaliacoes: 21,
        preco: "R$ 40/hora",
        experiencia: "6 anos de experiência",
        destaques: []
    },
    "Heloisa Inácio": {
        foto: "imgs/Heloisa.jpeg",
        cidade: "São Gonçalo - RJ",
        avaliacoes: 29,
        preco: "R$ 45/hora",
        experiencia: "8 anos de experiência",
        destaques: []
    },
    "Juliane Santana": {
        foto: "imgs/Juliane.jpeg",
        cidade: "Feira de Santana - BA",
        avaliacoes: 34,
        preco: "R$ 42/hora",
        experiencia: "7 anos de experiência",
        destaques: []
    },
    "Caroline Aparecida": {
        foto: "imgs/Carol.jpeg",
        cidade: "Porto Alegre - RS",
        avaliacoes: 47,
        preco: "R$ 48/hora",
        experiencia: "10 anos de experiência",
        destaques: []
    },
    "Lorena Costa": {
        foto: "imgs/Lorena.jpeg",
        cidade: "Macapá - AP",
        avaliacoes: 17,
        preco: "R$ 32/hora",
        experiencia: "2 anos de experiência",
        destaques: []
    },
    "Letícia Mendes": {
        foto: "imgs/Leticia.jpeg",
        cidade: "Araraquara - SP",
        avaliacoes: 9,
        preco: "R$ 28/hora",
        experiencia: "1 ano de experiência",
        destaques: []
    },
    "Camila Santos": {
        foto: "imgs/Camila.jpeg",
        cidade: "Angra dos Reis - RJ",
        avaliacoes: null,
        preco: "Sob consulta",
        experiencia: "1 ano e 7 meses de experiência",
        destaques: []
    },
    "Cátia Fernandes": {
        foto: "imgs/Cátia.jpeg",
        cidade: "Tiradentes - MG",
        avaliacoes: null,
        preco: "Sob consulta",
        experiencia: "7 anos de experiência",
        destaques: []
    },
    "Angelica Camargo": {
        foto: "imgs/Angelica.jpeg",
        cidade: "Gramado - RS",
        avaliacoes: null,
        preco: "Sob consulta",
        experiencia: "3 anos de experiência",
        destaques: []
    },
    "Sonia Ribeiro": {
        foto: "imgs/Sonia.jpeg",
        cidade: "São Paulo - SP",
        avaliacoes: null,
        preco: "Sob consulta",
        experiencia: "4 anos de experiência",
        destaques: []
    }
};

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

    // Atualiza a barra de progresso
    document.querySelectorAll(".progresso").forEach(barra => {
        barra.classList.remove("ativa");
    });
    const barraAtual = document.querySelector(".etapa" + numero);
    if (barraAtual) {
        barraAtual.classList.add("ativa");
    }

    etapaAtual = numero;

    // Se chegou na etapa 5, monta o resumo com os dados preenchidos
    if (numero === 5) {
        preencherResumo();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function irProximaEtapa() {
    const etapa = document.getElementById("etapa" + etapaAtual);
    const camposObrigatorios = etapa.querySelectorAll("[required]");

    for (const campo of camposObrigatorios) {
        if (!campo.checkValidity()) {
            campo.reportValidity();
            return;
        }
    }

    if (etapaAtual < totalEtapas) {
        mostrarEtapa(etapaAtual + 1);
    }
}

function voltarEtapa() {
    if (etapaAtual > 1) {
        mostrarEtapa(etapaAtual - 1);
    }
}

// ===== Monta o resumo da Etapa 5 com os dados reais preenchidos =====
function preencherResumo() {

    // --- Dados da babá escolhida ---
    const nomeBaba = document.getElementById("selectBaba").value;
    const dadosBaba = bancoBabas[nomeBaba];

    if (dadosBaba) {
        document.getElementById("resumoFotoBaba").src = dadosBaba.foto;
        document.getElementById("resumoFotoBaba").alt = nomeBaba;
        document.getElementById("resumoNomeBaba").textContent = nomeBaba;
        document.getElementById("resumoCidadeBaba").textContent = dadosBaba.cidade;
        document.getElementById("resumoPrecoBaba").textContent = dadosBaba.preco;
        document.getElementById("resumoExperienciaBaba").textContent = dadosBaba.experiencia;

        document.getElementById("resumoAvaliacaoBaba").textContent =
            dadosBaba.avaliacoes ? dadosBaba.avaliacoes + " avaliações" : "Nova na plataforma";

        const listaDestaques = document.getElementById("resumoDestaquesBaba");
        listaDestaques.innerHTML = "";
        dadosBaba.destaques.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            listaDestaques.appendChild(li);
        });
    }

    // --- Dados preenchidos pelo responsável ---
    const nome = document.getElementById("nomeResponsavel").value;
    const cidade = document.getElementById("cidadeResponsavel").value;
    const estado = document.getElementById("estadoResponsavel").value;
    const qtdCriancas = document.getElementById("qtdCriancas").value;
    const idades = document.getElementById("idadesCriancas").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const periodo = document.getElementById("periodoContratacao").value;
    const duracao = document.getElementById("duracaoContratacao").value;

    const diasMarcados = Array.from(
        document.querySelectorAll('input[name="diaSemana"]:checked')
    ).map(chk => chk.value);

    // Formata a data de dd/mm/aaaa
    let dataFormatada = "-";
    if (dataInicio) {
        const [ano, mes, dia] = dataInicio.split("-");
        dataFormatada = `${dia}/${mes}/${ano}`;
    }

    document.getElementById("resumoResponsavel").textContent = nome || "-";
    document.getElementById("resumoCidade").textContent = cidade && estado ? `${cidade} - ${estado}` : "-";
    document.getElementById("resumoCriancas").textContent = qtdCriancas || "-";
    document.getElementById("resumoIdades").textContent = idades || "-";
    document.getElementById("resumoPeriodo").textContent = periodo || "-";
    document.getElementById("resumoDuracao").textContent = duracao || "-";
    document.getElementById("resumoDias").textContent = diasMarcados.length ? diasMarcados.join(", ") : "-";
    document.getElementById("resumoInicio").textContent = dataFormatada;
}

function finalizarContratacao() {
    document.querySelectorAll(".etapa").forEach(etapa => {
        etapa.style.display = "none";
    });

    const sucesso = document.getElementById("sucesso");
    if (sucesso) {
        sucesso.style.display = "flex";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
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

// ================================================
//  QUERO SER BABÁ — cadastro em 4 etapas
// ================================================

let etapaAtualBaba = 1;
const totalEtapasBaba = 4;

function mostrarEtapaBaba(numero) {
    document.querySelectorAll("#etapaB1, #etapaB2, #etapaB3, #etapaB4").forEach(etapa => {
        etapa.style.display = "none";
    });

    const etapa = document.getElementById("etapaB" + numero);
    if (etapa) {
        etapa.style.display = "block";
    }

    document.querySelectorAll(".progresso.etapaB1, .progresso.etapaB2, .progresso.etapaB3, .progresso.etapaB4")
        .forEach(barra => barra.classList.remove("ativa"));

    etapaAtualBaba = numero;

    if (numero === 4) {
        preencherResumoBaba();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function irProximaEtapaBaba() {
    const etapa = document.getElementById("etapaB" + etapaAtualBaba);
    const camposObrigatorios = etapa.querySelectorAll("[required]");

    for (const campo of camposObrigatorios) {
        if (!campo.checkValidity()) {
            campo.reportValidity();
            return;
        }
    }

    if (etapaAtualBaba < totalEtapasBaba) {
        mostrarEtapaBaba(etapaAtualBaba + 1);
    }
}

function voltarEtapaBaba() {
    if (etapaAtualBaba > 1) {
        mostrarEtapaBaba(etapaAtualBaba - 1);
    }
}

// ===== Mostra o nome do(s) arquivo(s) escolhido(s) em um input file =====
function mostrarNomeArquivo(inputId, spanId) {
    const input = document.getElementById(inputId);
    const span = document.getElementById(spanId);

    if (input.files.length === 0) {
        span.textContent = "Nenhum arquivo selecionado";
        span.classList.remove("arquivo-ok");
        return;
    }

    if (input.files.length === 1) {
        span.textContent = "✔ " + input.files[0].name;
    } else {
        span.textContent = "✔ " + input.files.length + " arquivos selecionados";
    }
    span.classList.add("arquivo-ok");
}

// ===== Máscara de CPF (000.000.000-00) =====
function aplicarMascaraCPF(input) {
    let valor = input.value.replace(/\D/g, "").slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    input.value = valor;
}

// ===== Monta o resumo da Etapa 4 =====
function preencherResumoBaba() {

    const nome = document.getElementById("nomeBaba").value;
    const cpf = document.getElementById("cpfBaba").value;
    const cidade = document.getElementById("cidadeBaba").value;
    const estado = document.getElementById("estadoBaba").value;
    const experiencia = document.getElementById("experienciaBaba").value;
    const valorHora = document.getElementById("valorHoraBaba").value;
    const periodo = document.getElementById("periodoBaba").value;

    const cursosMarcados = Array.from(
        document.querySelectorAll('input[name="cursoBaba"]:checked')
    ).map(chk => chk.value);

    const diasMarcados = Array.from(
        document.querySelectorAll('input[name="diaDisponivelBaba"]:checked')
    ).map(chk => chk.value);
    document.getElementById("resumoNomeBaba2").textContent = nome || "-";
    document.getElementById("resumoCpfBaba").textContent = cpf || "-";
    document.getElementById("resumoCidadeBaba2").textContent = cidade && estado ? `${cidade} - ${estado}` : "-";
    document.getElementById("resumoExperienciaBaba2").textContent = experiencia || "-";
    document.getElementById("resumoValorBaba").textContent = valorHora ? `R$ ${valorHora}/hora` : "-";
    document.getElementById("resumoCursosBaba").textContent = cursosMarcados.length ? cursosMarcados.join(", ") : "-";
    document.getElementById("resumoDiasBaba").textContent = diasMarcados.length ? diasMarcados.join(", ") : "-";
    document.getElementById("resumoPeriodoBaba").textContent = periodo || "-";

    // --- Status dos documentos ---
    const documentos = [
        { input: "arquivoRG", resumo: "resumoDocRG" },
        { input: "arquivoAntecedentes", resumo: "resumoDocAntecedentes" },
        { input: "arquivoCertificados", resumo: "resumoDocCertificados" },
        { input: "arquivoComprovante", resumo: "resumoDocComprovante" },
        { input: "arquivoFoto", resumo: "resumoDocFoto" }
    ];

    documentos.forEach(doc => {
        const input = document.getElementById(doc.input);
        const resumo = document.getElementById(doc.resumo);
        resumo.textContent = input.files.length > 0 ? "✔ Anexado" : "Não anexado";
    });
}

function finalizarCadastroBaba() {
    document.querySelectorAll("#etapaB1, #etapaB2, #etapaB3, #etapaB4").forEach(etapa => {
        etapa.style.display = "none";
    });

    const sucesso = document.getElementById("sucessoBaba");
    if (sucesso) {
        sucesso.style.display = "flex";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Inicializa: mostra só a etapa 1, esconde sucesso, liga a máscara de CPF
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("etapaB1")) {
        mostrarEtapaBaba(1);
    }
    const sucessoBaba = document.getElementById("sucessoBaba");
    if (sucessoBaba) {
        sucessoBaba.style.display = "none";
    }

    const campoCpf = document.getElementById("cpfBaba");
    if (campoCpf) {
        campoCpf.addEventListener("input", () => aplicarMascaraCPF(campoCpf));
    }
});