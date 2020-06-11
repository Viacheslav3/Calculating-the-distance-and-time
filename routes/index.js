var express = require('express');
var router = express.Router();
var axios = require("axios");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/api/getRouteDistance', async function (request, response, next) {
    const points = JSON.parse(request.query.points);

    let originCountryResponse;

    const result = await axios.get(`https://nominatim.openstreetmap.org/search?country=${points.originPoint.country}&postalcode=${points.originPoint.zipcode}&format=json`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 YaBrowser/20.6.0.910 Yowser/2.5 Yptp/1.23 Safari/537.36'
        }
    });
    if (result.data.length)
        originCountryResponse = result.data[0];
    else {
        return response.send( {
            status: 404,
            success: false,
            error: {
                description: "Couldn't find the origin country."
            }
        });
    }

    let destinationCountryResponse;
    const resultDestination = await axios.get(`https://nominatim.openstreetmap.org/search?country=${points.destinationPoint.country}&postalcode=${points.destinationPoint.zipcode}&format=json`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 YaBrowser/20.6.0.910 Yowser/2.5 Yptp/1.23 Safari/537.36'
        }
    });

    if (resultDestination.data.length)
        destinationCountryResponse = resultDestination.data[0];
    else {
        return response.send({
            status: 404,
            success: false,
            error: {
                description: "Couldn't find the destination country."
            }
        });
    }



    const destinationLatitude = destinationCountryResponse.lat;
    const destinationLongitude = destinationCountryResponse.lon;

    const originLatitude = originCountryResponse.lat;
    const originLongitude = originCountryResponse.lon;

    let distanceResult;
    const resultFromDistanceApi = await axios.get(`https://graphhopper.com/api/1/route?point=${originLatitude},${originLongitude}&point=${destinationLatitude},${destinationLongitude}&vehicle=car&locale=en&calc_points=false&key=2f9d07dc-39fa-4a15-b294-e9d363caa7fd`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 YaBrowser/20.6.0.910 Yowser/2.5 Yptp/1.23 Safari/537.36'
        }
    });
    distanceResult = resultFromDistanceApi.data.paths[0];

    return response.send({
        success: true,
        result: {
            data: {
                distance: distanceResult.distance / 1000,
                time: distanceResult.time / 1000 / 60,
            }
        }
    });
})

module.exports = router;
