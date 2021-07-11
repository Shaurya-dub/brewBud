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
        // console.log(result);
    })
    })
    
}

app.displayFunction = (str) => {
const li =document.createElement('li');
const h2 = document.createElement('h2');
h2.append(str.name);
li.appendChild(h2);
setTimeout((e) => {
    li.classList.add("fade");

}, 100);
const street= app.nullChecker(str.street,"Street address");
const city= app.nullChecker(str.city,"City info");
const state= app.nullChecker(str.state,"State info");
const postalCode= app.nullChecker(str.postal_code,"Postal Code");
const phone= app.nullChecker(str.phone,"Phone Number");

li.innerHTML = `<h2>${str.name}</h2>
<p>${street}, ${city} ${postalCode}, ${state}</p>
<p class="phone"> ${phone}</p>`
// li.append(street);
// console.log(street);




ul.appendChild(li);

}

app.form.addEventListener('submit', (e) => {
    ul.innerHTML = "";
    const selectValue = document.querySelector('select').value;
    e.preventDefault();
    app.getCity();
    })



app.nullChecker = (val, term) => {
if(!val) {
    return `${term} is unavailable`;
} else {
    return `${val}`;
}
}

app.init = () => {
    // app.getCity();

}

app.init();