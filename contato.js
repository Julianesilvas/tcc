// ================================================
//  HAPPY BABY — contato.js
//  Página de contato: envio por WhatsApp e e-mail
//  e registro de reclamações (com protocolo).
//
//  Como o site é estático (sem servidor), nada é enviado
//  automaticamente: abrimos o WhatsApp ou o app de e-mail
//  com a mensagem pronta, e a pessoa confirma o envio lá.
// ================================================


// ===== CONFIGURAÇÃO — TROQUE AQUI PELOS DADOS REAIS =====
// É o único lugar que precisa ser editado.
const CT_CONFIG = {
    whatsapp: "5516982433302",              // só números: 55 + DDD + número
    whatsappExibicao: "(16) 98243-3302",    // como aparece na tela
    email: "happybaby72026@gmail.com",
    horario: "Segunda a sexta, das 9h às 18h"
};


// ===== Utilidades =====

function ctValor(id) {
    const campo = document.getElementById(id);
    return campo ? campo.value.trim() : "";
}

// Máscara de telefone: (00) 00000-0000
function ctMascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, "").slice(0, 11);
    if (valor.length > 10) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    } else if (valor.length > 5) {
        valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    }
    input.value = valor;
}

// Converte aaaa-mm-dd em dd/mm/aaaa
function ctFormatarData(dataISO) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

// Gera um protocolo no formato HB-AAAAMMDD-0000
function ctGerarProtocolo(data) {
    const agora = data || new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    const sufixo = Math.floor(1000 + Math.random() * 9000);
    return `HB-${ano}${mes}${dia}-${sufixo}`;
}


// ===== Montagem das mensagens =====
// Cada campo: { rotulo, valor, bloco }
// "bloco" = texto longo, que vai numa linha abaixo do rótulo.
// Campos com valor vazio são ignorados.

function ctFormatarMensagem(titulo, campos, canal) {
    const quebra = canal === "whatsapp" ? "\n" : "\r\n";
    const negrito = texto => (canal === "whatsapp" ? `*${texto}*` : texto);

    const linhas = [negrito(titulo), ""];

    campos.forEach(campo => {
        if (!campo.valor) return;
        if (campo.bloco) {
            const textoLongo = campo.valor.replace(/\r?\n/g, quebra);
            linhas.push("", `${negrito(campo.rotulo + ":")}`, textoLongo);
        } else {
            linhas.push(`${negrito(campo.rotulo + ":")} ${campo.valor}`);
        }
    });

    return linhas.join(quebra);
}

function ctCamposContato() {
    return [
        { rotulo: "Nome", valor: ctValor("ctNome") },
        { rotulo: "E-mail", valor: ctValor("ctEmail") },
        { rotulo: "Telefone", valor: ctValor("ctTelefone") },
        { rotulo: "Assunto", valor: ctValor("ctAssunto") },
        { rotulo: "Mensagem", valor: ctValor("ctMensagem"), bloco: true }
    ];
}

function ctCamposReclamacao(protocolo) {
    return [
        { rotulo: "Protocolo", valor: protocolo },
        { rotulo: "Nome", valor: ctValor("rcNome") },
        { rotulo: "E-mail", valor: ctValor("rcEmail") },
        { rotulo: "Telefone", valor: ctValor("rcTelefone") },
        { rotulo: "Tipo de reclamação", valor: ctValor("rcTipo") },
        { rotulo: "Profissional envolvida", valor: ctValor("rcProfissional") },
        { rotulo: "Data do ocorrido", valor: ctFormatarData(ctValor("rcData")) },
        { rotulo: "Descrição", valor: ctValor("rcDescricao"), bloco: true }
    ];
}


// ===== Abertura dos canais =====

function ctAbrirWhatsApp(texto) {
    const url = `https://wa.me/${CT_CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank", "noopener");
}

function ctAbrirEmail(assunto, corpo) {
    const url = `mailto:${CT_CONFIG.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.location.href = url;
}


// ===== Envio (chamado pelos botões) =====
// tipo: "contato" | "reclamacao"     canal: "whatsapp" | "email"

function ctEnviar(tipo, canal) {
    const ehReclamacao = tipo === "reclamacao";
    const formulario = document.getElementById(ehReclamacao ? "ctFormReclamacao" : "ctFormContato");
    if (!formulario || !formulario.reportValidity()) return;

    let titulo, campos, assuntoEmail, protocolo = "";

    if (ehReclamacao) {
        protocolo = ctGerarProtocolo();
        titulo = "Reclamação — Happy Baby";
        campos = ctCamposReclamacao(protocolo);
        assuntoEmail = `[Reclamação ${protocolo}] ${ctValor("rcTipo")}`;
    } else {
        titulo = "Contato pelo site — Happy Baby";
        campos = ctCamposContato();
        assuntoEmail = `[Site Happy Baby] ${ctValor("ctAssunto")}`;
    }

    if (canal === "whatsapp") {
        ctMostrarAviso(tipo, canal, protocolo);
        ctAbrirWhatsApp(ctFormatarMensagem(titulo, campos, "whatsapp"));
    } else {
        const corpoEmail = ctFormatarMensagem(titulo, campos, "email");
        ctUltimoEmail = { assunto: assuntoEmail, corpo: corpoEmail };
        ctMostrarAviso(tipo, canal, protocolo);
        ctAbrirEmail(assuntoEmail, corpoEmail);
    }
}

// Última mensagem de e-mail montada (usada pelas alternativas abaixo)
let ctUltimoEmail = null;

function ctEscaparHtml(texto) {
    return texto
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Link que abre o Gmail no navegador já com a mensagem escrita
function ctLinkGmail(assunto, corpo) {
    return "https://mail.google.com/mail/?view=cm&fs=1"
        + `&to=${encodeURIComponent(CT_CONFIG.email)}`
        + `&su=${encodeURIComponent(assunto)}`
        + `&body=${encodeURIComponent(corpo)}`;
}

function ctMostrarAviso(tipo, canal, protocolo) {
    const aviso = document.getElementById(tipo === "reclamacao" ? "ctAvisoReclamacao" : "ctAvisoContato");
    if (!aviso) return;

    const nomeCanal = canal === "whatsapp" ? "no WhatsApp" : "no seu aplicativo de e-mail";
    let html = `<p>Mensagem preparada! Falta só confirmar o envio ${nomeCanal}.</p>`;

    if (protocolo) {
        html = `
            <span class="ct-protocolo-rotulo">Protocolo da sua reclamação</span>
            <strong class="ct-protocolo-numero">${protocolo}</strong>
            <p>Guarde este número e informe-o em qualquer contato futuro sobre esta reclamação.
            Falta só confirmar o envio ${nomeCanal}.</p>
        `;
    }

    // E-mail: o aplicativo pode não abrir (depende do computador), então
    // oferecemos alternativas que funcionam em qualquer lugar.
    if (canal === "email" && ctUltimoEmail) {
        const linkGmail = ctEscaparHtml(ctLinkGmail(ctUltimoEmail.assunto, ctUltimoEmail.corpo));
        html += `
            <p class="ct-fallback">
                O e-mail não abriu? <a href="${linkGmail}" target="_blank" rel="noopener">Abrir no Gmail</a>
                ou <button type="button" class="ct-link-btn" onclick="ctCopiarMensagem(this)">copiar a mensagem</button>
                e enviar para <strong>${ctEscaparHtml(CT_CONFIG.email)}</strong>.
            </p>
        `;
    }

    aviso.innerHTML = html;
    aviso.hidden = false;
    aviso.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Copia a mensagem completa (destinatário, assunto e texto) para a área de transferência
function ctCopiarMensagem(botao) {
    if (!ctUltimoEmail) return;

    const texto = `Para: ${CT_CONFIG.email}\r\nAssunto: ${ctUltimoEmail.assunto}\r\n\r\n${ctUltimoEmail.corpo}`;
    const confirmar = () => { if (botao) botao.textContent = "mensagem copiada!"; };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(confirmar).catch(() => ctCopiarAntigo(texto, confirmar));
    } else {
        ctCopiarAntigo(texto, confirmar);
    }
}

// Alternativa para navegadores/ambientes sem acesso direto à área de transferência
function ctCopiarAntigo(texto, confirmar) {
    const area = document.createElement("textarea");
    area.value = texto;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
        if (document.execCommand("copy")) confirmar();
    } catch (erro) {
        // sem suporte: a pessoa ainda tem o link do Gmail
    }
    document.body.removeChild(area);
}


// ===== Abas: Fale conosco / Reclamação =====

function ctTrocarAba(aba) {
    const painelContato = document.getElementById("ctPainelContato");
    const painelReclamacao = document.getElementById("ctPainelReclamacao");
    if (!painelContato || !painelReclamacao) return;

    painelContato.hidden = aba !== "contato";
    painelReclamacao.hidden = aba !== "reclamacao";

    document.querySelectorAll(".ct-aba").forEach(botao => {
        const ativa = botao.getAttribute("data-aba") === aba;
        botao.classList.toggle("ct-aba-ativa", ativa);
        botao.setAttribute("aria-selected", ativa ? "true" : "false");
    });
}


// ===== Inicialização =====

function ctIniciar() {
    // Preenche os dados de contato a partir da configuração
    document.querySelectorAll('[data-ct="whatsapp-exibicao"]').forEach(el => {
        el.textContent = CT_CONFIG.whatsappExibicao;
    });
    document.querySelectorAll('[data-ct="email-exibicao"]').forEach(el => {
        el.textContent = CT_CONFIG.email;
    });
    document.querySelectorAll('[data-ct="horario"]').forEach(el => {
        el.textContent = CT_CONFIG.horario;
    });

    const linkWhatsApp = document.getElementById("ctLinkWhatsApp");
    if (linkWhatsApp) {
        linkWhatsApp.href = `https://wa.me/${CT_CONFIG.whatsapp}`;
    }
    const linkEmail = document.getElementById("ctLinkEmail");
    if (linkEmail) {
        linkEmail.href = `mailto:${CT_CONFIG.email}`;
    }

    // Permite abrir direto na aba de reclamação: contato.html#reclamacao
    if (window.location.hash === "#reclamacao") {
        ctTrocarAba("reclamacao");
    }
}

document.addEventListener("DOMContentLoaded", ctIniciar);
