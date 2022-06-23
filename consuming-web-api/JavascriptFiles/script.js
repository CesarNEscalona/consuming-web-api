/** This program contains all JS logic for the API assignment
 * @author Cesar Escalona
 * Date: 03/03/22
 * @version 1.0
 */

// Function for when the window loads
window.onload = function () {
    // Loads all other functions
    getContent();
}

// global scope variables
let id;
let picId;

// gets the content when the random button is clicked, GET Request
function getContent() {
    let button = document.getElementById("button");
    button.onclick = function (event) {
        // stops the button from submitting itself
        event.preventDefault();

        // request must include api key in headers to work
        let uri = "https://api.thecatapi.com/v1/images/search"
        let params = {
            method: "get",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "0aa60859-c6e1-4617-ba79-7748e43f561c"
            }
        }
        fetch(uri, params)
            .then(function (response) {
                console.log(response);
                return response.json(); // return another promise
            })
            .then(loadSearchPic);
    }
}

// loads initial picture and favorite image button on the page
function loadSearchPic(json) {
    console.log("Random Cat Image Displayed");
    console.log(json);
    // add the image to the img tag in html
    let data = json[0];
    let image = document.getElementById("searchImage");
    image.setAttribute("src", data.url);
    // grab id and set it for future use
    id = data.id;

    // un-hides the like buttons
    likes();
}

// un-hides the favorite image button
function likes() {
    let myLikeButton = document.getElementById("likes");
    myLikeButton.style.display = 'block';
}

// post request that adds favorite images to a user, POST Request
function likeButton() {
    console.log("Favorited an Image!");
    let like = document.getElementById("like");
    if (like.onclick) {
        let uri = "https://api.thecatapi.com/v1/favourites"
        let params = {
            method: "post",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "0aa60859-c6e1-4617-ba79-7748e43f561c"
            },
            // postman body request
            body: JSON.stringify({
                image_id: id,
                sub_id: "Test"
            })
        }
        fetch(uri, params)
            .then(function (response) {
                console.log(response);
                return response.json();
            }).then(favourites);
    }
}

// use get method to retrieve the User's favorite images, GET Request
function favourites() {
    let likeBtn = document.getElementById("like");
    if (likeBtn.onclick) {
        let uri = "https://api.thecatapi.com/v1/favourites?Test"
        let params = {
            method: "get",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "0aa60859-c6e1-4617-ba79-7748e43f561c"
            }
        }
        fetch(uri, params)
            .then(function (response) {
                console.log(response);
                return response.json();
            }).then(displayFavorites);
    }
}

// displays the favorited images if there are any
function displayFavorites(json) {
    let photo = document.getElementById("many");
    photo.textContent = "";
    let flag = 0;
    // if there is an image, step in
    for (let i = 0; i < json.length; i++) {
        // create image
        let img = document.createElement("img");
        img.src = json[i].image.url;
        picId = json[i].id;
        console.log(picId);
        photo.appendChild(img);
        flag++;
        console.log("Total number of favorites: " + flag);
    }
    // if no images, step in, otherwise, go to else
    if (flag === 0) {
        // hide the favorite area
        let myFav = document.getElementById("favourites");
        myFav.style.display = "none";

        // hide the 'favorites' button
        document.getElementById("fav").style.display = "none";

        // leave a message for the user and log into console
        let none = document.getElementById("none");
        none.innerText = "No Favorited Images Found";
        console.log("No Favorited Images Found");
    } else {
        // show favorite area
        let myFav = document.getElementById("favourites");
        myFav.style.display = "block";

        // hide message for user
        let none = document.getElementById("none");
        none.style.display = "none";
    }
}

// Removes the most recent favorited image from the user, DELETE Request
function dislikePhoto() {
    let dislikeBtn = document.getElementById("hate");
    // if Remove button is clicked, step in
    if (dislikeBtn.onclick) {
        let uri = "https://api.thecatapi.com/v1/favourites/" + picId;
        let params = {
            method: "delete",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "0aa60859-c6e1-4617-ba79-7748e43f561c"
            }
        }
        fetch(uri, params)
            .then(function (response) {
                console.log(response);
                return response.json();
            }).then(favourites);
        console.log("Removed most recent image");
    }
}
