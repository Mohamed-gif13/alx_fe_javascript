document.addEventListener("DOMContentLoaded", () => {
    const quotes = [
        { text: "La meilleure façon de prédire l’avenir est de l’inventer.", category: "Motivation" },
        { text: "Fais ce que tu peux, avec ce que tu as, là où tu es.", category: "Inspiration" },
        { text: "Le bonheur dépend de nous.", category: "Philosophie" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> ${quote.text}</p>`;
    }

    function createAddQuoteForm() {
        const formContainer = document.createElement("div");

        const inputText = document.createElement("input");
        inputText.id = "newQuoteText";
        inputText.type = "text";
        inputText.placeholder = "Entrez une nouvelle citation";

        const inputCategory = document.createElement("input");
        inputCategory.id = "newQuoteCategory";
        inputCategory.type = "text";
        inputCategory.placeholder = "Entrez la catégorie de la citation";

        const addButton = document.createElement("button");
        addButton.textContent = "Ajouter la citation";
        addButton.addEventListener("click", addQuote);

        formContainer.appendChild(inputText);
        formContainer.appendChild(inputCategory);
        formContainer.appendChild(addButton);

        document.body.appendChild(formContainer);
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

    showRandomQuote(); // Afficher une citation au chargement de la page
    createAddQuoteForm(); // Ajouter dynamiquement le formulaire
});

