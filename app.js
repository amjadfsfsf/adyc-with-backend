// ADYC Intelligent Chatbot with Perplexity API Integration
class ADYCChatbot {
    constructor() {
        // API Configuration
        this.API_ENDPOINT = 'http://localhost:3000/api/chat';
        this.conversationHistory = [];
        this.isTyping = false;
        this.chatOpen = false;
        
        // Quick reply suggestions
        this.quickReplies = [
            "كيف أخطط لمستقبلي؟",
            "نصائح للزواج",
            "كيف أدخر المال؟",
            "كيف أضع أهدافاً؟",
            "متى أتزوج؟",
            "كيف أستثمر؟"
        ];
        
        this.initializeElements();
        this.setupEventListeners();
        this.showWelcomeMessage();
    this.showQuickReplies();
    }
    
    initializeElements() {
        this.chatContainer = document.getElementById('chatContainer');
        this.chatButton = document.getElementById('chatButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.typingIndicator = document.getElementById('typingIndicator');
    }
    
    setupEventListeners() {
        // Chat input enter key
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize chat input
        this.chatInput.addEventListener('input', () => {
            this.chatInput.style.height = 'auto';
            this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 100) + 'px';
        });
    }
    
  
    showWelcomeMessage() {
    const welcomeMessage = `مرحباً بك في ADYC! 👋

أنا مساعدك الذكي المدعوم من ECA للتخطيط والاستشارات. يمكنني مساعدتك في:

• التخطيط للحياة والمستقبل 🎯
• الاستشارات الأسرية والزواج 👨‍👩‍👧‍👦
• الإدارة المالية والاستثمار 💰
• التطوير الشخصي والمهني 🚀

كيف يمكنني مساعدتك اليوم؟`;

    this.addMessage(welcomeMessage, 'bot');
  }

  showQuickReplies() {
        const quickReplyDiv = document.createElement('div');
        quickReplyDiv.className = 'quick-replies';
        quickReplyDiv.innerHTML = `
            <div class="quick-replies-title">أسئلة سريعة:</div>
            <div class="quick-replies-buttons">
                ${this.quickReplies.map(reply => 
                    `<button class="quick-reply-btn" onclick="chatbot.sendQuickReply('${reply}')">${reply}</button>`
                ).join('')}
            </div>
        `;
        
        setTimeout(() => {
            this.chatMessages.appendChild(quickReplyDiv);
            this.scrollToBottom();
        }, 1000);
    }
    
    sendQuickReply(message) {
        const quickReplies = document.querySelector('.quick-replies');
        if (quickReplies) {
            quickReplies.remove();
        }
        
        this.chatInput.value = message;
        this.sendMessage();
    }
    
    toggleChat() {
        if (this.chatOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.chatContainer.classList.add('open');
        this.chatButton.style.display = 'none';
        this.chatOpen = true;
        this.chatInput.focus();
        this.scrollToBottom();
    }
    
    closeChat() {
        this.chatContainer.classList.remove('open');
        this.chatButton.style.display = 'flex';
        this.chatOpen = false;
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        
        if (!message || this.isTyping) {
            return;
        }
        
        // Add user message to chat
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Call Perplexity API through our server
            const response = await this.callAPI(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error calling API:', error);
            this.hideTypingIndicator();
            this.addMessage('عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.', 'bot');
        }
    }
    
    async callAPI(userMessage) {
        try {
            // Add user message to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage
            });
            
            // Add system context for ADYC chatbot
            const messages = [
                {
                    role: 'system',
                    content: 'أنت مساعد ذكي من ADYC متخصص في تقديم النصائح حول: التخطيط للحياة والمستقبل المهني، تكوين الأسرة والزواج، والجاهزية المالية والادخار. قدم نصائح عملية ومفيدة باللغة العربية.'
                },
                ...this.conversationHistory
            ];
            
            console.log('Sending to API:', messages);
            
            const response = await fetch(this.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            // Extract assistant's reply
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const assistantMessage = data.choices[0].message.content;
                
                // Add assistant response to conversation history
                this.conversationHistory.push({
                    role: 'assistant',
                    content: assistantMessage
                });
                
                return assistantMessage;
            } else {
                throw new Error('Invalid API response format');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
        
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        this.chatSend.disabled = true;
        this.typingIndicator.classList.add('show');
        this.chatMessages.appendChild(this.typingIndicator);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        this.chatSend.disabled = false;
        this.typingIndicator.classList.remove('show');
        if (this.typingIndicator.parentNode === this.chatMessages) {
            this.chatMessages.removeChild(this.typingIndicator);
        }
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    clearChat() {
        const messages = this.chatMessages.querySelectorAll('.message');
        messages.forEach((message, index) => {
            if (index > 0) {
                message.remove();
            }
        });
        
        this.conversationHistory = [];
        setTimeout(() => this.showQuickReplies(), 500);
    }
}

// Initialize chatbot
let chatbot;

document.addEventListener('DOMContentLoaded', () => {
    chatbot = new ADYCChatbot();
});

// Global functions
function toggleChat() {
    if (chatbot) chatbot.toggleChat();
}

function openChat() {
    if (chatbot) chatbot.openChat();
}

function closeChat() {
    if (chatbot) chatbot.closeChat();
}

function sendMessage() {
    if (chatbot) chatbot.sendMessage();
}

function handleInputKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation for service cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
});
