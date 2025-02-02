document.addEventListener("DOMContentLoaded", () => {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "La meilleure façon de prédire l’avenir est de l’inventer.", category: "Motivation" },
        { text: "Fais ce que tu peux, avec ce que tu as, là où tu es.", category: "Inspiration" },
        { text: "Le bonheur dépend de nous.", category: "Philosophie" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const categoryFilter = document.getElementById("categoryFilter");
    const exportQuotesButton = document.getElementById("exportQuotes");

    // Fonction pour peupler dynamiquement les catégories
    function populateCategories() {
        const categories = new Set(quotes.map(quote => quote.category)); // Utilisation de map pour extraire les catégories uniques
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Fonction pour afficher les citations
    function showQuotes(filteredQuotes) {
        quoteDisplay.innerHTML = "";
        filteredQuotes.forEach(quote => {
            quoteDisplay.innerHTML += `<p><strong>${quote.category}:</strong> ${quote.text}</p>`;
        });
    }

    // Filtrer les citations par catégorie
    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        let filteredQuotes = quotes;

        if (selectedCategory !== "all") {
            filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        }

        showQuotes(filteredQuotes);
        localStorage.setItem("selectedCategory", selectedCategory);
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

    // Initialisation de l'application
    populateCategories();
    loadLastSelectedCategory();
    filterQuotes();
});






