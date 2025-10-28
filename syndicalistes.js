console.log("Le fichier JavaScript est bien chargé");

document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search-input");
    const suggestionsContainer = document.getElementById("suggestions");
    const searchButton = document.getElementById("search-button");
    const suggestionLinks = Array.from(suggestionsContainer.getElementsByTagName("a"));
    let selectedSuggestionIndex = -1; // Index de la suggestion sélectionnée

    searchInput.addEventListener("input", function() {
        const query = removeAccents(searchInput.value.trim().toLowerCase());

        if (query === "") {
            suggestionsContainer.style.display = "none";
            return;
        }

        getSuggestions(query).then(suggestions => {
            displaySuggestions(suggestions);
        });
    });

    searchInput.addEventListener("keydown", function(event) {
        const suggestions = suggestionsContainer.getElementsByTagName("a");
        
        if (event.key === "ArrowDown") {
            event.preventDefault();
            selectedSuggestionIndex = (selectedSuggestionIndex + 1) % suggestions.length;
            updateSuggestionHighlight(suggestions);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            selectedSuggestionIndex = (selectedSuggestionIndex - 1 + suggestions.length) % suggestions.length;
            updateSuggestionHighlight(suggestions);
        } else if (event.key === "Enter") {
            if (selectedSuggestionIndex >= 0 && suggestions.length > 0) {
                event.preventDefault();
                const selectedLink = suggestions[selectedSuggestionIndex];
                if (selectedLink) {
                    window.open(selectedLink.href, '_blank');
                    suggestionsContainer.style.display = "none";
                }
            }
        }
    });

    searchButton.addEventListener("click", function() {
        const query = searchInput.value.trim();
        if (query) {
            console.log("Recherche pour : " + query);
            // Tu peux ici ajouter une redirection ou une action
        }
    });

    function displaySuggestions(suggestions) {
        suggestionsContainer.innerHTML = "";
        suggestions.forEach(suggestion => {
            const suggestionLink = document.createElement("a");
            suggestionLink.href = suggestion.href;
            suggestionLink.textContent = suggestion.text;
            suggestionLink.target = "_blank";
            suggestionLink.style.display = "block";
            suggestionLink.style.padding = "12px 20px";
            suggestionLink.style.fontSize = "16px";
            suggestionLink.style.color = "#333";
            suggestionLink.style.textDecoration = "none";
            suggestionLink.style.cursor = "pointer";
            suggestionLink.addEventListener("mouseover", () => {
                suggestionLink.style.backgroundColor = "#f0f0f0";
            });
            suggestionLink.addEventListener("mouseout", () => {
                suggestionLink.style.backgroundColor = "white";
            });
            suggestionLink.addEventListener("click", function(event) {
                event.preventDefault();
                window.open(suggestionLink.href, '_blank');
                suggestionsContainer.style.display = "none";
            });
            suggestionsContainer.appendChild(suggestionLink);
        });
        selectedSuggestionIndex = -1;
        suggestionsContainer.style.display = suggestions.length > 0 ? "block" : "none";
    }

    async function getSuggestions(query) {
        const suggestions = suggestionLinks.map(link => ({
            href: link.href,
            text: link.textContent
        }));

        return suggestions.filter(suggestion =>
            removeAccents(suggestion.text.toLowerCase()).includes(query)
        );
    }

    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function updateSuggestionHighlight(suggestions) {
        for (let i = 0; i < suggestions.length; i++) {
            suggestions[i].style.backgroundColor = "white";
        }
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
            suggestions[selectedSuggestionIndex].style.backgroundColor = "#f0f0f0";
        }
    }

    document.addEventListener("click", function(e) {
        if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
            suggestionsContainer.style.display = "none";
        }
    });
});
