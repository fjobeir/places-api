const placeTransformer = (place) => {
    place.picture = `${process.env.URL + process.env.UPLOADS + place.picture}`
    return place
}
const placesTransformer = (ArrayOfPlaces) => {
    return ArrayOfPlaces.map((singleplace) => placeTransformer(singleplace))
}
module.exports = {
    placeTransformer,
    placesTransformer
}