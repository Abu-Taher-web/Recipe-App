import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
     try {
        const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
        // console.log(res);
        this.title = res.data.recipe.title;
        this.author = res.data.recipe.publisher;
        this.img = res.data.recipe.image_url;
        this.url = res.data.recipe.source_url;
        this.ingredients = res.data.recipe.ingredients;
     } catch (error) {
         console.log(error);
     }
    }

    calcTime(){
        // assuming that we need 15 minute for each 3 ingredient to cook
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoon', 'tablespoons', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        // refine ingredients each data item
        const newIngredients = this.ingredients.map(el => {
            //1 uniforms the unit in each el string
            let ingredient = el.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //2 remove parentheses
            ingredient = ingredient.replace(/[\])}[{(]/g, '');

            //3 parse ingredients into count, unit, and inggredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                //there is a unit
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else{
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                };
            } else if (parseInt(arrIng[0], 10)) {
                // there is no unit but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit:'',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // there is no unit no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            //return ingredient;
            return objIng;
        });

        this.ingredients = newIngredients;
    }
    updateServings(type){
        //servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}


