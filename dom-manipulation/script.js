document.addEventListener("DOMContentLoaded", () => {
    let quotes = [
        { text: "La meilleure façon de prédire l’avenir est de l’inventer.", category: "Motivation" },
        { text: "Fais ce que tu peux, avec ce que tu as, là où tu es.", category: "Inspiration" },
        { text: "Le bonheur dépend de nous.", category: "Philosophie" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");

    // Charger les citations depuis le localStorage si disponible
    function loadQuotes() {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            quotes = JSON.parse(storedQuotes);
        }
        showRandomQuote(); // Afficher une citation aléatoire après le chargement
    }

    // Sauvegarder les citations dans le localStorage
    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Afficher une citation aléatoire
    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p><strong>${quote.category}:</strong> ${quote.text}</p>`;
        saveLastViewedQuote(quote.text); // Sauvegarder la dernière citation vue dans sessionStorage
    }

    // Sauvegarder la dernière citation vue dans sessionStorage
    function saveLastViewedQuote(quoteText) {
        sessionStorage.setItem('lastViewedQuote', quoteText);
    }

    // Charger la dernière citation vue depuis sessionStorage
    function loadLastViewedQuote() {
        const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
        if (lastViewedQuote) {
            alert(`Dernière citation vue: ${lastViewedQuote}`);
        }
    }

    // Ajouter une nouvelle citation
    function addQuote() {
        const quoteText = document.getElementById("newQuoteText").value.trim();
        const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (quoteText === "" || quoteCategory === "") {
            alert("Veuillez entrer une citation et une catégorie.");
            return;
        }

        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes(); // Sauvegarder les citations après ajout
        showRandomQuote(); // Afficher une citation aléatoire après ajout
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    }

    // Exporter les citations au format JSON
    function exportToJson() {
        const jsonBlob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
        const url = URL.createObjectURL(jsonBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Importer des citations depuis un fichier JSON
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes); // Ajouter les citations importées
            saveQuotes(); // Sauvegarder les citations après importation
            alert('Citations importées avec succès!');
            showRandomQuote(); // Afficher une citation aléatoire après importation
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Créer le formulaire d'ajout de citation
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

    // Ajouter le bouton pour exporter les citations en JSON
    function createExportButton() {
        const exportButton = document.createElement("button");
        exportButton.textContent = "Exporter les citations en JSON";
        exportButton.addEventListener("click", exportToJson);
        document.body.appendChild(exportButton);
    }

    // Ajouter le champ de fichier pour importer des citations
    function createImportFileInput() {
        const importFileInput = document.createElement("input");
        importFileInput.type = "file";
        importFileInput.accept = ".json";
        importFileInput.addEventListener("change", importFromJsonFile);
        document.body.appendChild(importFileInput);
    }

    // Charger les citations et la dernière citation vue au démarrage
    loadQuotes();
    loadLastViewedQuote(); // Vérifier si une citation a été vue pendant la session précédente
    createAddQuoteForm();
    createExportButton();
    createImportFileInput();
});


