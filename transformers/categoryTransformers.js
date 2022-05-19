var { placesTransformer } = require('../transformers/placeTransformers')

const categoryTransformer = (category) => {
    category.icon = `${process.env.URL + process.env.UPLOADS +  category.icon}`
    if (category?.Places) {
        category.Places = placesTransformer(category.Places)
    }
    return category
}
const categoriesTransformer = (arrayOfCategories) => {
    return arrayOfCategories.map((singleCategory) => categoryTransformer(singleCategory))
}

module.exports = {
    categoryTransformer,
    categoriesTransformer
}