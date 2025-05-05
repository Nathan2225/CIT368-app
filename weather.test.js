const {
    getCoords,
    getForecastAPI,
    getForecastData,
    validateZip
  } = require('./WeatherData'); 

global.fetch = jest.fn();

//Test 1: confirm weather received with valid ZIP
test('Weather is received with valid ZIP', async () => {
    //mocks getCoords to return lat and lon
    fetch.mockImplementationOnce(() =>
        Promise.resolve({
            json: () => Promise.resolve([
                //test cords
                { lat: "33.9748387", lon: "-118.2456835" } 
            ])
        })
    );

    //mocks getForecastAPI to return a forecast URL
    fetch.mockImplementationOnce(() =>
        Promise.resolve({
            json: () => Promise.resolve({
                //url
                properties: { forecast: "https://api.weather.gov/gridpoints/forecast-url" }
            })
        })
    );

    //mocks getForecastData to return weather data
    fetch.mockImplementationOnce(() =>
        Promise.resolve({
            json: () => Promise.resolve({
                properties: {
                    periods: [
                        //example test weather data
                        { name: "Today", shortForecast: "Sunny", temperature: 70 },
                        { name: "Friday", shortForecast: "Clear", temperature: 55 }
                    ]
                }
            })
        })
    );

    const coords = await getCoords("20500");
    const forecastUrl = await getForecastAPI(coords.lat, coords.lon);
    const forecasts = await getForecastData(forecastUrl);
    //properties
    expect(forecasts.length).toBeGreaterThan(0);
    expect(forecasts[0]).toHaveProperty("name");
    expect(forecasts[0]).toHaveProperty("shortForecast");
    expect(forecasts[0]).toHaveProperty("temperature");
});


//Test 2: confirm error on invalid ZIP
test('validateZip rejects non-5-digit ZIPs', () => {
    expect(validateZip('123')).toBe(false);      // short
    expect(validateZip('123456')).toBe(false);   // long
    expect(validateZip('abcde')).toBe(false);    // letters
    expect(validateZip('!@#$*')).toBe(false);    // special characters
    expect(validateZip('1a<p>')).toBe(false);    // mixed
});



//Test 3: confirm expected API response on valid ZIP
test('confirm expected API response on valid ZIP coordinates', async () => {
    const mockURL = "https://api.weather.gov/gridpoints/XYZ/42,78/forecast";

    //mock fetch response
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({
                properties: { forecast: mockURL }
            })
        })
    );
    //example coords
    const result = await getForecastAPI("40.7398524", "-73.9851747"); 
    expect(result).toBe(mockURL);

    //check fetch/url
    expect(fetch).toHaveBeenCalledWith(
        "https://api.weather.gov/points/40.7398524,-73.9851747",
        expect.objectContaining({
            headers: expect.objectContaining({ "User-Agent": "nxk22@pct.edu" })
        })
    );
});




//Test 4: confirm handing of unexpected error from API
test('confirm handling of unexpected error from API', async () => {
    //mocks fetch throwing an error
    global.fetch = jest.fn(() => Promise.reject(new Error("Unexpected API failure")));

    await expect(getForecastAPI("40.8615926", "-76.7821724"))
        .rejects
        .toThrow("Error: API not found");
});