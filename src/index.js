document.addEventListener('DOMContentLoaded', ()=> {

    ////////////////////////////// CALLBACK FUNCTIONS -- These are called after a fetch made by functions defined in the Adapter.js file. //////////////////////////////

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
        return `<li class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button data-like-id=${quote.id} class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
          <button data-delete-id=${quote.id} class='btn-danger'>Delete</button>
        </blockquote>
      </li>`
    }

    // This callback function finds a quote on the DOM given its ID, and adds one to its number of likes on the DOM (It is called after submitting the like fetch from the adapter)
    function addLikeById(quoteId){
        button = document.querySelector(`[data-like-id="${quoteId}"]`)
        button.innerText = `Likes: ${parseInt(button.innerText.split(": ")[1])+1}`
    }

    // This callback function removes a quote from the DOM given its id (It is called after submitting the delete fetch from the adapter)
    function removeQuoteById(id){
        document.querySelector(`[data-delete-id='${id}']`).parentElement.parentElement.remove()
    }
    
    // On submit button click, submits with the relevant data to my adapter's postQuote function, and includes my callback function to add a quote to the DOM. Then it clears the form.
    function postQuote(e){
        e.preventDefault()
        quote = document.getElementById("new-quote").value
        author = document.getElementById("author").value
        adapter.postQuote(quote, author, addQuoteFromPost)
        document.getElementById("new-quote").value = ""
        document.getElementById("author").value = ""
    }

    ////////////////////////////// DOM functions - Click handler, event listener, and initial render calls. //////////////////////////////

    // Handles clicks and, in the case of a click of the like button or the delete button, calls their relevant adapter function, passing through a callback with the id preloaded.
    function handleClick(e){
        switch (e.target.classList[0]){
            // For like and delete, I've loaded up the id in two different ways for funsies.
            case "btn-success":                
                // In this case (like), I know the API is going to return the relevant quote object on a success, which has a quoteId.    
                // When I pass through the callback function (quoteObject) => addLikeById(quote.quoteId)) and call it in the second .then, the response from the fetch is passed to it as an argument.
                adapter.likeQuote(parseInt(e.target.dataset.likeId), (quoteObject) => addLikeById(quoteObject.quoteId));
                break;
            case "btn-danger":
                // In this case (delete), the API doesn't send back anything, so I pulled the id from the dataset from the target of the event.
                adapter.deleteQuote(e.target.dataset.deleteId, () => removeQuoteById(e.target.dataset.deleteId))
                break;
            default:
                break;
        }
    }

    // Initial render and set up event listeners
    adapter.getQuotes(renderQuotes)
    document.getElementById("new-quote-form").addEventListener("submit", postQuote)
    document.getElementById("quote-list").addEventListener("click", handleClick)
})