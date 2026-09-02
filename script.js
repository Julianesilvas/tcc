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

    criarAreaConta();

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

let perguntaAtual = 1;
const totalPerguntas = 31;
const perguntaEscolhaBaba = 26;
const perguntaRevisao = 31;

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

function mostrarPergunta(numero) {
    // Só roda na página de contratar (que tem o wizard de perguntas)
    if (!document.getElementById("pergunta1")) return;

    // Esconde todas as perguntas
    document.querySelectorAll(".pergunta").forEach(pergunta => {
        pergunta.style.display = "none";
    });

    // Mostra só a pergunta pedida
    const pergunta = document.getElementById("pergunta" + numero);
    if (pergunta) {
        pergunta.style.display = "block";
    }

    // Atualiza a barra de progresso (uma barra única, percentual)
    const barra = document.getElementById("barraProgressoContratar");
    const texto = document.getElementById("progressoTextoContratar");
    if (barra) {
        barra.style.width = Math.round((numero / totalPerguntas) * 100) + "%";
    }
    if (texto) {
        texto.textContent = `Pergunta ${numero} de ${totalPerguntas}`;
    }

    perguntaAtual = numero;

    // Ao chegar na revisão final, monta o resumo com os dados preenchidos
    if (numero === perguntaRevisao) {
        preencherResumo();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function proximaPergunta() {
    const pergunta = document.getElementById("pergunta" + perguntaAtual);
    const camposObrigatorios = pergunta.querySelectorAll("[required]");

    for (const campo of camposObrigatorios) {
        if (!campo.checkValidity()) {
            campo.reportValidity();
            return;
        }
    }

    // Checagem extra: na pergunta de escolha da babá, precisa ter selecionado alguém no grid
    if (perguntaAtual === perguntaEscolhaBaba && !document.getElementById("selectBaba").value) {
        document.getElementById("avisoSelecaoBaba").style.display = "block";
        document.getElementById("gridSelecaoBaba").scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    if (perguntaAtual < totalPerguntas) {
        mostrarPergunta(perguntaAtual + 1);
    }
}

function voltarPergunta() {
    if (perguntaAtual > 1) {
        mostrarPergunta(perguntaAtual - 1);
    }
}

// ===== Gera os cards de seleção da babá (Etapa 4) =====
function renderizarGridBabas() {
    const grid = document.getElementById("gridSelecaoBaba");
    if (!grid) return; // só roda na contratar.html

    grid.innerHTML = "";

    Object.keys(bancoBabas).forEach(nome => {
        const dados = bancoBabas[nome];

        const card = document.createElement("div");
        card.className = "card-selecao-baba";
        card.setAttribute("data-nome", nome);

        card.innerHTML = `
            <img src="${dados.foto}" alt="${nome}">
            <div class="card-selecao-info">
                <h4>${nome}</h4>
                <p>${dados.cidade}</p>
                <p>${dados.preco}</p>
            </div>
            <span class="selo-selecionada">✓</span>
        `;

        card.addEventListener("click", () => selecionarBaba(nome));
        grid.appendChild(card);
    });
}

// ===== Marca a babá escolhida =====
function selecionarBaba(nome) {
    document.getElementById("selectBaba").value = nome;

    document.querySelectorAll(".card-selecao-baba").forEach(card => {
        card.classList.toggle("selecionada", card.getAttribute("data-nome") === nome);
    });

    document.getElementById("avisoSelecaoBaba").style.display = "none";
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
    const revisao = document.getElementById("pergunta" + perguntaRevisao);
    const camposObrigatorios = revisao.querySelectorAll("[required]");
    for (const campo of camposObrigatorios) {
        if (!campo.checkValidity()) {
            campo.reportValidity();
            return;
        }
    }

    document.querySelectorAll(".pergunta").forEach(pergunta => {
        pergunta.style.display = "none";
    });

    const progresso = document.querySelector(".progresso-perguntas");
    if (progresso) {
        progresso.style.display = "none";
    }

    const sucesso = document.getElementById("sucesso");
    if (sucesso) {
        sucesso.style.display = "flex";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Inicializa mostrando só a primeira pergunta e escondendo a tela de sucesso
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("pergunta1")) {
        mostrarPergunta(1);
    }
    const sucesso = document.getElementById("sucesso");
    if (sucesso) {
        sucesso.style.display = "none";
    }
    renderizarGridBabas();
});

// ================================================
//  QUERO SER BABÁ — 19 perguntas + revisão (uma por vez)
// ================================================

let perguntaAtualBaba = 1;
const totalPerguntasBaba = 20;
const perguntaRevisaoBaba = 20;
let modoEdicaoBaba = false;

function mostrarPerguntaBaba(numero) {
    if (!document.getElementById("perguntaBaba1")) return; // só roda na quero-ser-baba.html

    document.querySelectorAll("#wizardBaba .pergunta").forEach(pergunta => {
        pergunta.style.display = "none";
    });

    const pergunta = document.getElementById("perguntaBaba" + numero);
    if (pergunta) {
        pergunta.style.display = "block";
    }

    const barra = document.getElementById("barraProgressoBaba");
    const texto = document.getElementById("progressoTextoBaba");
    if (barra) {
        barra.style.width = Math.round((numero / totalPerguntasBaba) * 100) + "%";
    }
    if (texto) {
        texto.textContent = `Pergunta ${numero} de ${totalPerguntasBaba}`;
    }

    perguntaAtualBaba = numero;

    if (numero === perguntaRevisaoBaba) {
        preencherResumoBaba();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function proximaPerguntaBaba() {
    const pergunta = document.getElementById("perguntaBaba" + perguntaAtualBaba);
    const camposObrigatorios = pergunta.querySelectorAll("[required]");

    for (const campo of camposObrigatorios) {
        if (!campo.checkValidity()) {
            campo.reportValidity();
            return;
        }
    }

    // Se veio de um lápis de edição no resumo, volta direto pra revisão
    if (modoEdicaoBaba) {
        modoEdicaoBaba = false;
        mostrarPerguntaBaba(perguntaRevisaoBaba);
        return;
    }

    if (perguntaAtualBaba < totalPerguntasBaba) {
        mostrarPerguntaBaba(perguntaAtualBaba + 1);
    }
}

function voltarPerguntaBaba() {
    if (perguntaAtualBaba > 1) {
        mostrarPerguntaBaba(perguntaAtualBaba - 1);
    }
}

// Usado pelos lápis (✎) no resumo final, pra pular direto pra pergunta certa
function irParaPerguntaBaba(numero) {
    modoEdicaoBaba = true;
    mostrarPerguntaBaba(numero);
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

    // --- Dias e períodos marcados na tabela de disponibilidade ---
    const nomesDias = {
        segunda: "Segunda", terca: "Terça", quarta: "Quarta",
        quinta: "Quinta", sexta: "Sexta", sabado: "Sábado", domingo: "Domingo"
    };
    const nomesPeriodos = { manha: "Manhã", tarde: "Tarde", noite: "Noite" };

    const disponibilidadeMarcada = [];
    document.querySelectorAll('.tabela-disponibilidade input[type="checkbox"]:checked').forEach(chk => {
        const [dia, periodo] = chk.name.split("_");
        disponibilidadeMarcada.push(`${nomesDias[dia]} (${nomesPeriodos[periodo]})`);
    });

    document.getElementById("resumoNomeBaba2").textContent = nome || "-";
    document.getElementById("resumoCpfBaba").textContent = cpf || "-";
    document.getElementById("resumoCidadeBaba2").textContent = cidade && estado ? `${cidade} - ${estado}` : "-";
    document.getElementById("resumoExperienciaBaba2").textContent = experiencia || "-";
    document.getElementById("resumoValorBaba").textContent = valorHora ? `R$ ${valorHora}/hora` : "-";
    document.getElementById("resumoCursosBaba").textContent = cursosMarcados.length ? cursosMarcados.join(", ") : "-";
    document.getElementById("resumoDiasBaba").textContent = disponibilidadeMarcada.length ? disponibilidadeMarcada.join(", ") : "-";
    document.getElementById("resumoPeriodoBaba").textContent = periodo || "-";

    // --- Status dos documentos ---
    const documentos = [
        { input: "arquivoRG", resumo: "resumoDocRG" },
        { input: "arquivoAntecedenteEstadual", resumo: "resumoDocAntecedenteEst" },
        { input: "arquivoAntecedenteFederal", resumo: "resumoDocAntecedenteF" },
        { input: "arquivoCertificados", resumo: "resumoDocCertificados" },
        { input: "arquivoComprovante", resumo: "resumoDocComprovante" },
        { input: "arquivoFoto", resumo: "resumoDocFoto" }
    ];

    documentos.forEach(doc => {
        const input = document.getElementById(doc.input);
        const resumo = document.getElementById(doc.resumo);
        if (input && resumo) {
            resumo.textContent = input.files.length > 0 ? "✔ Anexado" : "Não anexado";
        }
    });
}

function finalizarCadastroBaba() {
    const revisao = document.getElementById("perguntaBaba" + perguntaRevisaoBaba);
    const camposObrigatorios = revisao.querySelectorAll("[required]");
    for (const campo of camposObrigatorios) {
        if (!campo.checkValidity()) {
            campo.reportValidity();
            return;
        }
    }

    document.querySelectorAll("#wizardBaba .pergunta").forEach(pergunta => {
        pergunta.style.display = "none";
    });

    const progresso = document.querySelector(".progresso-perguntas");
    if (progresso) {
        progresso.style.display = "none";
    }

    const sucesso = document.getElementById("sucessoBaba");
    if (sucesso) {
        sucesso.style.display = "flex";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== Máscara de CEP (00000-000) =====
function aplicarMascaraCEP(input) {
    let valor = input.value.replace(/\D/g, "").slice(0, 8);
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    input.value = valor;
}

// ===== Máscara de telefone ((00) 00000-0000) =====
function aplicarMascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, "").slice(0, 11);
    if (valor.length > 10) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    } else if (valor.length > 5) {
        valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    }
    input.value = valor.replace(/-$/, "").replace(/\)\s$/, ") ");
}

// Inicializa: mostra só a primeira pergunta e esconde a tela de sucesso
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("perguntaBaba1")) {
        mostrarPerguntaBaba(1);
    }
    const sucessoBaba = document.getElementById("sucessoBaba");
    if (sucessoBaba) {
        sucessoBaba.style.display = "none";
    }
});

// ================================================
//  LOGIN SIMULADO (sem banco de dados — usa localStorage)
// ================================================

function obterUsuarios() {
    return JSON.parse(localStorage.getItem("happyBabyUsuarios") || "[]");
}

function salvarUsuarios(lista) {
    localStorage.setItem("happyBabyUsuarios", JSON.stringify(lista));
}

function obterUsuarioLogado() {
    const dados = localStorage.getItem("happyBabyUsuarioLogado");
    return dados ? JSON.parse(dados) : null;
}

// Cria a área de "Entrar / Cadastre-se" dentro do <nav>
function criarAreaConta() {
    const nav = document.querySelector("nav");
    if (!nav || document.getElementById("areaConta")) return;

    const area = document.createElement("div");
    area.id = "areaConta";
    area.className = "area-conta";
    nav.appendChild(area);

    atualizarAreaConta();
}

// Atualiza os botões conforme o usuário está logado ou não
function atualizarAreaConta() {
    const area = document.getElementById("areaConta");
    if (!area) return;

    const usuario = obterUsuarioLogado();

    if (usuario) {
        area.innerHTML = `
            <span class="conta-saudacao">Olá, ${usuario.nome.split(" ")[0]}</span>
            <button type="button" class="conta-btn conta-btn-sair" onclick="fazerLogout()">Sair</button>
        `;
    } else {
        area.innerHTML = `
            <button type="button" class="conta-btn" onclick="abrirModalConta('entrar')">Entrar</button>
            <button type="button" class="conta-btn conta-btn-cadastro" onclick="abrirModalConta('cadastro')">Cadastre-se</button>
        `;
    }
}

// Cria o modal (só uma vez) e injeta no final do <body>
function criarModalConta() {
    if (document.getElementById("modalConta")) return;

    const modal = document.createElement("div");
    modal.id = "modalConta";
    modal.className = "modal-conta-overlay";
    modal.style.display = "none";

    modal.innerHTML = `
        <div class="modal-conta-caixa">

            <button type="button" class="modal-conta-fechar" onclick="fecharModalConta()">×</button>

            <div id="formEntrar" class="modal-conta-form">
                <h2>Entrar</h2>
                <input type="email" id="loginEmail" placeholder="E-mail" required>
                <input type="password" id="loginSenha" placeholder="Senha" required>
                <p class="modal-conta-erro" id="erroLogin"></p>
                <button type="button" class="btn-contratar" onclick="fazerLogin()">Entrar</button>
                <p class="modal-conta-troca">
                    Não tem conta? <a href="#" onclick="alternarModoConta('cadastro'); return false;">Cadastre-se</a>
                </p>
            </div>

            <div id="formCadastro" class="modal-conta-form" style="display:none;">
                <h2>Criar conta</h2>
                <input type="text" id="cadastroNome" placeholder="Nome completo" required>
                <input type="email" id="cadastroEmail" placeholder="E-mail" required>
                <input type="password" id="cadastroSenha" placeholder="Senha" required>
                <p class="modal-conta-erro" id="erroCadastro"></p>
                <button type="button" class="btn-contratar" onclick="fazerCadastro()">Criar conta</button>
                <p class="modal-conta-troca">
                    Já tem conta? <a href="#" onclick="alternarModoConta('entrar'); return false;">Entrar</a>
                </p>
            </div>

        </div>
    `;

    document.body.appendChild(modal);

    // Fecha ao clicar fora da caixinha
    modal.addEventListener("click", (e) => {
        if (e.target === modal) fecharModalConta();
    });
}

function abrirModalConta(modo) {
    criarModalConta();
    document.getElementById("modalConta").style.display = "flex";
    alternarModoConta(modo);
}

function fecharModalConta() {
    const modal = document.getElementById("modalConta");
    if (modal) modal.style.display = "none";
}

function alternarModoConta(modo) {
    document.getElementById("formEntrar").style.display = modo === "entrar" ? "block" : "none";
    document.getElementById("formCadastro").style.display = modo === "cadastro" ? "block" : "none";
    document.getElementById("erroLogin").textContent = "";
    document.getElementById("erroCadastro").textContent = "";
}

function fazerLogin() {
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const senha = document.getElementById("loginSenha").value;
    const erro = document.getElementById("erroLogin");

    if (!email || !senha) {
        erro.textContent = "Preencha e-mail e senha.";
        return;
    }

    const usuarios = obterUsuarios();
    const encontrado = usuarios.find(u => u.email === email && u.senha === senha);

    if (!encontrado) {
        erro.textContent = "E-mail ou senha incorretos.";
        return;
    }

    localStorage.setItem("happyBabyUsuarioLogado", JSON.stringify({ nome: encontrado.nome, email: encontrado.email }));
    fecharModalConta();
    atualizarAreaConta();
}

function fazerCadastro() {
    const nome = document.getElementById("cadastroNome").value.trim();
    const email = document.getElementById("cadastroEmail").value.trim().toLowerCase();
    const senha = document.getElementById("cadastroSenha").value;
    const erro = document.getElementById("erroCadastro");

    if (!nome || !email || !senha) {
        erro.textContent = "Preencha todos os campos.";
        return;
    }

    const usuarios = obterUsuarios();

    if (usuarios.some(u => u.email === email)) {
        erro.textContent = "Já existe uma conta com esse e-mail.";
        return;
    }

    usuarios.push({ nome, email, senha });
    salvarUsuarios(usuarios);

    localStorage.setItem("happyBabyUsuarioLogado", JSON.stringify({ nome, email }));
    fecharModalConta();
    atualizarAreaConta();
}

function fazerLogout() {
    localStorage.removeItem("happyBabyUsuarioLogado");
    atualizarAreaConta();
}
