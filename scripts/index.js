$(".fa-align-justify").click(function () {
    $(".nav-bar").css("left", "240px")
    $(".menu-bar").css("left" , "0").promise().done(function() {
        $(".menu-list-group").css("top", "0")
    })
    $(".xmark-menu-icon").css("display", "block")
    $(".fa-align-justify").css("display", "none")
})

$(".xmark-menu-icon").click(function() {
    $(".nav-bar").css("left", "0")
    $(".menu-list-group").css("top", "300px").promise().done(function() {
        $(".menu-bar").css("left" , "-250px")
    })
    $(".fa-align-justify").css("display", "block")
    $(".xmark-menu-icon").css("display", "none")
})

var mealNameList = []
var mealImgList = []
var mealIdList = []
var recipeIngredientList = [];
var recipeMeasureList = [];
let cartona = ``;

if(localStorage.getItem("mealName") == null)    getRandomMeal();
else viewMainMeals()

async function getRandomMeal() {
    let recievedMeals = {
        img: " ",
        name: " ",
        id: 0
    }
    for (let i = 0; i < 25; i++) {
        let res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        let finalRes = await res.json()
        if(mealNameList.includes(finalRes.meals[0].strMeal))
        {
            i--;
            continue;
        }
        cartona += `<div class="col-md-3 col-sm-6">
        <div class="meal-card position-relative">
        <div id=${finalRes.meals[0].idMeal} class="position-absolute rounded h-100 meal-card-bg">
        <img class="w-100 rounded" src = "${finalRes.meals[0].strMealThumb}" alt="">
        <p class="meal-name position-absolute">${finalRes.meals[0].strMeal}</p>
        </div>
        </div>
        </div>`
        recievedMeals.img = finalRes.meals[0].strMealThumb
        recievedMeals.name = finalRes.meals[0].strMeal
        recievedMeals.id = finalRes.meals[0].idMeal
        mealNameList.push(recievedMeals.name);
        mealImgList.push(recievedMeals.img);
        mealIdList.push(recievedMeals.id);
    }
    localStorage.setItem("mealName", JSON.stringify(mealNameList))
    localStorage.setItem("mealImg", JSON.stringify(mealImgList))
    localStorage.setItem("mealId", JSON.stringify(mealIdList))
    $("#randomMeals").html(cartona)
}

async function getMealIngredient(id) {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    var finalRes = await res.json();
    getMealPage(finalRes)
    getIngridient(finalRes)
    getMealTags(finalRes)
    getMealResources(finalRes)
}

$(".meal-card-bg").click(function(e) {
    getMealIngredient($(e.target).attr("id"))
})

function getMealPage(finalRes) {
    cartona = `<div class="col-md-3">
    <img class="w-100" src="${finalRes.meals[0].strMealThumb}" alt="">
    <p class="text-center text-light">${finalRes.meals[0].strMeal}</p>
    </div>
    <div class="col-md-6">
        <div class="text-light text-start mb-3">${finalRes.meals[0].strInstructions}</div>
            <p class="text-light text-capitalize">area : ${finalRes.meals[0].strArea}</p>
            <p class="text-light text-capitalize">category : ${finalRes.meals[0].strCategory}</p>
            <div>
                <p class="text-capitalize fs-3 text-light">recipe</p>
                <ul class="recipe-list">
                </ul>
            </div>
            <div  class="meal-tag-list">
                
            </div>
            <div class="mealResources">

            </div>
        </div>
    </div>
    `
    $("#randomMeals").html(cartona)
}

function getIngridient(finalRes) {
    let container = ``
    for(let i=1; i <= 20; i++) {
        cartona = `strIngredient${i}`
        if(finalRes.meals[0][cartona] !== "" && finalRes.meals[0][cartona] !== null){
            recipeIngredientList.push(finalRes.meals[0][cartona])
            cartona = `strMeasure${i}`
            recipeMeasureList.push(finalRes.meals[0][cartona])
            container += `
            <li class="bg-info rounded d-inline-block p-2 m-2 text-light">${recipeMeasureList[i-1]} ${recipeIngredientList[i-1]}</li>
            `
        }
    }
    $(".recipe-list").html(container)
}

function getMealTags(finalRes) {
    if(finalRes.meals[0].strTags !== null)
    {
        let tagsList = finalRes.meals[0].strTags.split(",")
        let cartona = ``;
        for(let i=0; i<tagsList.length; i++)
        {
            cartona += `
            <li class="bg-warning rounded d-inline-block p-2 m-2 text-light">${tagsList[i]}</li>
            `
        }
        $(".meal-tag-list").html(`<p class="text-capitalize fs-3 text-light">tags</p>
        <ul>` + cartona + "</ul>")
    }
}

function getMealResources(finalRes) {
    $(".mealResources").html(`
    <li class="bg-success text-capiatalize rounded d-inline-block p-2 m-2"><a class="text-decoration-none text-light" href="${finalRes.meals[0].strSource}">source</a></li>
    <li class="bg-danger text-capiatalize rounded d-inline-block p-2 m-2"><a class="text-decoration-none text-light" href="${finalRes.meals[0].strYoutube}">youtube</a></li>
    `)
}

function viewMainMeals() {
    mealNameList = JSON.parse(localStorage.getItem("mealName"))
    mealImgList = JSON.parse(localStorage.getItem("mealImg"))
    mealIdList = JSON.parse(localStorage.getItem("mealId"))
    for(let i=0; i < mealNameList.length; i++) {
        cartona += `<div class="col-md-3 col-sm-6">
        <div class="meal-card position-relative">
        <img class="w-100 rounded" src = "${mealImgList[i]}" alt="">
        <div id=${mealIdList[i]} class="position-absolute rounded h-100 meal-card-bg">
        <p class="meal-name position-absolute">${mealNameList[i]}</p>
        </div>
        </div>
        </div>`
    }
    $("#randomMeals").html(cartona)
}

function searchInputs() {
    cartona = `
            <div class="col-md-6">
                <input id="searchByName" class="w-100 text-center text-light" type="text" placeholder="search by name">
            </div>
            <div class="col-md-6">
                <input id="searchByLetter" class="w-100 text-center text-light" maxlength="1" type="text" placeholder="search by first letter">
            </div>
            <div class="container pt-5">
                <div id="searchResults" class="row gy-3">

                </div>
            </div>
            `
    $("#randomMeals").html(cartona)
    $("#searchByName").on("input",searchByName)
    $("#searchByLetter").on("input",searchByletter)
    
}

async function searchByName() {
    cartona = ``
    let name = $("#searchByName").val()
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    let finalRes = await res.json()
    if(finalRes.meals != null) {
        for(let i=0; i< finalRes.meals.length; i++)
        {
            cartona += `<div class="col-md-3 col-sm-6">
            <div class="meal-card position-relative">
            <div id="${finalRes.meals[i].idMeal}" class="position-absolute rounded h-100 meal-card-bg"></div>
            <img class="w-100 rounded" src = "${finalRes.meals[i].strMealThumb}" alt="">
            <p class="meal-name position-absolute">${finalRes.meals[i].strMeal}</p></div>
            </div>`
        }
        $("#searchResults").html(cartona)
        $(".meal-card-bg").click(function(e){
            getMealIngredient($(e.target).attr("id"))
        })
    }
}

async function searchByletter() {
    let letter = $("#searchByLetter").val()
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
    let finalRes = await res.json();
    cartona = ``;
    for(let i=0; i< finalRes.meals.length; i++)
        {
            cartona += `<div class="col-md-3 col-sm-6">
            <div class="meal-card  position-relative">
            <div id="${finalRes.meals[i].idMeal}" class="position-absolute rounded h-100 meal-card-bg"></div>
            <img class="w-100 rounded" src = "${finalRes.meals[i].strMealThumb}" alt="">
            <p class="meal-name position-absolute">${finalRes.meals[i].strMeal}</p></div>
            </div>`
        }
        $("#searchResults").html(cartona)
        $(".meal-card-bg").click(function(e){
            getMealIngredient($(e.target).attr("id"))
        })
}

async function getCategoryMeals(id){
    cartona = ``
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${id}`)
    let finalRes = await res.json()
    console.log(finalRes);
    for (let i = 0; i < finalRes.meals.length; i++) {
        cartona += `<div class="col-md-3 col-sm-6">
        <div class="meal-card position-relative">
            <div id="${finalRes.meals[i].idMeal}" class="position-absolute rounded h-100 meal-card-bg"></div>
            <img class="w-100 rounded" src = "${finalRes.meals[i].strMealThumb}" alt="">
            <div id=${mealIdList[i]} class="position-absolute rounded h-100 meal-card-bg">
            <p class="meal-name position-absolute">${finalRes.meals[i].strMeal}</p></div>
        </div>
            </div>`
    }
    $("#randomMeals").html(cartona)
    $(".meal-card-bg").click(function(e){
        getMealIngredient($(e.target).attr("id"))
    })
}

async function getCategory() {
    cartona = ``;
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let finalRes = await res.json()
    for (let i = 0; i < finalRes.categories.length-2; i++) {
        cartona += `<div class="col-md-3 col-sm-6">
        <div class="meal-card position-relative">
            <div class="position-absolute rounded h-100 meal-card-bg"></div>
            <img class="w-100 rounded" src = "${finalRes.categories[i].strCategoryThumb}" alt="">
            <div class="meal-name-cat position-absolute text-center">
                <p class="fs-3 mb-1">${finalRes.categories[i].strCategory}</p>
                <p id="${finalRes.categories[i].strCategory}" class="cat-desc fs-5">${finalRes.categories[i].strCategoryDescription}</p>
            </div>
            </div>
            </div>`
        }
    $("#randomMeals").html(cartona)
    $(".cat-desc").click(function(e){
        getCategoryMeals($(e.target).attr("id"))
    })
}

async function getArea() {
    cartona = ``
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    let finalRes = await res.json();
    for (let i = 0; i < finalRes.meals.length; i++) {
        cartona += `<div class="col-md-3 col-sm-6">
        <div class="meal-card position-relative  text-center">
            <i id="${finalRes.meals[i].strArea}" class="fa-solid fa-city fa-3x text-success area-icon fs-2"></i>
            <p " class="text-capitalize fs-2 text-light">${finalRes.meals[i].strArea}</p></div></div>
        `
    }
    $("#randomMeals").html(cartona)
    $(".area-icon").click(function(e){
        mealByArea($(e.target).attr("id"))
    })
}

async function mealByArea(id) {
    cartona = ""
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${id}`)
    let finalRes = await res.json();
    for (let i = 0; i < finalRes.meals.length; i++) {
        cartona += `<div class="col-md-3 col-sm-6">
        <div class="meal-card position-relative">
            <div class="position-absolute rounded h-100 meal-card-bg"></div>
            <img class="w-100 rounded" src = "${finalRes.meals[i].strMealThumb}" alt="">
            <div class="meal-name position-absolute text-center">
                <p class="fs-3 mb-1">${finalRes.meals[i].strMeal}</p>
            </div>
            </div>
            </div>`
    }
    $("#randomMeals").html(cartona)
}

async function getIngredient() {
    cartona = ``
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
    let finalRes = await res.json();
    for (let i = 0; i < finalRes.meals.length; i++) {
        cartona += `<div class="col-md-3 col-sm-6">
        <div class="meal-card position-relative  text-center">
            <i id="${finalRes.meals[i].strIngredient}" class="fa-solid fa-bowl-food fa-3x text-success ingred-icon fs-2"></i>
            <p class="text-capitalize fs-2 text-light">${finalRes.meals[i].strIngredient}</p>
            <p class="text-light">${finalRes.meals[0].strDescription.slice(0,150)}</p></div></div>
        `
    }
    $("#randomMeals").html(cartona)
    $(".ingred-icon").click(function(e){
        mealByIngredient($(e.target).attr("id"))
    })
}

async function mealByIngredient(id) {
    cartona = ""
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${id}`)
    let finalRes = await res.json();
    console.log(finalRes);
    for (let i = 0; i < finalRes.meals.length; i++) {
        cartona += `<div class="col-md-3 col-sm-6">
        <div class="meal-card position-relative">
            <div id=${finalRes.meals[i].idMeal} class="position-absolute rounded h-100 meal-card-bg"></div>
            <img class="w-100 rounded" src = "${finalRes.meals[i].strMealThumb}" alt="">
            <div class="meal-name position-absolute text-center">
                <p class="fs-3 mb-1">${finalRes.meals[i].strMeal}</p>
            </div>
            </div>
            </div>`
    }
    $("#randomMeals").html(cartona)
    $(".meal-card-bg").click(function(e){
        getMealIngredient($(e.target).attr("id"))
    })
}

function getContactPage() {
    cartona = `
    <h2 class="text-light text-center"> Contact Us..</h2>
    <div class="col-md-6">
        <input id="userName" class="w-100 text-light" placeholder="Enter yout name">
        <div id="invalidName"></div>
    </div>
    <div class="col-md-6">
        <input id="userEmail" class="w-100 text-light" type="email" placeholder="Enter your email">
        <div id="invalidEmail"></div>
    </div>
    <div class="col-md-6">
        <input id="userPhone" class="w-100 text-light" type="tel" placeholder="Enter your phone number">
        <div id="invalidPhone"></div>
    </div>
    <div class="col-md-6">
        <input id="userAge" class="w-100 text-light" placeholder="Enter yout age">
        <div id="invalidAge"></div>
    </div>
    <div class="col-md-6">
        <input id="userPass" class="w-100 text-light" type="password" placeholder="Enter your password">
        <div id="invalidPass"></div>
    </div>
    <div class="col-md-6">
        <input id="userRePass" class="w-100 text-light" type="password" placeholder="Renter your password">
        <div id="invalidRepass"></div>
    </div>
    <input type="submit" disabeled value="submit" class="btn position-relative start-50 translate-middle-x border-danger text-danger">
    `
    $("#randomMeals").html(cartona)
    $("#userName").on("input",function () {
        isNameValid($("#userName").val())
    })
    $("#userEmail").on("input",function () {
        isEmailValid($("#userEmail").val())
    })
    $("#userPhone").on("input",function () {
        isPhoneValid($("#userPhone").val())
    })
    $("#userAge").on("input",function () {
        isAgeValid($("#userAge").val())
    })
    $("#userPass").on("input",function () {
        isPasswordValid($("#userPass").val())
    })
    $("#userRePass").on("input",function () {
        isPasswordMatches($("#userRePass").val())
    })
}

function isNameValid(name) {
    let regex = /^[a-zA-z]+$/g
    regex = regex.test(name)
    console.log(regex);
    if(regex){
        $("#invalidName").empty()
        $("#userName").css({"borderBottom":"green 5px  solid", "transition":"none"})
    }  
    else {
        $("#invalidName").html(`
        <p class="bg-danger rounded mt-2 p-3 text-white text-center">Special Characters and Numbers not allowed</p>
        `)
        $("#userName").css({"borderBottom":"red 5px  solid", "transition":"none"})
    }
}

function isEmailValid(email) {
    let regex = /^[a-zA-z0-9_]{1,20}@.+\.(com|net|org|eg)$/g
    regex =  regex.test(email)

    if(regex){
        $("#invalidEmail").empty()
        $("#userEmail").css({"borderBottom":"green 5px  solid", "transition":"none"})
    }  
    else {
        $("#invalidEmail").html(`
        <p class="bg-danger mt-2 p-3 rounded text-white text-center">Enter valid email. *Ex: xxx@yyy.zzz</p>
        `)
        $("#userEmail").css({"borderBottom":"red 5px  solid", "transition":"none"})
    }
}

function isPhoneValid(phone) {
    let regex = /^\+20(0|1|2|5)[0-9]{9}$/g
    regex = regex.test(phone)

    if(regex){
        $("#invalidPhone").empty()
        $("#userPhone").css({"borderBottom":"green 5px  solid", "transition":"none"})
    } 
    else {
        $("#invalidPhone").html(`
        <p class="bg-danger mt-2 p-3 rounded text-white text-center">Enter valid Phone Number</p>
        `)
        $("#userPhone").css({"borderBottom":"red 5px  solid", "transition":"none"})
    }
}

function isAgeValid(age) {
    let regex = /^[1-9][0-9]?$/
    regex = regex.test(age);

    if(regex){
        $("#invalidAge").empty()
        $("#userAge").css({"borderBottom":"green 5px  solid", "transition":"none"})
    } 
        else {
            $("#invalidAge").html(`
            <p class="bg-danger mt-2 p-3 rounded text-white text-center">Enter valid age</p>
            `)
            $("#userAge").css({"borderBottom":"red 5px  solid", "transition":"none"})
        }
}

function isPasswordValid(password) {
    let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g
    regex = regex.test(password);

    console.log("hehe");
    if(regex){
        $("#invalidPass").empty()
        $("#userPass").css({"borderBottom":"green 5px  solid", "transition":"none"})

         
    } 
    else {
        $("#invalidPass").html(`
        <p class="bg-danger mt-2 p-3 rounded text-white text-center">Enter valid password *Minimum eight characters, at least one letter and one number:*</p>
        `)
        $("#userPass").css({"borderBottom":"red 5px  solid", "transition":"none"})
         
    }
}

function isPasswordMatches(repass) {
    if(repass == $("#userPass").val())
    {
        $("#invalidRepass").empty()
        $("#userRePass").css({"borderBottom":"green 5px  solid", "transition":"none"})
        return true
    }
    else {
        $("#invalidRepass").html(`
        <p class="bg-danger mt-2 p-3 rounded text-white text-center">Password mismatch</p>
        `)
        $("#userRePass").css({"borderBottom":"red 5px  solid", "transition":"none"})
         
    }
}

$("#search").click(searchInputs)
$("#cat").click(getCategory)
$("#area").click(getArea)
$("#ingred").click(getIngredient)
$("#contact").click(getContactPage)
