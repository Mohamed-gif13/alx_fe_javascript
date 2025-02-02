document.addEventListener("DOMContentLoaded", () => {
    const quotes = [
        { text: "La meilleure façon de prédire l’avenir est de l’inventer.", category: "Motivation" },
        { text: "Fais ce que tu peux, avec ce que tu as, là où tu es.", category: "Inspiration" },
        { text: "Le bonheur dépend de nous.", category: "Philosophie" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteBtn = document.getElementById("addQuote");

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> ${quote.text}</p>`;
    }

    function addQuote() {
        const quoteText = document.getElementById("newQuoteText").value.trim();
        const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (quoteText === "" || quoteCategory === "") {
            alert("Veuillez entrer une citation et une catégorie.");
            return;
        }

        quotes.push({ text: quoteText, category: quoteCategory });
        showRandomQuote();
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    }

    newQuoteBtn.addEventListener("click", showRandomQuote);
    addQuoteBtn.addEventListener("click", addQuote);

    showRandomQuote(); // Afficher une citation au chargement de la page
});
