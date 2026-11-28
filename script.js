
// ==================================
// CONFIGURAÇÕES PERSONALIZÁVEIS
// ==================================

const CONFIG = {
    usuario: "Kamilla",
    senha: "harrypotter",
    seuNome: "Cristian"
};


// ==================================
// 1. LOGIN
// ==================================

function entrar() {
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;

    if (
        usuario.toLowerCase() === CONFIG.usuario.toLowerCase() &&
        senha === CONFIG.senha
    ) {
        mudarTela("pedido");

        document.getElementById("nomeContrato").textContent =
            CONFIG.seuNome;

    } else {
        document.getElementById("erro").textContent =
            "Ops! Nome ou senha incorretos. Tente novamente ❤️";
    }
}


// ==================================
// TROCAR DE TELA
// ==================================

function mudarTela(id) {
    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.remove("ativa");
    });

    document.getElementById(id).classList.add("ativa");
}


// ==================================
// 2. BOTÃO NÃO FUGITIVO
// ==================================

const botaoNao = document.getElementById("nao");

function fugir() {
    const margem = 20;

    const largura = botaoNao.offsetWidth;
    const altura = botaoNao.offsetHeight;

    const maxX = Math.max(
        margem,
        window.innerWidth - largura - margem
    );

    const maxY = Math.max(
        margem,
        window.innerHeight - altura - margem
    );

    const x = margem + Math.random() * (maxX - margem);
    const y = margem + Math.random() * (maxY - margem);

    botaoNao.style.position = "fixed";
    botaoNao.style.left = x + "px";
    botaoNao.style.top = y + "px";
    botaoNao.style.zIndex = "9999";
}

botaoNao.addEventListener("mouseenter", fugir);

botaoNao.addEventListener("touchstart", function(event) {
    event.preventDefault();
    fugir();
}, { passive: false });

botaoNao.addEventListener("click", fugir);


// ==================================
// ACEITOU NAMORAR
// ==================================

function aceitar() {
    mudarTela("contrato");

    document.getElementById("data").textContent =
        new Date().toLocaleDateString("pt-BR");

    prepararAssinatura();
}


// ==================================
// 3. ASSINATURA DIGITAL
// ==================================

const canvas = document.getElementById("assinatura");
const ctx = canvas.getContext("2d");

let desenhando = false;
let assinou = false;

function prepararAssinatura() {
    const proporcao = window.devicePixelRatio || 1;
    const largura = canvas.clientWidth;
    const altura = canvas.clientHeight;

    canvas.width = largura * proporcao;
    canvas.height = altura * proporcao;

    ctx.setTransform(proporcao, 0, 0, proporcao, 0, 0);

    ctx.strokeStyle = "#54243d";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
}

function obterPosicao(event) {
    const retangulo = canvas.getBoundingClientRect();

    return {
        x: event.clientX - retangulo.left,
        y: event.clientY - retangulo.top
    };
}

canvas.addEventListener("pointerdown", function(event) {
    event.preventDefault();

    desenhando = true;
    assinou = true;

    canvas.setPointerCapture(event.pointerId);

    const pos = obterPosicao(event);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener("pointermove", function(event) {
    if (!desenhando) return;

    event.preventDefault();

    const pos = obterPosicao(event);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
});

function pararDesenho() {
    desenhando = false;
    ctx.closePath();
}

canvas.addEventListener("pointerup", pararDesenho);
canvas.addEventListener("pointercancel", pararDesenho);


// ==================================
// LIMPAR ASSINATURA
// ==================================

function limparAssinatura() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    assinou = false;

    document.getElementById("aviso").textContent = "";
}


// ==================================
// FINALIZAR CONTRATO
// ==================================

function finalizar() {
    const nome = document.getElementById("nomePessoa").value.trim();

    const aviso = document.getElementById("aviso");

    if (!nome) {
        aviso.textContent = "Digite seu nome completo primeiro!";
        return;
    }

    if (!assinou) {
        aviso.textContent = "Você precisa assinar o contrato! ❤️";
        return;
    }

    aviso.textContent = "";

    document.getElementById("finalizacao").style.display = "block";

    document.getElementById("nomePessoa").readOnly = true;

    document.querySelector(
        "#contrato .botoes"
    ).style.display = "none";
}
