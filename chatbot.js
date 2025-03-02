document.addEventListener("DOMContentLoaded", function() {
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotBox = document.getElementById("chatbot-box");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const chatbotSend = document.getElementById("chatbot-send");

    chatbotToggle.addEventListener("click", function() {
        chatbotBox.classList.toggle("active");
    });

    chatbotSend.addEventListener("click", function() {
        let message = chatbotInput.value.trim();
        if (message !== "") {
            chatbotMessages.innerHTML += `<p class="user-message">${message}</p>`;
            setTimeout(() => chatbotMessages.innerHTML += `<p class="bot-message">I'm here to help! Ask me anything.</p>`, 1000);
            chatbotInput.value = "";
        }
    });
});
