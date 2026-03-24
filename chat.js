// ═══════════════════════════════════════
// CHAT.JS — Claude AI Integration
// ═══════════════════════════════════════

const chatPanel = document.getElementById('chatPanel');
const chatOverlay = document.getElementById('chatOverlay');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

let isOpen = false;
let isLoading = false;
const history = [];

// ── Open / Close ──
function openChat() {
  isOpen = true;
  chatPanel.classList.add('open');
  chatOverlay.classList.add('open');
  document.getElementById('chatBubble').style.display = 'none';
  setTimeout(() => chatInput.focus(), 400);
}

function closeChat() {
  isOpen = false;
  chatPanel.classList.remove('open');
  chatOverlay.classList.remove('open');
  document.getElementById('chatBubble').style.display = 'flex';
}

// ── Ask with pre-filled prompt ──
function askClaude(prompt) {
  openChat();
  setTimeout(() => {
    chatInput.value = prompt;
    sendMessage();
  }, 500);
}

// ── Add message bubble ──
function addMsg(role, content) {
  // Remove suggestions on first user message
  const sugg = document.getElementById('chatSuggestions');
  if (sugg && role === 'user') sugg.remove();

  const div = document.createElement('div');
  div.className = `msg msg-${role === 'user' ? 'user' : 'ai'}`;

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = formatMsg(content);
  div.appendChild(bubble);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

function formatMsg(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,.08);padding:2px 6px;border-radius:4px;font-size:.85em">$1</code>')
    .replace(/\n/g, '<br/>');
}

// ── Typing indicator ──
function showTyping() {
  const div = document.createElement('div');
  div.className = 'msg msg-ai msg-typing';
  div.id = 'typingIndicator';
  div.innerHTML = `<div class="msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

// ── Send message ──
async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || isLoading) return;

  chatInput.value = '';
  isLoading = true;
  sendBtn.disabled = true;

  addMsg('user', text);
  history.push({ role: 'user', content: text });

  showTyping();

  try {
    const systemPrompt = `Tu es Claude, un tuteur IA intégré dans un site web dédié à l'apprentissage de l'intelligence artificielle. 
Tu aides les visiteurs du site à apprendre l'IA de façon progressive, bienveillante et pédagogique.
Le site présente un parcours en 6 phases : Fondations, Python & Maths, Machine Learning, Deep Learning, LLMs & Prompt Engineering, Agents & Projets réels.
Réponds toujours en français. Sois concis, chaleureux, et adapte ton niveau au débutant sauf si l'utilisateur montre des connaissances avancées.
Utilise des analogies concrètes. Suggère des ressources pratiques quand c'est pertinent.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: history
      })
    });

    const data = await response.json();
    hideTyping();

    const reply = data.content?.[0]?.text || "Désolé, je n'ai pas pu répondre. Réessayez !";
    addMsg('ai', reply);
    history.push({ role: 'assistant', content: reply });

  } catch (err) {
    hideTyping();
    addMsg('ai', "⚠️ Une erreur s'est produite. Vérifiez votre connexion et réessayez.");
    console.error(err);
  }

  isLoading = false;
  sendBtn.disabled = false;
  chatInput.focus();
}

// ── Keyboard shortcut ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && isOpen) closeChat();
});
