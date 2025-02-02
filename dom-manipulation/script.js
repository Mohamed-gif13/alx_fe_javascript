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

    // Sauvegarder les citations dans localStorage
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    // Fonction pour synchroniser les citations avec le serveur
    async function syncQuotes() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'GET', // Méthode GET pour récupérer les données
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des citations');
            }

            const serverQuotes = await response.json();
            const latestQuote = serverQuotes[0]; // Simuler une seule citation venant du serveur

            // Vérification de conflit (par exemple, si le texte est différent)
            const conflictingQuote = quotes.find(quote => quote.text !== latestQuote.title);
            if (conflictingQuote) {
                // Résolution automatique du conflit : on choisit la citation du serveur
                quotes = quotes.filter(quote => quote.text !== conflictingQuote.text);
                quotes.push({ text: latestQuote.title, category: "Inspiration" });
                showSyncNotification("Les citations ont été mises à jour avec succès depuis le serveur !");
            } else {
                // Si pas de conflit, ajouter ou mettre à jour la citation
                quotes.push({ text: latestQuote.title, category: "Inspiration" });
                showSyncNotification("Aucune modification nécessaire, les citations sont à jour.");
            }

            saveQuotes(); // Sauvegarder les citations mises à jour
            showRandomQuote(); // Afficher une citation mise à jour
        } catch (error) {
            console.error('Erreur lors de la synchronisation des citations :', error);
        }
    }

    // Afficher une notification après la synchronisation
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
    setInterval(syncQuotes, 10000); // Vérifier les mises à jour toutes les 10 secondes

    // Initialisation de l'application
    populateCategories();
    showRandomQuote(); // Affiche une citation aléatoire dès le début
});




















