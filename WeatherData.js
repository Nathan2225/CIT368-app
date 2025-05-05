//white listed validation for a zip code
function validateZip(zip){
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
}



//validate incoming data from the API itself
function isValidForecast(forecast) {
    return forecast &&
        typeof forecast.name === 'string' &&
        typeof forecast.shortForecast === 'string' &&
        typeof forecast.temperature === 'number';
}



//sanitize unwanted input/characters
function sanitizeInput(input) {
    return input.replace(/[^\d]/g, '');
}


// https://www.w3schools.com/html/html_entities.asp
function encode(str){
    return str
    .replace(/</g, "&lt")
    .replace(/>/g, "&gt")
    .replace(/&/g, "&amp")
    .replace(/"/g, "&quot")
    .replace(/'/g, "&apos")


}






    async function getCoords(zipCode){
        try {
            let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${zipCode},USA`);
            let data = await response.json();
            if (data.length === 0) throw new Error("Invalid ZIP code");
            return {lat:data[0].lat, lon: data[0].lon };
        }catch (error) {
            console.error(error);
            throw new Error("Error: coordinates not found")
        }
    }



    //weather.gov api is used instead since email is required over API key
    async function getForecastAPI(lat, lon) {
        try{
            let response = await fetch(`https://api.weather.gov/points/${lat},${lon}`, {
                headers: { "User-Agent": "nxk22@pct.edu" }
            });
            let data = await response.json();
            return data.properties.forecast;
        }catch (error) {
            console.error(error);
            throw new Error("Error: API not found");
        }
        
    }




    async function getForecastData(url){
        try{
            let response = await fetch(url, {
                headers: { "User-Agent": "nxk22@pct.edu" }

            });
            let data = await response.json();
            return data.properties.periods.slice(0, 5);
        } catch (error) {
            console.error(error);
            throw new Error("Error: forecast data not found")
        }
    }





     function displayForecast(forecasts) {
        let resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "";

        forecasts.forEach(day => {
            if (!isValidForecast(day)) return;

            //used to display/format weather data
            resultDiv.innerHTML += `
            <div>
                <h4>${encode(day.name)}</h4>
                <p>${encode(day.shortForecast)}, <strong>${encode(day.temperature.toString())}°F</strong></p>
            </div>
            `;
        });
     }  

        



    async function getWeather() {
        var rawZip = document.getElementById("zipCode").value.trim()
        var zipCode = sanitizeInput(rawZip);
        var errorDiv = document.getElementById("errorMessage");
        var resultDiv = document.getElementById("result");


        errorDiv.innerHTML = "";
        resultDiv.innerHTML = "";


        if (!validateZip(zipCode)){
            errorDiv.innerHTML = "please enter a valid 5 digit zip code";
            return;
        }


        try{
            let { lat, lon} = await getCoords(zipCode);
            let forecastAPI = await getForecastAPI(lat, lon);
            let forecasts = await getForecastData(forecastAPI);
            displayForecast(forecasts);

            //for logging
            const forecastSummary = forecasts.map(day =>
                `${day.name} - ${day.shortForecast} - ${day.temperature}°F`
            ).join(', ');

            fetch('http://localhost:3000/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    zip: zipCode,
                    lat: lat,
                    lon: lon,
                    forecast: forecastSummary
                })
            }).catch(err => console.error("logging error:", err));

        } catch (error) {
            console.error("Error:", error);
            resultDiv.innerHTML = "<p>Error: no data found </p>";
        }
    }

    module.exports = {
        validateZip,
        sanitizeInput,
        getCoords,
        getForecastAPI,
        getForecastData,
        isValidForecast,
        encode,
        displayForecast,
        getWeather
    };
