// In /chatbot/chatbot.js
window.initChatbot = () => {
    // --- DOM Element Selection ---
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const chatbox = document.querySelector(".chatbox");
    const tabsContainer = document.querySelector(".chat-header-tabs");
    const tabPanelsContainer = document.querySelector(".tab-panels");
    const contactForm = document.getElementById("contact-form");
    const chatInputContainer = document.querySelector(".chat-input");

    // Safety check to ensure all elements exist before proceeding
    if (!chatbotToggler || !chatbox || !tabsContainer || !tabPanelsContainer || !contactForm || !chatInputContainer) {
        console.error("Chatbot initialization failed: One or more essential DOM elements are missing.");
        return;
    }

    const API_URL = "https://script.google.com/macros/s/AKfycbwbfuY9bA5IV7Reg5UpatmEzCAebm0P5McIiRqkJqMmSH6UzMAAUEO3DMx7wxxH4e7y/exec"; // PASTE YOUR URL HERE
    let allFaqs = [];

    // --- Core UI Functions ---
    const displayTopics = () => {
        chatbox.innerHTML = "";
        const welcomeMessage = `Hi there! 👋<br>I'm the GGPC Assistant. Please select a topic to see frequently asked questions.`;
        chatbox.appendChild(createChatLi(welcomeMessage, "incoming"));
        const topics = [...new Set(allFaqs.map(faq => faq.topic))];
        const topicButtons = document.createElement("div");
        topicButtons.className = "quick-replies";
        topics.forEach(topic => {
            topicButtons.innerHTML += `<button class="quick-reply" data-action="select-topic" data-value="${topic}">${topic}</button>`;
        });
        chatbox.appendChild(topicButtons);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    };

    const displayQuestionsForTopic = (topic) => {
        chatbox.innerHTML = "";
        const headerMessage = `You selected: <strong>${topic}</strong><br>Please choose a question below.`;
        chatbox.appendChild(createChatLi(headerMessage, "incoming"));
        const questions = allFaqs.filter(faq => faq.topic === topic);
        const questionButtons = document.createElement("div");
        questionButtons.className = "quick-replies";
        questions.forEach(faq => {
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.dataset.action = 'select-question';
            button.textContent = faq.question;
            questionButtons.appendChild(button);
        });
        questionButtons.innerHTML += `<button class="quick-reply action-btn" data-action="go-back">⬅️ Go Back to Topics</button>`;
        chatbox.appendChild(questionButtons);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    };

    const handleQuestionSelection = (questionText) => {
        chatbox.innerHTML = "";
        chatbox.appendChild(createChatLi(questionText, "outgoing"));
        const thinkingLi = createChatLi("...", "incoming");
        chatbox.appendChild(thinkingLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        const faq = allFaqs.find(f => f.question === questionText);
        setTimeout(() => {
            thinkingLi.querySelector("p").innerHTML = faq ? faq.answer : "Sorry, I could not find an answer for that.";
            chatbox.appendChild(createFinalOptionsButtons());
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }, 600);
    };

    // --- Helper Functions ---
    const createChatLi = (message, className) => {
        const li = document.createElement("li");
        li.className = `chat ${className}`;
        li.innerHTML = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        li.querySelector("p").innerHTML = message;
        return li;
    };

    const createFinalOptionsButtons = () => {
        const finalButtons = document.createElement("div");
        finalButtons.className = "quick-replies";
        finalButtons.innerHTML = `<button class="quick-reply" data-action="go-back">Ask Another Question</button>`;
        return finalButtons;
    };

    // --- Event Listeners ---
    chatbox.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const action = e.target.dataset.action;
            const value = e.target.dataset.value;
            if (action === "select-topic") displayQuestionsForTopic(value);
            else if (action === "select-question") handleQuestionSelection(e.target.textContent);
            else if (action === "go-back") displayTopics();
        }
    });
    
    tabsContainer.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON" && !e.target.classList.contains('active')) {
            tabsContainer.querySelector(".tab-btn.active").classList.remove("active");
            e.target.classList.add("active");
            const tabId = e.target.getAttribute("data-tab");
            tabPanelsContainer.querySelector(".tab-content.active").classList.remove("active");
            document.getElementById(tabId).classList.add("active");
        }
    });

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const formStatus = contactForm.querySelector(".form-status");
        const submitButton = contactForm.querySelector("button");
        formStatus.textContent = "Sending...";
        submitButton.disabled = true;
        fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "contact",
                subject: formData.get("subject"),
                name: formData.get("name"),
                email: formData.get("email"),
                message: formData.get("message"),
            })
        }).then(res => res.json()).then(data => {
            if (!data.success) throw new Error(data.error || "Unknown error");
            formStatus.textContent = data.message;
            formStatus.style.color = "green";
            contactForm.reset();
        }).catch((error) => {
            console.error("Form submission error:", error);
            formStatus.textContent = "Failed to send message. Please try again.";
            formStatus.style.color = "red";
        }).finally(() => {
            submitButton.disabled = false;
            setTimeout(() => { formStatus.textContent = ""; }, 5000);
        });
    });

    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
    
    // --- Initialization ---
    const fetchFaqsAndInit = () => {
        const loadingLi = createChatLi("Loading knowledge base...", "incoming");
        chatbox.appendChild(loadingLi);
        fetch(API_URL).then(res => res.json()).then(data => {
            if (data.success && Array.isArray(data.data)) {
                allFaqs = data.data;
                displayTopics();
            } else { throw new Error(data.error || "Failed to load FAQs."); }
        }).catch(error => {
            console.error(error);
            loadingLi.querySelector("p").textContent = "Error: Could not load the knowledge base. Please try again later.";
        });
    };
    
    chatInputContainer.classList.add("hidden");
    fetchFaqsAndInit();
};