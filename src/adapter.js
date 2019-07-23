const API = "http://localhost:3000/"
const API_QUOTES = API + `quotes`
const API_LIKES =  API + `likes`

// Since none of these have access to my callback functions (the fetches aren't in the closure where they were defined), we pass through as an argument the callback function to be done at the end of a fetch.)
// Each key value pair here is a name of a function, and then a function. By building it this way in this constant, I can call them anywhere in my program by writing adapter.functionName(args).

const adapter = {
    getQuotes: (callback) => {
        fetch(`${API_QUOTES}?_embed=likes`)
        .then(res => res.json())
        .then(callback)
    },

    postQuote: (quote, author, callback) => {fetch(`${API_QUOTES}`, {
        method: 'POST', 
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({quote: quote, author: author})
    })
    .then(response => response.json())
    .then(callback)
    },

    deleteQuote: (id, callback) => {
        fetch(`${API_QUOTES}/${id}`, {method: 'DELETE'})
        .then(response => response.json())
        .then(callback)
    },

    likeQuote: (id, callback) => {
        fetch(API_LIKES, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({quoteId: id, createdAt: Date.now()}),
        })
        .then(response => response.json())
        .then(callback)
    }
}