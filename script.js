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
let modoEdicao = false;
const totalPerguntas = 31;
const perguntaEscolhaBaba = 26;
const perguntaRevisao = 31;
let destinoEdicao = perguntaRevisao; // pra onde voltar depois de editar uma resposta

// ===== Disponibilidade das babás por data e período =====

const DIAS_SEMANA = [
    { chave: "dom", nome: "domingo" },
    { chave: "seg", nome: "segunda-feira" },
    { chave: "ter", nome: "terça-feira" },
    { chave: "qua", nome: "quarta-feira" },
    { chave: "qui", nome: "quinta-feira" },
    { chave: "sex", nome: "sexta-feira" },
    { chave: "sab", nome: "sábado" }
];

// Períodos que a contratação exige. "Integral" = manhã + tarde.
function periodosExigidos(periodoEscolhido) {
    switch (periodoEscolhido) {
        case "Manhã": return ["manha"];
        case "Tarde": return ["tarde"];
        case "Noite": return ["noite"];
        case "Integral": return ["manha", "tarde"];
        default: return [];
    }
}

// Descobre o dia da semana de uma data aaaa-mm-dd (sem erro de fuso horário)
function diaDaSemanaDaData(dataISO) {
    if (!dataISO) return null;
    const [ano, mes, dia] = dataISO.split("-").map(Number);
    return DIAS_SEMANA[new Date(ano, mes - 1, dia).getDay()];
}

// Retorna "disponivel", "indisponivel" ou "flexivel" (babá com agenda flexível, sem horários fixos)
// Ela precisa estar livre, nos períodos exigidos, em TODOS os dias pedidos.
function situacaoDisponibilidade(dadosBaba, dias, exigidos) {
    if (!dadosBaba.disponibilidade) return "flexivel";
    if (dias.length === 0 || exigidos.length === 0) return "disponivel";
    const atendeTodos = dias.every(dia => {
        const livres = dadosBaba.disponibilidade[dia.chave] || [];
        return exigidos.every(periodo => livres.includes(periodo));
    });
    return atendeTodos ? "disponivel" : "indisponivel";
}

// Valor dos checkboxes de "dias da semana" -> chave usada na agenda das babás
const CHAVE_DIA_MARCADO = {
    "Segunda": "seg", "Terça": "ter", "Quarta": "qua", "Quinta": "qui",
    "Sexta": "sex", "Sábado": "sab", "Domingo": "dom"
};

// Lê data, período, duração e dias da semana já preenchidos no formulário.
// Quais dias contam:
//  - "Um único dia": só o dia da semana da data escolhida;
//  - senão, se a pessoa marcou dias da semana, valem os dias marcados;
//  - senão, vale o dia da semana da data de início.
function lerFiltroDisponibilidade() {
    const dataISO = document.getElementById("dataInicio").value;
    const periodo = document.getElementById("periodoContratacao").value;
    const duracao = document.getElementById("duracaoContratacao").value;
    const diaDaData = diaDaSemanaDaData(dataISO);

    const diasMarcados = Array.from(document.querySelectorAll('input[name="diaSemana"]:checked'))
        .map(caixa => DIAS_SEMANA.find(dia => dia.chave === CHAVE_DIA_MARCADO[caixa.value]))
        .filter(Boolean);

    let dias, origemDias;
    if (duracao !== "Um único dia" && diasMarcados.length > 0) {
        dias = diasMarcados;
        origemDias = "marcados";
    } else {
        dias = diaDaData ? [diaDaData] : [];
        origemDias = "data";
    }

    return { dataISO, periodo, dias, origemDias, exigidos: periodosExigidos(periodo) };
}

// Depois de mudar data/período: a babá já escolhida continua livre?
function babaEscolhidaContinuaLivre() {
    const nome = document.getElementById("selectBaba").value;
    const dados = bancoBabas[nome];
    if (!nome || !dados) return true;
    const filtro = lerFiltroDisponibilidade();
    return situacaoDisponibilidade(dados, filtro.dias, filtro.exigidos) !== "indisponivel";
}

// "Banco de dados" das babás (site estático, sem back-end).
// disponibilidade: agenda por dia da semana e período. "null" = agenda flexível
// (a profissional aparece em qualquer data e período).
// Se as fotos das babás estiverem em outra pasta, ajuste os caminhos abaixo.
const bancoBabas = {
    "Ana Laura": {
        foto: "imgs/AnaLaura.jpeg",
        cidade: "São Carlos - SP",
        avaliacoes: 18,
        preco: "R$ 30/hora",
        experiencia: "4 anos de experiência",
        destaques: ["Primeiros Socorros", "Recreação Infantil"],
        disponibilidade: { seg: ["manha", "tarde"], ter: ["manha", "tarde", "noite"], qua: ["manha", "tarde"], qui: ["manha", "tarde", "noite"], sex: ["manha", "tarde"], sab: [], dom: [] }
    },
    "Mariany Ruas": {
        foto: "imgs/Mariany.jpeg",
        cidade: "Belo Horizonte - MG",
        avaliacoes: 13,
        preco: "R$ 35/hora",
        experiencia: "3 anos de experiência",
        destaques: [],
        disponibilidade: { seg: ["manha", "tarde"], ter: ["manha", "tarde", "noite"], qua: ["tarde", "noite"], qui: ["manha", "noite"], sex: ["tarde"], sab: [], dom: [] }
    },
    "Julia Penedo": {
        foto: "imgs/Julia.jpeg",
        cidade: "Rio Branco - AC",
        avaliacoes: 21,
        preco: "R$ 40/hora",
        experiencia: "6 anos de experiência",
        destaques: [],
        disponibilidade: { seg: ["manha", "tarde", "noite"], ter: ["tarde", "noite"], qua: ["manha", "tarde"], qui: ["manha", "noite"], sex: ["manha", "tarde"], sab: [], dom: [] }
    },
    "Heloisa Inácio": {
        foto: "imgs/Heloisa.jpeg",
        cidade: "São Gonçalo - RJ",
        avaliacoes: 29,
        preco: "R$ 45/hora",
        experiencia: "8 anos de experiência",
        destaques: [],
        disponibilidade: { seg: ["manha", "tarde", "noite"], ter: ["manha", "tarde", "noite"], qua: ["manha", "noite"], qui: ["manha", "tarde"], sex: ["manha", "tarde"], sab: [], dom: [] }
    },
    "Juliane Santana": {
        foto: "imgs/Juliane.jpeg",
        cidade: "Feira de Santana - BA",
        avaliacoes: 34,
        preco: "R$ 42/hora",
        experiencia: "7 anos de experiência",
        destaques: [],
        disponibilidade: { seg: ["manha", "tarde"], ter: ["manha", "tarde", "noite"], qua: ["manha", "tarde"], qui: ["manha", "tarde", "noite"], sex: ["manha", "tarde", "noite"], sab: ["manha", "tarde", "noite"], dom: ["tarde", "noite"] }
    },
    "Caroline Aparecida": {
        foto: "imgs/Carol.jpeg",
        cidade: "Porto Alegre - RS",
        avaliacoes: 47,
        preco: "R$ 48/hora",
        experiencia: "10 anos de experiência",
        destaques: [],
        disponibilidade: { seg: ["manha", "tarde", "noite"], ter: ["manha", "tarde", "noite"], qua: ["manha", "tarde"], qui: ["manha", "tarde", "noite"], sex: ["manha", "tarde", "noite"], sab: ["manha", "noite"], dom: ["manha"] }
    },
    "Lorena Costa": {
        foto: "imgs/Lorena.jpeg",
        cidade: "Macapá - AP",
        avaliacoes: 17,
        preco: "R$ 32/hora",
        experiencia: "2 anos de experiência",
        destaques: [],
        disponibilidade: { seg: ["tarde", "noite"], ter: ["manha", "tarde"], qua: ["manha", "noite"], qui: ["tarde", "noite"], sex: ["manha", "tarde"], sab: ["manha", "noite"], dom: ["tarde"] }
    },
    "Letícia Mendes": {
        foto: "imgs/Leticia.jpeg",
        cidade: "Araraquara - SP",
        avaliacoes: 9,
        preco: "R$ 28/hora",
        experiencia: "1 ano de experiência",
        destaques: [],
        disponibilidade: { seg: ["manha", "tarde"], ter: ["manha", "noite"], qua: ["manha", "tarde"], qui: ["tarde", "noite"], sex: ["manha", "tarde"], sab: ["tarde", "noite"], dom: ["noite"] }
    },
    "Camila Santos": {
        foto: "imgs/Camila.jpeg",
        cidade: "Angra dos Reis - RJ",
        avaliacoes: 4,
        preco: "R$ 25/hora",
        experiencia: "1 ano e 7 meses de experiência",
        destaques: [],
        disponibilidade: null
    },
    "Cátia Fernandes": {
        foto: "imgs/Cátia.jpeg",
        cidade: "Tiradentes - MG",
        avaliacoes: 12,
        preco: "R$ 35/hora",
        experiencia: "7 anos de experiência",
        destaques: [],
        disponibilidade: null
    },
    "Angelica Camargo": {
        foto: "imgs/Angelica.jpeg",
        cidade: "Gramado - RS",
        avaliacoes: 7,
        preco: "R$ 30/hora",
        experiencia: "3 anos de experiência",
        destaques: [],
        disponibilidade: null
    },
    "Sonia Ribeiro": {
        foto: "imgs/Sonia.jpeg",
        cidade: "São Paulo - SP",
        avaliacoes: 15,
        preco: "R$ 38/hora",
        experiencia: "4 anos de experiência",
        destaques: [],
        disponibilidade: null
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

    // Ao entrar na pergunta 9, gera um bloco de campos por criança
    if (numero === 9) {
        gerarCamposCriancas();
    }

    // Perguntas de medicamentos e rotinas também são geradas por criança
    if (numero === 13) {
        gerarCamposMedicamentos();
    }
    if (numero === 14) {
        gerarCamposRotinaSono();
    }
    if (numero === 16) {
        gerarCamposRotinaGeral();
    }

    // Na escolha da babá, mostra só quem está livre na data e período escolhidos
    if (numero === perguntaEscolhaBaba) {
        renderizarGridBabas();
    }

    // Ao chegar na revisão final, monta o resumo com os dados preenchidos
    if (numero === perguntaRevisao) {
        preencherResumo();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== Gera um bloco de nome + idade + alergia para cada criança informada =====
// Só recria os blocos se a quantidade mudou, pra não apagar o que já foi digitado
function gerarCamposCriancas() {
    const qtd = parseInt(document.getElementById("qtdCriancas").value, 10) || 1;
    const container = document.getElementById("containerCriancas");
    if (!container) return;

    if (container.children.length === qtd) return; // já está correto, não mexe

    container.innerHTML = "";

    for (let i = 1; i <= qtd; i++) {
        const bloco = document.createElement("div");
        bloco.className = "bloco-crianca";
        bloco.innerHTML = `
            <h4>Criança ${i}</h4>
            <div class="linha-form">
                <input type="text" id="nomeCrianca${i}" class="campo-nome-crianca" placeholder="Nome da criança" required>
                <input type="text" id="idadeCrianca${i}" class="campo-idade-crianca" placeholder="Idade" required>
            </div>
            <input type="text" id="alergiaCrianca${i}" class="campo-alergia-crianca" placeholder="Alergias (opcional)">
        `;
        container.appendChild(bloco);
    }
}

// Retorna o nome que a família deu pra criança (ou "Criança N" se ainda não preencheu)
function obterNomeCrianca(indice) {
    const campo = document.getElementById("nomeCrianca" + indice);
    return (campo && campo.value.trim()) ? campo.value.trim() : `Criança ${indice}`;
}

// ===== Gera um campo de medicamentos por criança, usando o nome dela no título =====
function gerarCamposMedicamentos() {
    const qtd = parseInt(document.getElementById("qtdCriancas").value, 10) || 1;
    const container = document.getElementById("containerMedicamentos");
    if (!container) return;

    if (container.children.length !== qtd) {
        container.innerHTML = "";
        for (let i = 1; i <= qtd; i++) {
            const bloco = document.createElement("div");
            bloco.className = "bloco-crianca";
            bloco.innerHTML = `
                <h4 class="titulo-crianca" data-indice="${i}"></h4>
                <input type="text" id="medicamentoCrianca${i}" placeholder="Medicamentos (opcional)">
            `;
            container.appendChild(bloco);
        }
    }

    container.querySelectorAll(".titulo-crianca").forEach(titulo => {
        titulo.textContent = obterNomeCrianca(titulo.getAttribute("data-indice"));
    });
}

// ===== Gera os campos de rotina de sono por criança, usando o nome dela no título =====
function gerarCamposRotinaSono() {
    const qtd = parseInt(document.getElementById("qtdCriancas").value, 10) || 1;
    const container = document.getElementById("containerRotinaSono");
    if (!container) return;

    if (container.children.length !== qtd) {
        container.innerHTML = "";
        for (let i = 1; i <= qtd; i++) {
            const bloco = document.createElement("div");
            bloco.className = "bloco-crianca";
            bloco.innerHTML = `
                <h4 class="titulo-crianca" data-indice="${i}"></h4>
                <div class="linha-form">
                    <input type="text" id="horarioAcordarCrianca${i}" placeholder="Horário que costuma acordar (opcional)">
                    <input type="text" id="horarioDormirCrianca${i}" placeholder="Horário que costuma dormir (opcional)">
                </div>
            `;
            container.appendChild(bloco);
        }
    }

    container.querySelectorAll(".titulo-crianca").forEach(titulo => {
        titulo.textContent = obterNomeCrianca(titulo.getAttribute("data-indice"));
    });
}

// ===== Gera o campo de rotina geral por criança, usando o nome dela no título =====
function gerarCamposRotinaGeral() {
    const qtd = parseInt(document.getElementById("qtdCriancas").value, 10) || 1;
    const container = document.getElementById("containerRotinaGeral");
    if (!container) return;

    if (container.children.length !== qtd) {
        container.innerHTML = "";
        for (let i = 1; i <= qtd; i++) {
            const bloco = document.createElement("div");
            bloco.className = "bloco-crianca";
            bloco.innerHTML = `
                <h4 class="titulo-crianca" data-indice="${i}"></h4>
                <textarea id="rotinaCrianca${i}" rows="5" placeholder="Alimentação, escola, atividades, brincadeiras, televisão, cochilos, entre outras informações importantes."></textarea>
            `;
            container.appendChild(bloco);
        }
    }

    container.querySelectorAll(".titulo-crianca").forEach(titulo => {
        titulo.textContent = obterNomeCrianca(titulo.getAttribute("data-indice"));
    });
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

    // Se veio de um lápis de edição (ou de "alterar data/período"), volta pro destino combinado
    if (modoEdicao) {
        // Mudou data ou período: a babá já escolhida ainda está livre? Se não, vai escolher outra.
        // 18 = data, 19 = período, 20 = duração, 22 = dias da semana
        const mudouDataOuPeriodo = [18, 19, 20, 22].includes(perguntaAtual);
        if (mudouDataOuPeriodo && destinoEdicao !== perguntaEscolhaBaba && !babaEscolhidaContinuaLivre()) {
            mostrarPergunta(perguntaEscolhaBaba); // continua em modo edição, depois segue pra revisão
            return;
        }

        modoEdicao = false;
        const destino = destinoEdicao;
        destinoEdicao = perguntaRevisao;
        mostrarPergunta(destino);
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

// Usado pelos lápis (✎) no resumo final, pra pular direto pra pergunta certa
function irParaPergunta(numero) {
    modoEdicao = true;
    destinoEdicao = perguntaRevisao;
    mostrarPergunta(numero);
}

// Pula pra uma pergunta e, depois de responder, volta pra outra (ex.: alterar a data e voltar à lista de babás)
function irParaPerguntaComRetorno(numero, retorno) {
    modoEdicao = true;
    destinoEdicao = retorno;
    mostrarPergunta(numero);
}

// ===== Gera os cards de seleção da babá, filtrando pela data e período escolhidos =====

// "manhã", "manhã e tarde", "manhã, tarde e noite"
function listarPeriodos(periodos) {
    const nomes = { manha: "manhã", tarde: "tarde", noite: "noite" };
    const lista = periodos.map(p => nomes[p]);
    if (lista.length <= 1) return lista.join("");
    return lista.slice(0, -1).join(", ") + " e " + lista[lista.length - 1];
}

function criarCardBaba(nome, dados, textoDisponibilidade) {
    const card = document.createElement("div");
    card.className = "card-selecao-baba";
    card.setAttribute("data-nome", nome);

    card.innerHTML = `
        <img src="${dados.foto}" alt="${nome}">
        <div class="card-selecao-info">
            <h4>${nome}</h4>
            <p>${dados.cidade}</p>
            <p>${dados.preco}</p>
            <p class="card-selecao-disp">${textoDisponibilidade}</p>
        </div>
        <span class="selo-selecionada">✓</span>
    `;

    card.addEventListener("click", () => selecionarBaba(nome));
    return card;
}

function renderizarGridBabas() {
    const gridDisponiveis = document.getElementById("gridSelecaoBaba");
    const gridFlexivel = document.getElementById("gridFlexivelBaba");
    if (!gridDisponiveis || !gridFlexivel) return; // só roda na contratar.html

    const filtro = lerFiltroDisponibilidade();

    gridDisponiveis.innerHTML = "";
    gridFlexivel.innerHTML = "";

    const disponiveis = [];
    const flexiveis = [];
    Object.keys(bancoBabas).forEach(nome => {
        const situacao = situacaoDisponibilidade(bancoBabas[nome], filtro.dias, filtro.exigidos);
        if (situacao === "disponivel") disponiveis.push(nome);
        if (situacao === "flexivel") flexiveis.push(nome);
    });

    // Se a profissional escolhida antes não aparece mais, limpa a escolha e avisa
    const campoEscolhida = document.getElementById("selectBaba");
    const escolhida = campoEscolhida.value;
    const avisoIndisponivel = document.getElementById("avisoBabaIndisponivel");
    const perdeuEscolhida = escolhida && !disponiveis.includes(escolhida) && !flexiveis.includes(escolhida);

    if (perdeuEscolhida) {
        campoEscolhida.value = "";
        avisoIndisponivel.textContent = `${escolhida} não está livre nos dias e período escolhidos. Escolha outra profissional ou altere os dias, a data ou o período.`;
    }
    avisoIndisponivel.style.display = perdeuEscolhida ? "block" : "none";

    // Texto que explica o filtro aplicado
    const info = document.getElementById("infoDisponibilidadeBaba");
    if (filtro.dias.length && filtro.exigidos.length) {
        const periodoTexto = filtro.periodo === "Integral" ? "integral (manhã e tarde)" : filtro.periodo.toLowerCase();
        if (filtro.origemDias === "marcados") {
            const nomes = filtro.dias.map(dia => dia.nome);
            const lista = nomes.length === 1 ? nomes[0] : nomes.slice(0, -1).join(", ") + " e " + nomes[nomes.length - 1];
            info.textContent = `Profissionais livres nos dias escolhidos (${lista}), no período ${periodoTexto}.`;
        } else {
            const [ano, mes, dia] = filtro.dataISO.split("-");
            info.textContent = `Profissionais livres em ${filtro.dias[0].nome}, ${dia}/${mes}/${ano}, no período ${periodoTexto}.`;
        }
    } else {
        info.textContent = "Escolha uma data e um período para ver quem está livre.";
    }

    // Cards disponíveis (mostra em quais períodos ela está livre naquele dia)
    disponiveis.forEach(nome => {
        let texto = "";
        if (filtro.dias.length === 1) {
            const livres = bancoBabas[nome].disponibilidade[filtro.dias[0].chave];
            texto = livres.length ? `Livre: ${listarPeriodos(livres)}` : "";
        } else if (filtro.dias.length > 1) {
            texto = "Livre em todos os dias escolhidos";
        }
        gridDisponiveis.appendChild(criarCardBaba(nome, bancoBabas[nome], texto));
    });

    // Mensagem quando ninguém com agenda cadastrada está livre
    document.getElementById("avisoSemBabas").style.display = disponiveis.length ? "none" : "block";

    // Babás com agenda flexível aparecem em qualquer data e período
    flexiveis.forEach(nome => {
        gridFlexivel.appendChild(criarCardBaba(nome, bancoBabas[nome], "Agenda flexível"));
    });
    document.getElementById("blocoFlexivelBaba").style.display = flexiveis.length ? "block" : "none";

    // Mantém marcada a profissional já escolhida
    document.querySelectorAll(".card-selecao-baba").forEach(card => {
        card.classList.toggle("selecionada", card.getAttribute("data-nome") === campoEscolhida.value);
    });
}

// ===== Marca a babá escolhida =====
function selecionarBaba(nome) {
    document.getElementById("selectBaba").value = nome;

    document.querySelectorAll(".card-selecao-baba").forEach(card => {
        card.classList.toggle("selecionada", card.getAttribute("data-nome") === nome);
    });

    document.getElementById("avisoSelecaoBaba").style.display = "none";
    document.getElementById("avisoBabaIndisponivel").style.display = "none";
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
    const endereco = document.getElementById("enderecoResponsavel").value;
    const numero = document.getElementById("numeroResponsavel").value.trim();
    const complemento = document.getElementById("complementoResponsavel").value.trim();
    const referencia = document.getElementById("referenciaResponsavel").value.trim();
    const cep = document.getElementById("cepResponsavel").value;
    const qtdCriancas = document.getElementById("qtdCriancas").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const periodo = document.getElementById("periodoContratacao").value;
    const duracao = document.getElementById("duracaoContratacao").value;

    // --- Idades e alergias de cada criança (campos dinâmicos) ---
    const qtd = parseInt(qtdCriancas, 10) || 0;
    const idadesLista = [];
    const alergiasLista = [];
    for (let i = 1; i <= qtd; i++) {
        const campoIdade = document.getElementById("idadeCrianca" + i);
        const campoAlergia = document.getElementById("alergiaCrianca" + i);
        if (campoIdade && campoIdade.value) idadesLista.push(campoIdade.value);
        if (campoAlergia && campoAlergia.value) alergiasLista.push(`Criança ${i}: ${campoAlergia.value}`);
    }

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
    // Endereço completo: rua, número, complemento, cidade - estado e CEP (só o que foi preenchido)
    const partesEndereco = [endereco, numero, complemento, cidade && estado ? `${cidade} - ${estado}` : (cidade || estado)]
        .filter(Boolean);
    let enderecoCompleto = partesEndereco.join(", ");
    if (enderecoCompleto && cep) enderecoCompleto += ` · CEP ${cep}`;
    document.getElementById("resumoEndereco").textContent = enderecoCompleto || "-";
    document.getElementById("resumoReferencia").textContent = referencia || "-";
    document.getElementById("resumoCriancas").textContent = qtdCriancas || "-";
    document.getElementById("resumoIdades").textContent = idadesLista.length ? idadesLista.join(", ") : "-";
    document.getElementById("resumoAlergias").textContent = alergiasLista.length ? alergiasLista.join(" · ") : "Nenhuma informada";
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
    // Não permite escolher datas que já passaram
    const campoData = document.getElementById("dataInicio");
    if (campoData) {
        const hoje = new Date();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const dia = String(hoje.getDate()).padStart(2, "0");
        campoData.min = `${hoje.getFullYear()}-${mes}-${dia}`;
    }
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

    // --- Dados pessoais ---
    const nome = document.getElementById("nomeBaba").value;
    const cpf = document.getElementById("cpfBaba").value;
    const nascimento = document.getElementById("nascimentoBaba").value;
    const telefone = document.getElementById("telefoneBaba").value;
    const email = document.getElementById("emailBaba").value;
    const cidade = document.getElementById("cidadeBaba").value;
    const estado = document.getElementById("estadoBaba").value;
    const endereco = document.getElementById("enderecoBaba").value;
    const cep = document.getElementById("cepBaba").value;

    // --- Experiência ---
    const experiencia = document.getElementById("experienciaBaba").value;
    const valorHora = document.getElementById("valorHoraBaba").value;
    const sobre = document.getElementById("sobreBaba").value;
    const estiloTrabalho = document.getElementById("estiloTrabalhoBaba").value;

    const faixasMarcadas = Array.from(
        document.querySelectorAll('input[name="faixaEtaria"]:checked')
    ).map(chk => chk.value);

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

    // Formata a data de nascimento dd/mm/aaaa
    let nascimentoFormatado = "-";
    if (nascimento) {
        const [ano, mes, dia] = nascimento.split("-");
        nascimentoFormatado = `${dia}/${mes}/${ano}`;
    }

    document.getElementById("resumoNomeBaba2").textContent = nome || "-";
    document.getElementById("resumoCpfBaba").textContent = cpf || "-";
    document.getElementById("resumoNascimentoBaba").textContent = nascimentoFormatado;
    document.getElementById("resumoTelefoneBaba").textContent = telefone || "-";
    document.getElementById("resumoEmailBaba").textContent = email || "-";
    document.getElementById("resumoEnderecoBaba").textContent =
        (endereco || cidade || estado || cep)
            ? `${endereco || "-"}, ${cidade || "-"} - ${estado || "-"} · CEP ${cep || "-"}`
            : "-";
    document.getElementById("resumoExperienciaBaba2").textContent = experiencia || "-";
    document.getElementById("resumoValorBaba").textContent = valorHora ? `R$ ${valorHora}/hora` : "-";
    document.getElementById("resumoFaixaEtariaBaba").textContent = faixasMarcadas.length ? faixasMarcadas.join(", ") : "-";
    document.getElementById("resumoCursosBaba").textContent = cursosMarcados.length ? cursosMarcados.join(", ") : "-";
    document.getElementById("resumoDiasBaba").textContent = disponibilidadeMarcada.length ? disponibilidadeMarcada.join(", ") : "-";
    document.getElementById("resumoSobreBaba").textContent = sobre || "-";
    document.getElementById("resumoEstiloTrabalhoBaba").textContent = estiloTrabalho || "-";

    // --- Status dos documentos ---
    const documentos = [
        { input: "arquivoRG", resumo: "resumoDocRG" },
        { input: "arquivoAntecedenteEstadual", resumo: "resumoDocAntecedenteEst" },
        { input: "arquivoAntecedenteFederal", resumo: "resumoDocAntecedenteF" },
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

    // --- Certificados: soma os arquivos de todos os campos dinâmicos ---
    let totalCertificados = 0;
    document.querySelectorAll(".input-certificado").forEach(input => {
        totalCertificados += input.files.length;
    });
    const resumoCert = document.getElementById("resumoDocCertificados");
    if (resumoCert) {
        resumoCert.textContent = totalCertificados > 0
            ? `✔ ${totalCertificados} arquivo${totalCertificados > 1 ? "s" : ""} anexado${totalCertificados > 1 ? "s" : ""}`
            : "Não anexado";
    }
}

// ===== Campos dinâmicos de certificado (Etapa de documentos) =====
function adicionarCampoCertificado() {
    const container = document.getElementById("containerCertificados");
    const novoItem = document.createElement("div");
    novoItem.className = "upload-item certificado-item";
    novoItem.innerHTML = `
        <input type="file" class="input-certificado" accept=".pdf,.jpg,.jpeg,.png" onchange="atualizarNomeCertificado(this)">
        <span class="nome-arquivo">Nenhum arquivo selecionado</span>
        <button type="button" class="btn-remover-certificado" onclick="removerCampoCertificado(this)">Remover</button>
    `;
    container.appendChild(novoItem);
}

function removerCampoCertificado(botao) {
    botao.closest(".certificado-item").remove();
}

function atualizarNomeCertificado(input) {
    const span = input.nextElementSibling;
    if (input.files.length > 0) {
        span.textContent = "✔ " + input.files[0].name;
        span.classList.add("arquivo-ok");
    } else {
        span.textContent = "Nenhum arquivo selecionado";
        span.classList.remove("arquivo-ok");
    }
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

// ===== Busca endereço automaticamente a partir do CEP (API ViaCEP) =====
// Chamada junto com a máscara: só faz a busca quando o CEP tiver os 8 dígitos completos
function buscarEnderecoPorCEP(inputCep, idEndereco, idCidade, idEstado) {
    const cepLimpo = inputCep.value.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    const campoEndereco = document.getElementById(idEndereco);
    const campoCidade = document.getElementById(idCidade);
    const campoEstado = document.getElementById(idEstado);

    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then(resposta => resposta.json())
        .then(dados => {
            if (dados.erro) return; // CEP não encontrado — deixa a pessoa preencher manualmente

            if (campoEndereco && dados.logradouro) campoEndereco.value = dados.logradouro;
            if (campoCidade && dados.localidade) campoCidade.value = dados.localidade;
            if (campoEstado && dados.uf) campoEstado.value = dados.uf;
        })
        .catch(() => {
            // Falha de conexão: não trava o formulário, a pessoa preenche manualmente
        });
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
