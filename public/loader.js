// In /js/loader.js
document.addEventListener("DOMContentLoaded", function() {
    const CHATBOT_BASE_PATH = '';
    const CHATBOT_HTML_PATH = `${CHATBOT_BASE_PATH}chatbot.html`;
    const CHATBOT_CSS_PATH = `${CHATBOT_BASE_PATH}chatbot.css`;
    const CHATBOT_JS_PATH = `${CHATBOT_BASE_PATH}chatbot.js`;

    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = CHATBOT_CSS_PATH;
    document.head.appendChild(linkElement);

    fetch(CHATBOT_HTML_PATH)
        .then(response => {
            if (!response.ok) throw new Error(`Could not load chatbot HTML: ${response.statusText}`);
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            const scriptElement = document.createElement('script');
            scriptElement.src = CHATBOT_JS_PATH;
            scriptElement.defer = true;
            scriptElement.onload = () => {
                if (typeof window.initChatbot === 'function') {
                    window.initChatbot();
                } else {
                    console.error('Chatbot initialization function not found.');
                }
            };
            document.body.appendChild(scriptElement);
        })
        .catch(error => {
            console.error('Error loading the chatbot:', error);
        });
});
