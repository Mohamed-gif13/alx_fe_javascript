document.addEventListener("DOMContentLoaded", () => {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "La meilleure façon de prédire l’avenir est de l’inventer.", category: "Motivation" },
        { text: "Fais ce que tu peux, avec ce que tu as, là où tu es.", category: "Inspiration" },
        { text: "Le bonheur dépend de nous.", category: "Philosophie" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const categoryFilter = document.getElementById("categoryFilter");
    const exportQuotesButton = document.getElementById("exportQuotes");
    const addQuoteButton = document.getElementById("addQuoteButton");

    // Fonction pour peupler dynamiquement les catégories
    function populateCategories() {
        const categories = new Set(quotes.map(quote => quote.category));
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Fonction pour afficher une citation aléatoire
    function showRandomQuote() {
        const selectedCategory = categoryFilter.value;
        let filteredQuotes = quotes;

        if (selectedCategory !== "all") {
            filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];

        quoteDisplay.innerHTML = `<p><strong>${randomQuote.category}:</strong> ${randomQuote.text}</p>`;
    }

    // Fonction pour filtrer les citations
    function filterQuotes() {
        showRandomQuote(); 
        localStorage.setItem("selectedCategory", categoryFilter.value);
    }

    // Sauvegarder les citations dans localStorage
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    // Exporter les citations en JSON
    function exportQuotes() {
        const quotesJSON = JSON.stringify(quotes, null, 2);
        const blob = new Blob([quotesJSON], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "quotes.json";
        link.click();
    }

    // Fonction pour importer les citations depuis un fichier JSON
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Créer un formulaire pour ajouter une citation
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

    // Ajouter une citation
    function addQuote() {
        const quoteText = document.getElementById("newQuoteText").value.trim();
        const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (quoteText === "" || quoteCategory === "") {
            alert("Veuillez entrer une citation et une catégorie.");
            return;
        }

        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes();
        showRandomQuote();
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    }

    // Charger la catégorie sélectionnée
    function loadLastSelectedCategory() {
        const lastCategory = localStorage.getItem("selectedCategory");
        if (lastCategory) {
            categoryFilter.value = lastCategory;
            filterQuotes();
        }
    }

    // Fonction de synchronisation des citations avec le serveur
    async function fetchQuotesFromServer() {
        try {
            // Simulation d'une requête POST pour envoyer des données
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: "POST", // Méthode POST
                headers: {
                    "Content-Type": "application/json", // Définition du type de contenu
                },
                body: JSON.stringify({
                    title: "Nouvelle citation", // Exemple de titre (correspond à la citation)
                    body: "Ceci est une citation inspirante.", // Corps de la citation
                    userId: 1 // ID utilisateur simulé
                })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi des données');
            }

            const data = await response.json();

            // Ajouter des citations simulées du serveur
            const serverQuotes = [{
                text: data.title, // Utilisation du "title" comme citation
                category: "Inspiration"
            }];

            quotes.push(...serverQuotes); // Ajouter les citations du serveur à notre liste
            saveQuotes();
            showSyncNotification("Les citations ont été mises à jour avec succès depuis le serveur!");
        } catch (error) {
            console.error('Erreur lors de la récupération des citations :', error);
        }
    }

    // Affichage d'une notification de synchronisation
    function showSyncNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = '#fff';
        notification.style.padding = '10px';
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.borderRadius = '5px';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Synchronisation toutes les 10 secondes
    setInterval(fetchQuotesFromServer, 10000);

    // Ajout des événements
    exportQuotesButton.addEventListener("click", exportQuotes);
    addQuoteButton.addEventListener("click", createAddQuoteForm);

    // Initialisation
    populateCategories();
    loadLastSelectedCategory();
    showRandomQuote();
});


















