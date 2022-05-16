const placeTransformer = (place) => {
    place.picture = `${process.env.URL + process.env.UPLOADS + place.picture}`
    if (place.distance) {
        place.distance = parseFloat(place.distance.toFixed(2))
    }
    if (place.latitude) {
        place.latitude = parseFloat(place.latitude)
    }
    if (place.longitude) {
        place.longitude = parseFloat(place.longitude)
    }
    return place
}
const placesTransformer = (ArrayOfPlaces) => {
    return ArrayOfPlaces.map((singleplace) => placeTransformer(singleplace))
}
module.exports = {
    placeTransformer,
    placesTransformer
}