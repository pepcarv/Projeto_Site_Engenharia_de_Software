/* =====================================================
   ESTADO GLOBAL
===================================================== */

const IstosApp = {
    selectedElement: null,
    currentLang: "pt",
    typewriterInterval: null,
    aiTypingInterval: null
};

/* =====================================================
   TRADUÇÕES
===================================================== */

const translations = {
    pt: {
        hero: "O futuro do desenvolvimento web assistido pela inteligência Istos.",
        start: "Começar Projeto",
        account: "Minha Conta",
        plans: "Ver Planos",
        chatPlaceholder: "Ex: 'Crie um botão neon'...",
        aiInit: "Olá! Eu sou a Istos AI. Como posso projetar seu site hoje?",
        aiReply: "Analisando solicitação... Estrutura futurista pronta para implementação."
    },
    en: {
        hero: "The future of web development assisted by Istos intelligence.",
        start: "Start Project",
        account: "My Account",
        plans: "View Plans",
        chatPlaceholder: "Ex: 'Create a neon button'...",
        aiInit: "Hello! I am Istos AI. How can I design your website today?",
        aiReply: "Analyzing request... Futuristic structure ready for deployment."
    }
};

/* =====================================================
   NAVEGAÇÃO COM TRANSIÇÃO SUAVE
===================================================== */

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
        setTimeout(() => {
            if (!page.classList.contains("active")) {
                page.style.display = "none";
            }
        }, 350);
    });

    const target = document.getElementById(pageId);
    if (!target) return;

    target.style.display = "flex";
    setTimeout(() => target.classList.add("active"), 10);
}

/* =====================================================
   TYPEWRITER HERO (SEM CONFLITO)
===================================================== */

function startTypewriter(text) {
    const el = document.getElementById("typewriter");
    if (!el) return;

    el.innerHTML = "";
    let index = 0;

    clearInterval(IstosApp.typewriterInterval);

    IstosApp.typewriterInterval = setInterval(() => {
        if (index < text.length) {
            el.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(IstosApp.typewriterInterval);
        }
    }, 35);
}

/* =====================================================
   SISTEMA DE TRADUÇÃO COMPLETO
===================================================== */

function toggleLanguage() {
    IstosApp.currentLang = IstosApp.currentLang === "pt" ? "en" : "pt";
    const t = translations[IstosApp.currentLang];

    updateText("start-btn", t.start);
    updateText("acc-btn", t.account);
    updateText("plans-btn", t.plans);
    updateText("lang-text", IstosApp.currentLang === "pt" ? "EN" : "PT");

    const input = document.getElementById("ai-input");
    if (input) input.placeholder = t.chatPlaceholder;

    startTypewriter(t.hero);

    const firstAiMsg = document.querySelector(".msg-ai");
    if (firstAiMsg) firstAiMsg.innerText = t.aiInit;
}

function updateText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

/* =====================================================
   CHAT FUTURISTA COM EFEITO DE DIGITAÇÃO
===================================================== */

function sendMessage() {
    const input = document.getElementById("ai-input");
    const chatBox = document.getElementById("chat-box");
    if (!input || !chatBox) return;

    const text = input.value.trim();
    if (!text) return;

    appendMessage("user", text);
    input.value = "";

    setTimeout(() => simulateAITyping(), 600);
}

function appendMessage(type, text) {
    const chatBox = document.getElementById("chat-box");
    const msg = document.createElement("div");

    msg.className = type === "user" ? "msg-user" : "msg-ai";
    msg.innerText = text;

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function simulateAITyping() {
    const chatBox = document.getElementById("chat-box");
    const msg = document.createElement("div");
    msg.className = "msg-ai";
    chatBox.appendChild(msg);

    const text = translations[IstosApp.currentLang].aiReply;
    let index = 0;

    clearInterval(IstosApp.aiTypingInterval);

    IstosApp.aiTypingInterval = setInterval(() => {
        if (index < text.length) {
            msg.innerHTML += text.charAt(index);
            index++;
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            clearInterval(IstosApp.aiTypingInterval);
        }
    }, 25);
}

/* =====================================================
   CANVAS - BUILDER DINÂMICO
===================================================== */

function addElement(type) {
    const canvas = document.querySelector('.canvas-area');
    const novoElemento = document.createElement('div');

    removePlaceholder();
    
    // Configura o visual do elemento criado
    novoElemento.className = 'element-on-canvas';
    novoElemento.innerHTML = `<span>${type}</span>`; // Usa o tipo vindo do onclick
    
    // Define posição inicial absoluta dentro do canvas
    novoElemento.style.position = 'absolute';
    novoElemento.style.top = '50px';
    novoElemento.style.left = '50px';

    let isDragging = false;
    let offsetX, offsetY;

    // Início do arraste: quando o usuário clica no elemento
    novoElemento.addEventListener('mousedown', (e) => {
        isDragging = true;
        // Calcula a distância entre o clique e a borda do elemento para não "pular"
        offsetX = e.clientX - novoElemento.offsetLeft;
        offsetY = e.clientY - novoElemento.offsetTop;
        novoElemento.style.cursor = 'grabbing';
    });

    // Movimentação: ocorre no documento todo para não perder o foco se mover rápido
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const rect = canvas.getBoundingClientRect();
        const header = document.querySelector('.canvas-top');
        const headerHeight = header.offsetHeight; // Mede a altura real do seu topo

        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        const maxX = rect.width - novoElemento.offsetWidth;
        const maxY = rect.height - novoElemento.offsetHeight;

        // --- A MÁGICA ACONTECE AQUI ---
        x = Math.max(0, Math.min(x, maxX));
        // O y agora não pode ser menor que a altura do header
        y = Math.max(headerHeight, Math.min(y, maxY)); 

        novoElemento.style.left = x + 'px';
        novoElemento.style.top = y + 'px';
    });

    // Fim do arraste: quando solta o botão do mouse
    document.addEventListener('mouseup', () => {
        isDragging = false;
        novoElemento.style.cursor = 'grab';
    });

    applyElementStyle(novoElemento, type);

    novoElemento.addEventListener("click", (e) => {
        e.stopPropagation();
        selectElement(novoElemento);
    });

    canvas.appendChild(novoElemento); // Coloca o elemento no "palco"
}

function applyElementStyle(el, type) {
    el.style.padding = "15px";
    el.style.margin = "10px";
    el.style.borderRadius = "6px";
    el.style.display = "inline-block";
    el.style.cursor = "pointer";
    el.style.transition = "all 0.3s ease";

    switch (type) {
        case "Botão":
            el.innerText = "BOTÃO NEON";
            el.style.background = "var(--neon-cyan)";
            el.style.color = "#000";
            el.style.fontWeight = "700";
            break;

        case "Card":
            el.innerText = "CONTEÚDO DO CARD";
            el.style.background = "rgba(255,255,255,0.08)";
            el.style.border = "1px solid var(--neon-purple)";
            el.style.color = "#fff";
            break;

        default:
            el.innerText = "TEXTO DA ISTOS AI";
            el.style.color = "#fff";
    }
}

function removePlaceholder() {
    const placeholder = document.querySelector(".placeholder-text");
    if (placeholder) placeholder.remove();
}

/* =====================================================
   SELEÇÃO + PAINEL LATERAL
===================================================== */

function selectElement(el) {
    IstosApp.selectedElement = el;

    document.querySelectorAll(".dropped-element")
        .forEach(item => item.style.boxShadow = "none");

    el.style.boxShadow = "0 0 18px var(--neon-magenta)";

    openEditorPanel(el);
}

function openEditorPanel(el) {
    const panel = document.querySelector(".properties-panel");
    const controls = document.getElementById("controls");
    if (!panel || !controls) return;

    panel.classList.add("active");

    controls.innerHTML = `
        <div class="edit-group">
            <label>Texto</label>
            <input type="text" id="edit-text" value="${el.innerText}">
        </div>

        <div class="edit-group">
            <label>Cor de Fundo</label>
            <input type="color" id="edit-bg" value="${rgbToHex(getComputedStyle(el).backgroundColor)}">
        </div>

        <button class="btn-delete">REMOVER ELEMENTO</button>
    `;

    document.getElementById("edit-text").oninput =
        e => IstosApp.selectedElement.innerText = e.target.value;

    document.getElementById("edit-bg").oninput =
        e => IstosApp.selectedElement.style.backgroundColor = e.target.value;

    document.querySelector(".btn-delete")
        .addEventListener("click", deleteElement);
}

function deleteElement() {
    if (!IstosApp.selectedElement) return;

    IstosApp.selectedElement.remove();
    IstosApp.selectedElement = null;

    const panel = document.querySelector(".properties-panel");
    const controls = document.getElementById("controls");

    if (panel) panel.classList.remove("active");
    if (controls) {
        controls.innerHTML =
            `<p class="no-selection-msg">
                Selecione um item no canvas para editar.
            </p>`;
    }
}

function rgbToHex(rgb) {
    if (!rgb || rgb === "rgba(0, 0, 0, 0)") return "#ffffff";
    const res = rgb.match(/\d+/g).map(x =>
        parseInt(x).toString(16).padStart(2, "0")
    );
    return `#${res[0]}${res[1]}${res[2]}`;
}

/* =====================================================
   FUNDO ESPACIAL + ESTRELAS
===================================================== */

function createStars() {
    const container = document.querySelector(".stars-container");
    if (!container) return;

    for (let i = 0; i < 160; i++) {
        const star = document.createElement("div");
        star.style.position = "absolute";
        star.style.width = "1px";
        star.style.height = "1px";
        star.style.background = "#fff";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.opacity = Math.random();
        container.appendChild(star);
    }

    setInterval(spawnShootingStar, 5000);
}

function spawnShootingStar() {
    const container = document.querySelector(".stars-container");
    if (!container) return;

    const star = document.createElement("div");
    star.className = "star";
    star.style.top = Math.random() * 50 + "%";
    star.style.right = "0";
    star.style.animation = "shooting-star 2s linear forwards";
    container.appendChild(star);

    setTimeout(() => star.remove(), 2000);
}

/* =====================================================
   INICIALIZAÇÃO SEGURA
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    startTypewriter(translations[IstosApp.currentLang].hero);
    createStars();

    const input = document.getElementById("ai-input");
    if (input) {
        input.addEventListener("keypress", e => {
            if (e.key === "Enter") sendMessage();
        });
    }

    const logo = document.getElementById("istos-logo");
    if (logo) {
        logo.addEventListener("click", spawnShootingStar);
    }

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
});
