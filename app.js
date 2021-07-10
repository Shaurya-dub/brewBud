const app = {};

app.form = document.querySelector('form');
app.button = document.querySelector('button');

// User types in location into input
// on form submit, capture user input, make API call
// API call uses parameter selected by user (city,postal code etc)
// When we get the information back, we loop through it
// Append information to li
// Append li to ul on page
const ul = document.querySelector('ul');
app.getCity = () => { 
    const inputValue = document.querySelector('input[type="text"]').value;
    const url = new URL('https://api.openbrewerydb.org/breweries');
    url.search = new URLSearchParams({
        by_city: `${inputValue}`   
    })
    
    fetch(url)
    .then(function(res){
        return res.json();
    })
    .then(function(brewery){
    brewery.forEach((result) => {
        app.displayFunction(result)
    })
    })
    
}

app.displayFunction = (str) => {
const li =document.createElement('li');
li.innerHTML = `<h2>${str.name}</h2>`
ul.appendChild(li);

}

app.form.addEventListener('submit', (e) => {
    const selectValue = document.querySelector('select').value;
    e.preventDefault();
    app.getCity();
    })





app.init = () => {
    // app.getCity();

}

app.init();