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

    // Fonction pour afficher les citations aléatoires
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

    // Filtrer les citations par catégorie
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

    // Importer les citations depuis un fichier JSON
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

    // Ajouter un formulaire pour ajouter une citation
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

    // Fonction pour ajouter une citation
    function addQuote() {
        const quoteText = document.getElementById("newQuoteText").value.trim();
        const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (quoteText === "" || quoteCategory === "") {
            alert("Veuillez entrer une citation et une catégorie.");
            return;
        }

        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes();
        showRandomQuote(); // Afficher la nouvelle citation après ajout
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    }

    // Charger les catégories et les citations depuis localStorage
    function loadLastSelectedCategory() {
        const lastCategory = localStorage.getItem("selectedCategory");
        if (lastCategory) {
            categoryFilter.value = lastCategory;
            filterQuotes();
        }
    }

    // Ajouter l'événement d'exportation
    exportQuotesButton.addEventListener("click", exportQuotes);

    // Afficher le formulaire d'ajout de citation quand le bouton est cliqué
    addQuoteButton.addEventListener("click", createAddQuoteForm);

    // Fonction pour récupérer les citations du serveur
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const data = await response.json();
            // Simuler des citations à partir des données du serveur
            return data.map(post => ({
                text: post.title,
                category: "Server"
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des citations du serveur :', error);
            return [];
        }
    }

    // Fonction pour fusionner les citations locales et serveur
    function mergeQuotes(localQuotes, serverQuotes) {
        const mergedQuotes = [...localQuotes];
        serverQuotes.forEach(serverQuote => {
            // Vérifier si la citation existe déjà localement
            const isDuplicate = localQuotes.some(localQuote => localQuote.text === serverQuote.text);
            if (!isDuplicate) {
                mergedQuotes.push(serverQuote);
            }
        });
        return mergedQuotes;
    }

    // Fonction pour synchroniser les citations avec le serveur
    async function syncQuotes() {
        const serverQuotes = await fetchQuotesFromServer();
        const mergedQuotes = mergeQuotes(quotes, serverQuotes);

        // Mettre à jour les citations locales si des changements sont détectés
        if (mergedQuotes.length !== quotes.length) {
            quotes = mergedQuotes;
            saveQuotes();
            showSyncNotification("Les citations ont été mises à jour avec succès depuis le serveur!");
            showRandomQuote(); // Rafraîchir l'affichage
        }
    }

    // Fonction pour afficher une notification
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

    // Synchroniser les citations toutes les 10 secondes
    setInterval(syncQuotes, 10000);

    // Initialisation de l'application
    populateCategories();
    loadLastSelectedCategory();
    showRandomQuote(); // Affiche une citation aléatoire dès le début
});




















