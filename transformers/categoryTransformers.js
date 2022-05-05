const categoryTransformer = (category) => {
    category.icon = `${process.env.URL + process.env.UPLOADS +  category.icon}`
    return category
}
const categoriesTransformer = (arrayOfCategories) => {
    return arrayOfCategories.map((singleCategory) => categoryTransformer(singleCategory))
}

module.exports = {
    categoryTransformer,
    categoriesTransformer
}