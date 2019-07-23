document.addEventListener('DOMContentLoaded', ()=> {

    ////// CALLBACK FUNCTIONS -- All of these are called after a fetch made by functions defined in the Adapter.js file.

    // This callback function takes the list of quotes returned by our API and renders it to the DOM and is called on the getQuotes function in our adapter. 
    // (Only called on initial render. If you feel like reloading all the data after everything the user does, this can also be passed as the callback for every fetch request used in this lab.)
    function renderQuotes(quotes){
        document.getElementById("quote-list").innerHTML = quotes.map(quote => renderQuote(quote)).join(" ")
    }

    // This callback function gets called after the POST request we make to add a quote (the code for which is written in the adapter)
    function addQuoteFromPost(quote){
        quote.likes = []
        document.getElementById("quote-list").innerHTML += renderQuote(quote)
    }
    
    // This helper function takes an individual quote object and turns it into an li. Called on the initial render and whenever we post a quote.
    function renderQuote(quote){
        return ` <li class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button data-like-id=${quote.id} class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
          <button data-delete-id=${quote.id} class='btn-danger'>Delete</button>
        </blockquote>
      </li>`
    }

    // This callback function renders likes given a quote's ID (It is called after submitting the fetch)
    function addLikeById(quoteId){
        button = document.querySelector(`[data-like-id="${quoteId}"]`)
        // The parseInt portion simply steals the number of likes from the string "Likes: 15" or whatever. 
        // It would probably be easier to simply make a data-likes=quotes.likes.length in the renderQuote method above and then pull from the dataset here. 
        // But this is fun too.
        button.innerText = `Likes: ${parseInt(button.innerText.split(": ")[1])+1}`
    }
    
    // This callback function optimistically removes a quote (It is called after submitting the fetch)
    function removeQuoteById(id){
        // removes the parent element (the li) of the parent element (the quoteblock) of the delete button
        document.querySelector(`[data-delete-id='${id}']`).parentElement.parentElement.remove()
    }
    

    // On submit button click, submits with the relevant data to my adapter's postQuote function, and includes my callback function to add a quote to the DOM. 
    // Then it clears the form.
    function postQuote(e){
        e.preventDefault()
        quote = document.getElementById("new-quote").value
        author = document.getElementById("author").value
        adapter.postQuote(quote, author, addQuoteFromPost)
        document.getElementById("new-quote").value = ""
        document.getElementById("author").value = ""
    }

    ////// DOM functions - Click handler, event listener, and initial render calls.

    // Handles clicks and, in the case of a click of the like button or the delete button, calls their relevant adapter function, passing through a callback with the id preloaded.
    function handleClick(e){
        switch (e.target.classList[0]){
            case "btn-success":
                // For like and delete, I've loaded up the id in two different ways. In this case (like), I know the API is going to return the relevant quote object on a success, which has a quoteId.
                // When I pass through the callback function (quoteObject) => addLikeById(quote.quoteId)) and call it in the second .then, the response from the fetch is passed to it as an argument.
                adapter.likeQuote(parseInt(e.target.dataset.likeId), (quoteObject) => addLikeById(quoteObject.quoteId));
                break;
            case "btn-danger":
                // These two fetches show two ways to get the ID -- In this case (delete), the API doesn't send back anything, so I pulled the id from the dataset from the target of the event.
                adapter.deleteQuote(e.target.dataset.deleteId, () => removeQuoteById(e.target.dataset.deleteId))
                break;
            default:
                break;
        }
    }

    // Initial render and set up event listeners
    adapter.getQuotes(renderQuotes)
    document.addEventListener("submit", postQuote)
    document.addEventListener("click", handleClick)



























})