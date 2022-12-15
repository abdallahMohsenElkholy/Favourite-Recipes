let recipes = [];
let fav;


let celection = document.getElementById("celection");
let favItems = document.getElementById("favItems");
let favPage = document.getElementById("favPage");
let recipesContainer = document.getElementById("recipesContainer");
let favorBtn = document.getElementById("favorBtn");
let clientList = document.getElementById("clientList");
let favBtn = document.getElementById("favBtn");
let links = document.querySelectorAll(".navbar-nav .nav-link")


if (localStorage.getItem("fav") != null) {
    fav = JSON.parse(localStorage.getItem("fav"));
} else
    fav = [];


function getRecipes(meal) {
    let xml = new XMLHttpRequest();
    xml.open("GET", `https://forkify-api.herokuapp.com/api/search?q=${meal}`);
    xml.send();
    xml.addEventListener("readystatechange", function () {
        if (xml.readyState == 4 && this.status == 200) {
            recipes = JSON.parse(xml.response).recipes;
            display();
        }
    })
}
getRecipes("chicken");


function display() {
    let pageContent = ``;
    for (let i = 0; i < recipes.length; i++) {
        pageContent += `
        <div class="col-lg-3 col-md-4 col-sm-6">
          <div class="recipe p-2 bg-black bg-opacity-25">
          <div class="im mb-3"><a href="${recipes[i].source_url}" target="_blanck" ><img src="${recipes[i].image_url}" class="w-100 h-150" alt=""></a></div>
            <a onclick="addFav(${i})" id="favBtn" class="favBtn btn d-block btn-success mb-2">add to favourite</a>
            <a data-bs-toggle="modal" onclick="getRecipeDetails(${recipes[i].recipe_id})" data-bs-target="#exampleModal" class="btn btn-warning d-block mb-3">details..</a>
          </div>
        </div>
        `
    }
    document.getElementById("recipesContainer").innerHTML = pageContent;


}
for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (e) {
        links.forEach((link) => link.classList.remove('active'))
        links[i].classList.add('active')
        getRecipes(e.target.text)
        let newBg = e.target.getAttribute("new-bg-data");
        document.getElementsByClassName("front-img")[0].style.backgroundImage = `url(${newBg})`
    })

}

var addFav = (index) => {
    document.getElementsByClassName('favBtn')[index].classList.add('bt')
    let x = true;
    for (let i = 0; i < fav.length; i++) {
        if (recipes[index].recipe_id == fav[i].recipe_id)
            x = false
    }
    if (x == true) {
        fav.push(recipes[index]);
        localStorage.setItem("fav", JSON.stringify(fav));
    }
}

let imgBack;
favorBtn.addEventListener("click", function () {
    this.classList.toggle('btn-warning')
    this.classList.toggle('btn-danger')
    document.getElementsByClassName('navbar-expand-lg')[0].classList.toggle('d-none')
    if (favorBtn.innerHTML === "Back to menu") {
        recipesContainer.classList.remove("d-none");
        favItems.classList.add("d-none");
        favorBtn.innerHTML = "Favorite"
        document.getElementsByClassName("front-img")[0].style.backgroundImage = imgBack
    } else {
        displayFav();
        imgBack = document.getElementsByClassName("front-img")[0].style.backgroundImage
        document.getElementsByClassName("front-img")[0].style.backgroundImage = `url(${`./img/food-taking.jpg`})`
    }
})



function displayFav() {
    recipesContainer.classList.add("d-none");
    favItems.classList.remove("d-none");
    let boxContent = ``;
    if (fav.length == 0) {
        boxContent = `<h2 class="alert alert-danger text-center">No favourite items</h2>`;
        clientList.innerHTML = '';
    }
    for (let i = 0; i < fav.length; i++) {
        boxContent += `
            <div class="col-md-6 col-lg-4">
              <div class="favItem p-3 bg-secondary bg-opacity-50 rounded-4">
                <h4 class="my-3 text-center fw-bolder">${fav[i].title.split(" ").splice(0, 2).join(" ")}..</h4>
                <img src="${fav[i].image_url}" class="w-100 h-150 mb-3 rounded-4" alt="">
                <a class='pub' href="${fav[i].publisher_url}"target="_blanck"><p class="my-3 text-center fw-bolder">publisher: ${fav[i].publisher}</p></a>
                <a onclick="removeFav(${i})" class="d-block btn btn-danger mb-2">remove from list</a>
                <a data-bs-toggle="modal" onclick="getRecipeDetails(${fav[i].recipe_id})" data-bs-target="#exampleModal" class="btn btn-warning d-block">details..</a>
              </div>
            </div>
        `
    }
    celection.innerHTML = boxContent;
    favorBtn.innerHTML = "Back to menu"
}

function removeFav(index) {
    fav.splice(index, 1);
    localStorage.setItem("fav", JSON.stringify(fav));
    displayFav();
}

async function getRecipeDetails(id) {
    let response = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${id}`);
    response = await response.json();
    let tyt = await response.recipe.title
    response = response.recipe.ingredients;
    let box = ``
    for (let i = 0; i < response.length; i++) {
        box +=
            `
        <p class="border-bottom border-info border-2 fw-bolder text-center">${response[i]}</p>
        `
    }
    document.getElementById("recipeModal").innerHTML = box
    document.getElementById("exampleModalLabel").innerHTML = tyt.split(" ").splice(0, 4).join(" ") + ' ingredients :'
}






var ofTop = document.querySelector('.container')

window.onscroll = function () {
    console.log(document.documentElement.scrollTop);
    if (document.documentElement.scrollTop >= ofTop.offsetTop - 30) {
        document.querySelector('.navbar-expand-lg').classList.remove('bg-info')
        document.querySelector('.navbar-expand-lg').classList.add('bg-secondary')
    } else 
       { document.querySelector('.navbar-expand-lg').classList.add('bg-info');
       document.querySelector('.navbar-expand-lg').classList.remove('bg-secondary')

    }
    }






