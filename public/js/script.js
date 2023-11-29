let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let ingredientList = document.querySelector('.ingredientList');
let ingredientDiv = document.querySelectorAll('.ingredientDiv')[0];

addIngredientsBtn.addEventListener('click', function () {
    let newIngredients = ingredientDiv.cloneNode(true); // Fixed typo 'ingredeintDiv' to 'ingredientDiv'
    let input = newIngredients.getElementsByTagName('input')[0]; // Fixed typo 'getElementByTagName' to 'getElementsByTagName'
    input.value = '';
    ingredientList.appendChild(newIngredients);
});
