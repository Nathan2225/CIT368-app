# weather-app
displays 5 increments of weather data at a time. 
Rquires a valid zip code as input and displays both forecast conditions and temperatures




## dependencies
node.js used for backend and logging

express, which is used in server.js, is a web framework for node.js
to install it open terminal and use the command:
npm install express

logging functionality depends on the server to be running
To start, run server.js by typing this command in terminal:
node server.js
After this, open a browser and go to http://localhost:3000/WeatherData.html
Logging details will be displayed in weather.log which is created automatically

jest, is used for unit testing
To test, open terminal and run npm test
jest does not work on html files, so each function being tested was moved to WeatherData.js




## static code test
The SAST I choose was ESLint which helps identify code smells, possible security issues, and other problems.
it requires a config file which should be eslint.config.js in order to be used.
When running this tool using the command "npx eslint WeatherData.js" I received 0 errors and 3 warnings.
All 3 warnings involved 'error' in my catch blocks that wern't being used
The exact message is this:
48:17  warning  'error' is defined but never used  no-unused-vars
63:17  warning  'error' is defined but never used  no-unused-vars
80:18  warning  'error' is defined but never used  no-unused-vars
To fix this, I made sure to add the line "console.error(error);" so 'error' is actually declared and logged to console
After these changes I ran ESLint again and received no error or warning messages




## API
This project uses the National Weather Service (NWS) api which can be accessed through the weather.gov website.
It offers accurate weather forcast data from a trusted government source.
NWS API is completly free, and claims to have a generous request limit made to the API, although this limit is not public.
An API key is not required but rather a User Agent is used to indentify an application which can be an E-mail or website instead of the key.




## Threat modeling
Some threats prior to hardening this application included XSS attacks, code abuse, and injecting scripts.
A cross-site scripting attack could be performed on the input field. 
This threat has been mitigated by sanitizing input, and removing special characters.
Code abuse could occur from a user repeatedly entering invalid zips or input, which could cause a crash. 
This threat has been mitigated through validation which ensures input is eaxctly 5 digits before making a request.
Because logging is being done, weather.log could recieve malicious code or become flooded. 
To mitigate this, logging is done on the server side and input is sanitized so logs will only be made for valid zips.
One threat that is not accounted for is a DOS (denial of service) attack which can be caused from an overload of requests to the api.
This could lead to a 429 error(too many request) and prevent the app from working as intended which compromises avaliability.
