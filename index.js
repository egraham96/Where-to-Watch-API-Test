const submitbutton = document.getElementById("submitbutton");
const formEl = document.getElementById("form");
const errormessage = document.getElementById("errormessage");
const suboptions = document.getElementById("suboptions");
const subheading = document.getElementById("subheading");
const suberror = document.getElementById("suberror");
const rentoptions = document.getElementById("rentoptions");
const rentheading = document.getElementById("rentheading");
const renterror = document.getElementById("renterror");
const buyoptions = document.getElementById("buyoptions");
const buyheading = document.getElementById("buyheading");
const buyerror = document.getElementById("buyerror");


//Takes Movie Title submitted by user and returns Watchmode Api numerical ID for submitted movie
function getId(query, type) {
    fetch(
        `https://watchmode.p.rapidapi.com/search/?search_field=name&search_value=${query}&types=${type}`,
        {
            method: "GET",
            headers: {
                "x-rapidapi-key":
                    "be9a60e677msh27b9eb97af299e8p1c5a0djsnb9ba03ed5bd6",
                "x-rapidapi-host": "watchmode.p.rapidapi.com",
            },
        }
    )
        .then(response => response.json())
        .then((data) => {
            if (data.title_results.length != 0) {
                //console.log(data);
                //console.log(data.title_results);
                let id = data.title_results[0].id;
                console.log(id);
                getStreaminginfo(id)
                /*If Watchmode does not have the movie title (and thus its ID) in its database, that means it does not have any streaming options. This throws an error telling user to pick a different movie*/
                /*You can test this by inputting a movie that does not exist*/
            } else throw Error('No movie found by that name');
        })
        .catch((err) => {
            console.error(err);
            errormessage.textContent = "No movie found by that name. Please try searching for a different movie. Unfortunately, TV shows are not accepted at this time."

        });
}

function getStreaminginfo(id) {
    fetch("https://watchmode.p.rapidapi.com/title/" + id + "/sources/", {
        "method": "GET",
        "headers": {
            "regions": "US",
            "x-rapidapi-host": "watchmode.p.rapidapi.com",
            "x-rapidapi-key": "be9a60e677msh27b9eb97af299e8p1c5a0djsnb9ba03ed5bd6"
        },
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            /*Checks to make sure the Watchmode API has any streaming options available for the chosen movie in its database*/
            /*For example, Watchmode has the movie Neo Ned in its database, has an ID for it, but has no streaming links for it available (no subscription, rental or buying options)*/
            if (data.length != 0) {
                rendersubdata(data)
                renderrentdata(data)
                renderbuydata(data)
            } else { errormessage.textContent = "No Streaming Options Found! Please try searching for a different movie." }
        })
        .catch(err => {
            console.error(err);
        });
}

function rendersubdata(data) {
    var subscriptionoptions = data
        .filter(movie => {
            if (movie.region == "US" && movie.type == "sub" && movie.web_url != undefined) { return true; }
        })
    console.log(subscriptionoptions);
    /*Checks to make sure the Watchmode API has any SUBSCRIPTION streaming options available for the chosen movie in its database*/
    /*For example, Watchmode has the movie SpiceGirls in its database, has an ID for it, you can buy or rent movie, but no subscription streaming links available*/
    if (subscriptionoptions.length != 0) {
        subscriptionoptions.forEach(value => {
            var list = document.createElement("ul");
            var link = document.createElement("li");
            link.textContent = value.web_url
            list.appendChild(link);
            suboptions.appendChild(list);
        });
        subheading.textContent = "Subscription Streaming Links Available:"
    } else {
        suberror.textContent = "No Subscription Services Links Available"
    }
}

function renderrentdata(data) {
    var rentaloptions = data
        .filter(movie => {
            if (movie.region == "US" && movie.type == "rent" && movie.web_url != undefined) { return true; }
        })
    console.log(rentaloptions);
    /*Checks to make sure the Watchmode API has any RENTAL streaming options available for the chosen movie in its database*/
    /*For example, Watchmode has the movie Bamboozled in its database, has an ID for it, you can buy or rent movie, but no subscription streaming links available*/
    if (rentaloptions.length != 0) {
        rentaloptions.forEach(value => {
            var list2 = document.createElement("ul");
            var link2 = document.createElement("li");
            link2.textContent = value.web_url
            list2.appendChild(link2);
            rentoptions.appendChild(list2);
        });
        rentheading.textContent = "Rental Streaming Links Available:"
    } else {
        renterror.textContent = "No Rental Streaming Links Available"
    }
}

function renderbuydata(data) {
    var buyingoptions = data
        .filter(movie => {
            if (movie.region == "US" && movie.type == "buy" && movie.web_url != undefined) { return true; }
        })
    console.log(buyingoptions);
    /*Checks to make sure the Watchmode API has any BUYING streaming options available for the chosen movie in its database*/
    /*For example, Watchmode has the movie Bamboozled in its database, has an ID for it, you can buy or rent movie, but no subscription streaming links available*/
    if (buyingoptions.length != 0) {
        buyingoptions.forEach(value => {
            var list3 = document.createElement("ul");
            var link3 = document.createElement("li");
            link3.textContent = value.web_url
            list3.appendChild(link3);
            buyoptions.appendChild(list3);
        });
        buyheading.textContent = "Streaming Available with Purchase of Movie:"
    } else {
        buyerror.textContent = "No Movie Purchase Options Available"
    }
}


//Grabs the Title submitted by the user and gives it to getId function. Do we want to allow people to search for TV shows as well? If so, that may be a bit more complicated.
formEl.addEventListener('submit', function (event) {
    event.preventDefault();
    let movieinput = document.getElementById('movieinput').value
    let tvOrMovie = "movie";
    getId(movieinput, tvOrMovie)
})
  
