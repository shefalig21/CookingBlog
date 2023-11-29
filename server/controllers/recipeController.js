require('../models/database');
const Category= require('../models/Category');
const Recipe= require('../models/Recipe');

// get
// HOMEPAGE 

exports.homepage = async(req,res) =>{
    try{

        const limitNumber=5;
        const categories=await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);  //finding the sorted recipe
        const thai= await Recipe.find({ 'category':'Thai' }).limit(limitNumber);
        const american=await Recipe.find({ 'category':'American' }).limit(limitNumber);
        const chinese=await Recipe.find({ 'category':'Chinese' }).limit(limitNumber);

        const food={ latest, thai, american, chinese };

        res.render('index' , {title: 'Cooking Blog - Home ', categories, food});
    }catch(error){
        res.satus(500).send({message: error.message || "Error Occured"});

    }
}




// Get /categories
// Categories

exports.exploreCategories = async(req,res) =>{
    try{

        const limitNumber=20;
        const categories=await Category.find({}).limit(limitNumber);
        res.render('categories' , {title: 'Cooking Blog - Categoreis', categories});
    }catch(error){
        res.satus(500).send({message: error.message || "Error Occured"});

    }
}




/**
 * GET /recipe/:id
 * Recipe
 */

exports.exploreRecipe = async(req, res) => {
try {
    let recipeId= req.params.id;
    const recipe=await Recipe.findById(recipeId);
    res.render('recipe',{ title: 'Cooking Blog - Recipe',recipe});
}catch (error){
    res.satus(500).send({message: error.message || "Error Occured"});
 }
}




// Get /categories/:id
// Categories By Id

exports.exploreCategoriesById = async(req, res) => { 
    try {
      let categoryId = req.params.id;
      const limitNumber = 20;
      const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
      res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 



/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
    try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Blog - Search', recipe } );
    } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
    }
    
  }


  /**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
    try {
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 
  

/**
 * GET /explore-random
*/
exports.exploreRandom = async(req, res) => {
    try {
      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
      res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  

  /**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}

  

  /**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try{
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }


    const newRecipe=new Recipe({

      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName

    });

    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // req.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}



// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();



// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();










//       const limitumber=20;
//       const categories= await Category.find({}).limit(limitNumber);
//     //   let recipeId = req.params.id;
//     //   const recipe = await Recipe.findById(recipeId);
//res.render('categories', { title: 'Cooking Blog - Categories', categories } );
//     //   res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
//     } catch (error) {
//       res.satus(500).send({message: error.message || "Error Occured" });
//     }
//   } 





















// simple way of inserting data:

// async function insertDymmyCategoryData(){
//     try{
//         await Category.insertMany([
//                 {
//                     "name":"Thai",
//                     "image":"thai-food.jpg"
//                 },
            
//                 {
//                     "name":"American",
//                     "image":"american-food.jpg"
//                 },
            
//                 {
//                     "name":"Chinese",
//                     "image":"chinese-food.jpg"
//                 },
            
//                 {
//                     "name":"Mexican",
//                     "image":"mexican-food.jpg"
//                 },
            
//                 {
//                     "name":"Indian",
//                     "image":"indian-food.jpg"
//                 },
            
//                 {
//                     "name":"Spanish",
//                     "image":"spanish-food.jpg"
//                 },
//             ]);
//     }catch (error){
//      console.log('err',+error)   

//     }
// }

// insertDymmyCategoryData();

// async function insertDymmyRecipeData(){
//     try{
//         await Recipe.insertMany([
//             {
//                 "name":"Southern fried chicken",
//                 "description": `
//                 To make the brine, toast the peppercorns in a large pan on a high heat for 1 minute, then add the rest of the brine ingredients and 400ml of cold water. Bring to the boil, then leave to cool, topping up with another 400ml of cold water.
//                 Meanwhile, slash the chicken thighs a few times as deep as the bone, keeping the skin on for maximum flavour. Once the brine is cool, add all the chicken pieces, cover with clingfilm and leave in the fridge for at least 12 hours – I do this overnight.
//                 After brining, remove the chicken to a bowl, discarding the brine, then pour over the buttermilk, cover with clingfilm and place in the fridge for a further 8 hours, so the chicken is super-tender.
//                 When youre ready to cook, preheat the oven to 190°C/375°F/gas 5.
//                 Wash the sweet potatoes well, roll them in a little sea salt, place on a tray and bake for 30 minutes.
//                 Meanwhile, make the pickle toast the fennel seeds in a large pan for 1 minute, then remove from the heat. Pour in the vinegar, add the sugar and a good pinch of sea salt, then finely slice and add the cabbage.

//                 Source: https://www.https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/`,

//                 "email":"shefalig4848@gmail.com",
//                 "ingredients": [
//                     "4 free-range chicken thighs , skin on, bone in",
//                     "4 free-range chicken drumsticks",
//                     "200 ml buttermilk",
//                     "4 sweet potatoes",
//                     "200 g plain flour",
//                     "1 level teaspoon baking powder",
//                     "1 level teaspoon cayenne pepper",
//                     "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "American",
//                 "image": "southern-friend-chicken.jpg"
//             },
//             {
//                 "name": "Crab cakes",
//                 "description": `
//                 Trim and finely chop the spring onions, and pick and finely chop the parsley. Beat the egg.
//                 Combine the crabmeat, potatoes, spring onion, parsley, white pepper, cayenne and egg in a bowl with a little sea salt.
//                 Refrigerate for 30 minutes, then shape into 6cm cakes.
//                 Dust with flour and shallow-fry in oil over a medium heat for about 5 minutes each side or until golden-brown.
//                 Serve with pinches of watercress and a dollop of tartare sauce.

//                 Source:https://www.https://www.jamieoliver.com/recipes/seafood-recipes/crab-cakes/ `,
//                 "email": "shefalig4848@gmail.com",
//                 "ingredients":[
//                     "3 spring onions",
//                     "½ a bunch of fresh flat-leaf parsley",
//                     "1 large free-range egg",
//                     "750 g cooked crabmeat , from sustainable sources",
//                     "300 g mashed potatoes",
//                     "1 teaspoon ground white pepper",
//                     "1 teaspoon cayenne pepper",
//                     "plain flour , for dusting",
//                     "olive oil",
//                     "watercress",
//                     "tartare sauce",
//                     "The cost per serving",
//                 ],
//                 "category": "American",
//                 "image": "crab-cakes.jpg"
//             },
//             {
//                 "name":"key lime pie",
//                 "description": `
//                 Preheat the oven to 175ºC/gas 3. Lightly grease a 22cm metal or glass pie dish with a little of the butter.
//                 For the pie crust, blend the biscuits, sugar and remaining butter in a food processor until the mixture resembles breadcrumbs.
//                 Transfer to the pie dish and spread over the bottom and up the sides, firmly pressing down.
//                 Bake for 10 minutes, or until lightly browned. Remove from oven and place the dish on a wire rack to cool.
//                 For the filling, whisk the egg yolks in a bowl. Gradually whisk in the condensed milk until smooth.
//                 Mix in 6 tablespoons of lime juice, then pour the filling into the pie crust and level over with the back of a spoon.
//                 Return to the oven for 15 minutes, then place on a wire rack to cool.
//                 Once cooled, refrigerate for 6 hours or overnight.
//                 To serve, whip the cream until it just holds stiff peaks. Add dollops of cream to the top of the pie, and grate over some lime zest, for extra zing if you like.

//                 Source:https://www.jamieoliver.com/recipes/fruit-recipes/key-lime-pie/`,
//                 "email": "shefalig4848@gmail.com",
//                 "ingredients":[
//                     "4 large free-range egg yolks",
//                     "400 ml condensed milk",
//                     "5 limes",
//                     "200 ml double cream",
//                     "CRUST",
//                     "135 g unsalted butter",
//                     "12 digestive biscuits",
//                     "45 g caster sugar",
//                 ],
//                 "category":"American",
//                 "image":"key-lime-pie.jpg",
//             },
//             {
//                 "name":"Grilled lobster rolls",
//                 "description": `
//                 Remove the butter from the fridge and allow to soften.
//                 Preheat a griddle pan until really hot.
//                 Butter the rolls on both sides and grill on both sides until toasted and lightly charred (keep an eye on them so they don’t burn).
//                 Trim and dice the celery, chop the lobster meat and combine with the mayonnaise. Season with sea salt and black pepper to taste.
//                 Open your warm grilled buns, shred and pile the lettuce inside each one and top with the lobster mixture. Serve immediately.
//                 Source: https://www.jamieoliver.com/recipes/seafood-recipes/grilled-lobster-rolls/`,
//                 "email": "shefalig4848@gmail.com",
//                 "ingredients":[
//                     "85 g butter",
//                     "6 submarine rolls",
//                     "500 g cooked lobster meat, from sustainable sources",
//                     "1 stick of celery",
//                     "2 tablespoons mayonnaise , made using free-range eggs",
//                     "½ an iceberg lettuce",
//                 ],
//                 "category":"American",
//                 "image":"grilled-lobster-rolls.jpg"
//             },
//             {
//                 "name":"Veggie pad Thai",
//                 "description": `
//                 Remove the butter from the fridge and allow to soften.
//                 Preheat a griddle pan until really hot.
//                 Butter the rolls on both sides and grill on both sides until toasted and lightly charred (keep an eye on them so they don’t burn).
//                 Trim and dice the celery, chop the lobster meat and combine with the mayonnaise. Season with sea salt and black pepper to taste.
//                 Open your warm grilled buns, shred and pile the lettuce inside each one and top with the lobster mixture. Serve immediately.
//                 Source: https://www.jamieoliver.com/recipes/vegetable-recipes/veggie-pad-thai/`,
//                 "email": "shefalig4848@gmail.com",
//                 "ingredients":[
//                     "85 g butter",
//                     "6 submarine rolls",
//                     "500 g cooked lobster meat, from sustainable sources",
//                     "1 stick of celery",
//                     "2 tablespoons mayonnaise , made using free-range eggs",
//                     "½ an iceberg lettuce",
//                 ],
//                 "category":"Thai",
//                 "image":"veggie-pad-thai.jpg"
//             },
//             {
//                 "name":"Thai red chicken Soup",
//                 "description": `
//                 Remove the butter from the fridge and allow to soften.
//                 Preheat a griddle pan until really hot.
//                 Butter the rolls on both sides and grill on both sides until toasted and lightly charred (keep an eye on them so they don’t burn).
//                 Trim and dice the celery, chop the lobster meat and combine with the mayonnaise. Season with sea salt and black pepper to taste.
//                 Open your warm grilled buns, shred and pile the lettuce inside each one and top with the lobster mixture. Serve immediately.
//                 Source: https://www.jamieoliver.com/recipes/chicken-recipes/thai-red-chicken-soup/`,
//                 "email": "shefalig4848@gmail.com",
//                 "ingredients":[
//                     "85 g butter",
//                     "6 submarine rolls",
//                     "500 g cooked lobster meat, from sustainable sources",
//                     "1 stick of celery",
//                     "2 tablespoons mayonnaise , made using free-range eggs",
//                     "½ an iceberg lettuce",
//                 ],
//                 "category":"Thai",
//                 "image":"thai-red-chicken-soup.jpg"
//             },
//             {
//                 "name": "Thai Green Curry",
//                 "description": `
//                 Trim and finely chop the spring onions, and pick and finely chop the parsley. Beat the egg.
//                 Combine the crabmeat, potatoes, spring onion, parsley, white pepper, cayenne and egg in a bowl with a little sea salt.
//                 Refrigerate for 30 minutes, then shape into 6cm cakes.
//                 Dust with flour and shallow-fry in oil over a medium heat for about 5 minutes each side or until golden-brown.
//                 Serve with pinches of watercress and a dollop of tartare sauce.

//                 Source:https://www.jamieoliver.com/recipes/chicken-recipes/thai-green-chicken-curry/ `,
//                 "email": "shefalig4848@gmail.com",
//                 "ingredients":[
//                     "3 spring onions",
//                     "½ a bunch of fresh flat-leaf parsley",
//                     "1 large free-range egg",
//                     "750 g cooked crabmeat , from sustainable sources",
//                     "300 g mashed potatoes",
//                     "1 teaspoon ground white pepper",
//                     "1 teaspoon cayenne pepper",
//                     "plain flour , for dusting",
//                     "olive oil",
//                     "watercress",
//                     "tartare sauce",
//                     "The cost per serving",
//                 ],
//                 "category": "Thai",
//                 "image": "thai-green-curry.jpg"
//             },
//             {
//                 "name":"Thai style musseles",
//                 "description": `
//                 To make the brine, toast the peppercorns in a large pan on a high heat for 1 minute, then add the rest of the brine ingredients and 400ml of cold water. Bring to the boil, then leave to cool, topping up with another 400ml of cold water.
//                 Meanwhile, slash the chicken thighs a few times as deep as the bone, keeping the skin on for maximum flavour. Once the brine is cool, add all the chicken pieces, cover with clingfilm and leave in the fridge for at least 12 hours – I do this overnight.
//                 After brining, remove the chicken to a bowl, discarding the brine, then pour over the buttermilk, cover with clingfilm and place in the fridge for a further 8 hours, so the chicken is super-tender.
//                 When youre ready to cook, preheat the oven to 190°C/375°F/gas 5.
//                 Wash the sweet potatoes well, roll them in a little sea salt, place on a tray and bake for 30 minutes.
//                 Meanwhile, make the pickle toast the fennel seeds in a large pan for 1 minute, then remove from the heat. Pour in the vinegar, add the sugar and a good pinch of sea salt, then finely slice and add the cabbage.

//                 Source: https://www.jamieoliver.com/recipes/seafood-recipes/thai-style-mussels/`,

//                 "email": "shefalig4848@gmail.com",
//                 "ingredients": [
//                     "4 free-range chicken thighs , skin on, bone in",
//                     "4 free-range chicken drumsticks",
//                     "200 ml buttermilk",
//                     "4 sweet potatoes",
//                     "200 g plain flour",
//                     "1 level teaspoon baking powder",
//                     "1 level teaspoon cayenne pepper",
//                     "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "Thai",
//                 "image": "thai-style-mussels.jpg"
//             },
//             {
//                 "name": "Chinese Steak Tofu Stew",
//                 "description": `
//                 Trim and finely chop the spring onions, and pick and finely chop the parsley. Beat the egg.
//                 Combine the crabmeat, potatoes, spring onion, parsley, white pepper, cayenne and egg in a bowl with a little sea salt.
//                 Refrigerate for 30 minutes, then shape into 6cm cakes.
//                 Dust with flour and shallow-fry in oil over a medium heat for about 5 minutes each side or until golden-brown.
//                 Serve with pinches of watercress and a dollop of tartare sauce.

//                 Source:https://www.jamieoliver.com/recipes/stew-recipes/chinese-steak-tofu-stew/ `,
//                 "email": "shefalig4848@gmail.com",
//                 "ingredients":[
//                     "3 spring onions",
//                     "½ a bunch of fresh flat-leaf parsley",
//                     "1 large free-range egg",
//                     "750 g cooked crabmeat , from sustainable sources",
//                     "300 g mashed potatoes",
//                     "1 teaspoon ground white pepper",
//                     "1 teaspoon cayenne pepper",
//                     "plain flour , for dusting",
//                     "olive oil",
//                     "watercress",
//                     "tartare sauce",
//                     "The cost per serving",
//                 ],
//                 "category": "Chinese",
//                 "image": "chinese-steak-tofu-stew.jpg"
//             },
//             {
//                 "name":"Thai Chinese Inspired Pinch Salad",
//                 "description": `
//                 Remove the butter from the fridge and allow to soften.
//                 Preheat a griddle pan until really hot.
//                 Butter the rolls on both sides and grill on both sides until toasted and lightly charred (keep an eye on them so they don’t burn).
//                 Trim and dice the celery, chop the lobster meat and combine with the mayonnaise. Season with sea salt and black pepper to taste.
//                 Open your warm grilled buns, shred and pile the lettuce inside each one and top with the lobster mixture. Serve immediately.
//                 Source: https://www.jamieoliver.com/recipes/seafood-recipes/asian-pinch-salad/`,
//                 "email": "shefalig4848@gmail.com",
//                 "ingredients":[
//                     "85 g butter",
//                     "6 submarine rolls",
//                     "500 g cooked lobster meat, from sustainable sources",
//                     "1 stick of celery",
//                     "2 tablespoons mayonnaise , made using free-range eggs",
//                     "½ an iceberg lettuce",
//                 ],
//                 "category":"Chinese",
//                 "image":"thai-chinese-inspired-pinch-salad.jpg"
//             },
//             {
//                 "name":"Spring rolls",
//                 "description": `
//                 To make the brine, toast the peppercorns in a large pan on a high heat for 1 minute, then add the rest of the brine ingredients and 400ml of cold water. Bring to the boil, then leave to cool, topping up with another 400ml of cold water.
//                 Meanwhile, slash the chicken thighs a few times as deep as the bone, keeping the skin on for maximum flavour. Once the brine is cool, add all the chicken pieces, cover with clingfilm and leave in the fridge for at least 12 hours – I do this overnight.
//                 After brining, remove the chicken to a bowl, discarding the brine, then pour over the buttermilk, cover with clingfilm and place in the fridge for a further 8 hours, so the chicken is super-tender.
//                 When youre ready to cook, preheat the oven to 190°C/375°F/gas 5.
//                 Wash the sweet potatoes well, roll them in a little sea salt, place on a tray and bake for 30 minutes.
//                 Meanwhile, make the pickle toast the fennel seeds in a large pan for 1 minute, then remove from the heat. Pour in the vinegar, add the sugar and a good pinch of sea salt, then finely slice and add the cabbage.

//                 Source: https://www.jamieoliver.com/recipes/vegetables-recipes/spring-rolls/`,

//                 "email":"shefalig4848@gmail.com",
//                 "ingredients": [
//                     "4 free-range chicken thighs , skin on, bone in",
//                     "4 free-range chicken drumsticks",
//                     "200 ml buttermilk",
//                     "4 sweet potatoes",
//                     "200 g plain flour",
//                     "1 level teaspoon baking powder",
//                     "1 level teaspoon cayenne pepper",
//                     "1 level teaspoon hot smoked paprika",
//                 ],
//                 "category": "Chinese",
//                 "image": "spring-rolls.jpg"   
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `
//                 Trim and finely chop the spring onions, and pick and finely chop the parsley. Beat the egg.
//                 Combine the crabmeat, potatoes, spring onion, parsley, white pepper, cayenne and egg in a bowl with a little sea salt.
//                 Refrigerate for 30 minutes, then shape into 6cm cakes.
//                 Dust with flour and shallow-fry in oil over a medium heat for about 5 minutes each side or until golden-brown.
//                 Serve with pinches of watercress and a dollop of tartare sauce.

//                 Source:https://www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email": "shefalig4848@gmail.com",
//                 "ingredients":[
//                     "3 spring onions",
//                     "½ a bunch of fresh flat-leaf parsley",
//                     "1 large free-range egg",
//                     "750 g cooked crabmeat , from sustainable sources",
//                     "300 g mashed potatoes",
//                     "1 teaspoon ground white pepper",
//                     "1 teaspoon cayenne pepper",
//                     "plain flour , for dusting",
//                     "olive oil",
//                     "watercress",
//                     "tartare sauce",
//                     "The cost per serving",
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Chinese Steak Tofu Stew",
//                 "description": `
//                 Trim and finely chop the spring onions, and pick and finely chop the parsley. Beat the egg.
//                 Combine the crabmeat, potatoes, spring onion, parsley, white pepper, cayenne and egg in a bowl with a little sea salt.
//                 Refrigerate for 30 minutes, then shape into 6cm cakes.
//                 Dust with flour and shallow-fry in oil over a medium heat for about 5 minutes each side or until golden-brown.
//                 Serve with pinches of watercress and a dollop of tartare sauce.

//                 Source:https://www.jamieoliver.com/recipes/stew-recipes/chinese-steak-tofu-stew/ `,
//                 "email": "shefalig4848@gmail.com",
//                 "ingredients":[
//                     "3 spring onions",
//                     "½ a bunch of fresh flat-leaf parsley",
//                     "1 large free-range egg",
//                     "750 g cooked crabmeat , from sustainable sources",
//                     "300 g mashed potatoes",
//                     "1 teaspoon ground white pepper",
//                     "1 teaspoon cayenne pepper",
//                     "plain flour , for dusting",
//                     "olive oil",
//                     "watercress",
//                     "tartare sauce",
//                     "The cost per serving",
//                 ],
//                 "category": "Chinese",
//                 "image": "chinese-steak-tofu-stew.jpg"
//             },
//             {
//                 "name":"Tom Delay's sweet and sour chicken",
//                 "description": `
//                 Remove the butter from the fridge and allow to soften.
//                 Preheat a griddle pan until really hot.
//                 Butter the rolls on both sides and grill on both sides until toasted and lightly charred (keep an eye on them so they don’t burn).
//                 Trim and dice the celery, chop the lobster meat and combine with the mayonnaise. Season with sea salt and black pepper to taste.
//                 Open your warm grilled buns, shred and pile the lettuce inside each one and top with the lobster mixture. Serve immediately.
//                 Source: https://www.jamieoliver.com/recipes/chicken-recipes/tom-daley-s-sweet-sour-chicken/`,
//                 "email": "shefalig4848@gmail.com",
//                 "ingredients":[
//                     "85 g butter",
//                     "6 submarine rolls",
//                     "500 g cooked lobster meat, from sustainable sources",
//                     "1 stick of celery",
//                     "2 tablespoons mayonnaise , made using free-range eggs",
//                     "½ an iceberg lettuce",
//                 ],
//                 "category":"Chinese",
//                 "image":"tom-daley.jpg"
//             }, 
        
//        ]);           
//     } catch (error){
//      console.log('err',+ error)   

//     }
// }

// insertDymmyRecipeData();