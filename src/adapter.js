const API = "http://localhost:3000/"
const API_QUOTES = API + `quotes`
const API_LIKES =  API + `likes`

adapter = {

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