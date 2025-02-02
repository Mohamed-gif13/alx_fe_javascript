// Simulated API endpoint (using JSONPlaceholder for the purpose of this task)
const apiEndpoint = "https://jsonplaceholder.typicode.com/posts";


// Array to store quotes (each quote has text and category)
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "Simplicity is the ultimate sophistication.", category: "Design" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// Function to show a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.innerHTML = `<p>${quotes[randomIndex].text} - <strong>${quotes[randomIndex].category}</strong></p>`;

    // Save the last viewed quote to sessionStorage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quotes[randomIndex]));
}

// Function to create and display the add quote form
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuoteButton">Add Quote</button>
    `;
    
    // Append the form to the body
    document.body.appendChild(formContainer);
  
    // Add event listener to the Add Quote button
    document.getElementById('addQuoteButton').addEventListener('click', addQuote);
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    // Add new quote to the array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Save updated quotes to localStorage
    saveQuotes();

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
}

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to export quotes to a JSON file
function exportToJson() {
    const quotesJson = JSON.stringify(quotes, null, 2);
    const blob = new Blob([quotesJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    link.click();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);  // Add new quotes to existing quotes
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Initialize the form and random quote on page load
window.onload = function() {
    createAddQuoteForm();

    // Display last viewed quote from sessionStorage if available
    if (sessionStorage.getItem('lastViewedQuote')) {
        const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
        document.getElementById('quoteDisplay').innerHTML = `"${lastViewedQuote.text}" - ${lastViewedQuote.category}`;
    } else {
        showRandomQuote();
    }
};

// Function to show quotes based on category
function showQuotes(category = 'all') {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ''; // Clear current quotes

    // Filter quotes based on category
    const filteredQuotes = category === 'all' ? quotes : quotes.filter(quote => quote.category === category);
    
    // Display filtered quotes
    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement('p');
        quoteElement.innerHTML = `${quote.text} - <strong>${quote.category}</strong>`;
        quoteDisplay.appendChild(quoteElement);
    });
}


// Function to populate the category dropdown
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories

    // Clear the current categories
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Add each category as an option
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Save the last selected filter to localStorage
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;

    // Show the quotes based on the selected category
    showQuotes(lastSelectedCategory);
}

// Function to filter quotes based on category selection
function filterQuotes() {
    const categoryFilter = document.getElementById("categoryFilter");
    const selectedCategory = categoryFilter.value;

    // Save the selected category to localStorage
    localStorage.setItem('lastSelectedCategory', selectedCategory);

    // Show quotes for the selected category
    showQuotes(selectedCategory);
}

// Initialize the form and quotes on page load
window.onload = function() {
    createAddQuoteForm();
    populateCategories();
};

// Function to sync data with the server
async function syncWithServer() {
    try {
        // Simulate fetching data from the server (get all quotes)
        const response = await fetch(apiEndpoint);
        const serverQuotes = await response.json();
        
        // Conflict resolution: Check if local quotes are different from server quotes
        const localQuotesText = quotes.map(quote => quote.text).join(',');
        const serverQuotesText = serverQuotes.map(quote => quote.title).join(',');

        if (localQuotesText !== serverQuotesText) {
            // If there's a discrepancy, notify the user and resolve conflict by server data
            alert("Data conflict detected! Resolving by using server data.");
            quotes = serverQuotes.map(quote => ({
                text: quote.title, 
                category: "General" // Default category for demo purposes
            }));
            
            // Save the updated quotes to localStorage
            localStorage.setItem('quotes', JSON.stringify(quotes));
        }

        // Update the UI to reflect the latest synced quotes
        showQuotes();

    } catch (error) {
        console.error("Error syncing with server:", error);
    }
}

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to show quotes (updated version for conflict resolution)
function showQuotes() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ''; // Clear current quotes

    // Display all quotes
    quotes.forEach(quote => {
        const quoteElement = document.createElement('p');
        quoteElement.innerHTML = `${quote.text} - <strong>${quote.category}</strong>`;
        quoteDisplay.appendChild(quoteElement);
    });
}

// Function to handle adding new quotes
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    // Add new quote to the array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Save the updated quotes to localStorage
    saveQuotes();

    // Display the updated quotes
    showQuotes();
}

// Function to periodically sync with the server every 30 seconds
setInterval(syncWithServer, 30000);

// Initialize quotes display when the page loads
window.onload = function() {
    showQuotes();
    syncWithServer(); // Sync data immediately on load
};

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        // Fetch data from the mock server (JSONPlaceholder)
        const response = await fetch(apiEndpoint);
        const serverQuotes = await response.json();

        // Convert server data to the required format (if necessary)
        return serverQuotes.map(quote => ({
            text: quote.title,  // Using title as quote text for this mock
            category: "General" // Default category for demo purposes
        }));
    } catch (error) {
        console.error("Error fetching quotes from the server:", error);
        return []; // Return empty array in case of an error
    }
}

// Function to post quotes to the server (send data)
async function postQuotesToServer() {
    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",  // Specify POST method
            headers: {
                "Content-Type": "application/json"  // Specify that we are sending JSON data
            },
            body: JSON.stringify(quotes)  // Send the quotes array as JSON
        });

        const result = await response.json();
        console.log("Server Response:", result);
        alert("Quotes successfully synced with server!");
    } catch (error) {
        console.error("Error posting quotes to the server:", error);
        alert("Error syncing quotes with the server.");
    }
}


// Function to sync data with the server
async function syncWithServer() {
    try {
        const serverQuotes = await fetchQuotesFromServer();

        // Conflict resolution: Check if local quotes are different from server quotes
        const localQuotesText = quotes.map(quote => quote.text).join(',');
        const serverQuotesText = serverQuotes.map(quote => quote.text).join(',');

        if (localQuotesText !== serverQuotesText) {
            alert("Data conflict detected! Resolving by using server data.");
            quotes = serverQuotes;

            // Save the updated quotes to localStorage
            localStorage.setItem('quotes', JSON.stringify(quotes));
        }

        // Update the UI to reflect the latest synced quotes
        showQuotes();

        // After syncing, post the quotes back to the server
        postQuotesToServer();

    } catch (error) {
        console.error("Error syncing with server:", error);
    }
}


// Function to post quotes to the server (send data)
async function postQuotesToServer() {
    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",  // Specify POST method
            headers: {
                "Content-Type": "application/json"  // Specify that we are sending JSON data
            },
            body: JSON.stringify(quotes)  // Send the quotes array as JSON
        });

        const result = await response.json();
        console.log("Server Response:", result);
        alert("Quotes successfully synced with server!");
    } catch (error) {
        console.error("Error posting quotes to the server:", error);
        alert("Error syncing quotes with the server.");
    }
}

// Function to sync quotes with the server
async function syncQuotes() {
    try {
        // Fetch the server's latest quotes
        const serverQuotes = await fetchQuotesFromServer();

        // Conflict resolution: Compare local and server quotes
        const localQuotesText = quotes.map(quote => quote.text).join(',');
        const serverQuotesText = serverQuotes.map(quote => quote.text).join(',');

        // If there are conflicts (text differs), alert and resolve by using server data
        if (localQuotesText !== serverQuotesText) {
            alert("Data conflict detected! Resolving by using server data.");
            quotes = serverQuotes;

            // Save the updated quotes to localStorage
            localStorage.setItem('quotes', JSON.stringify(quotes));
        }

        // Update the UI to reflect the latest synced quotes
        showQuotes();

        // After syncing, post the quotes back to the server
        postQuotesToServer();

    } catch (error) {
        console.error("Error syncing with server:", error);
    }
}

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}


// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(apiEndpoint);
        const serverQuotes = await response.json();

        // Convert server data to the required format (if necessary)
        return serverQuotes.map(quote => ({
            text: quote.title,  // Using title as quote text for this mock
            category: "General" // Default category for demo purposes
        }));
    } catch (error) {
        console.error("Error fetching quotes from the server:", error);
        return []; // Return empty array in case of an error
    }
}

// Function to post quotes to the server (send data)
async function postQuotesToServer() {
    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",  // Specify POST method
            headers: {
                "Content-Type": "application/json"  // Specify that we are sending JSON data
            },
            body: JSON.stringify(quotes)  // Send the quotes array as JSON
        });

        const result = await response.json();
        console.log("Server Response:", result);
        alert("Quotes successfully synced with server!"); // Success message
    } catch (error) {
        console.error("Error posting quotes to the server:", error);
        alert("Error syncing quotes with the server.");
    }
}

// Function to sync quotes with the server
async function syncQuotes() {
    try {
        // Fetch the server's latest quotes
        const serverQuotes = await fetchQuotesFromServer();

        // Conflict resolution: Compare local and server quotes
        const localQuotesText = quotes.map(quote => quote.text).join(',');
        const serverQuotesText = serverQuotes.map(quote => quote.text).join(',');

        // If there are conflicts (text differs), alert and resolve by using server data
        if (localQuotesText !== serverQuotesText) {
            alert("Data conflict detected! Resolving by using server data.");
            quotes = serverQuotes;

            // Save the updated quotes to localStorage
            localStorage.setItem('quotes', JSON.stringify(quotes));
        }

        // Update the UI to reflect the latest synced quotes
        showQuotes();

        // After syncing, post the quotes back to the server
        postQuotesToServer();

        // Display success message
        alert("Quotes synced with server!");

    } catch (error) {
        console.error("Error syncing with server:", error);
    }
}

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to show quotes (updated version for conflict resolution)
function showQuotes() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ''; // Clear current quotes

    // Display all quotes
    quotes.forEach(quote => {
        const quoteElement = document.createElement('p');
        quoteElement.innerHTML = `${quote.text} - <strong>${quote.category}</strong>`;
        quoteDisplay.appendChild(quoteElement);
    });
}

// Function to handle adding new quotes
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    // Add new quote to the array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Save the updated quotes to localStorage
    saveQuotes();

    // Display the updated quotes
    showQuotes();
}

// Function to periodically sync with the server every 30 seconds
setInterval(syncQuotes, 30000);

// Initialize quotes display when the page loads
window.onload = function() {
    showQuotes();
    syncQuotes(); // Sync data immediately on load
};


















