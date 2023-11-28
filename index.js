import express from "express"
import axios from "axios"
import bodyParser from "body-parser"

// using express and define port
const app = express();
const port = 3000;

// Allow express to use public folder's contents and include bodyParser
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// Get route
app.get("/", async (req,res)=>{
    try{
        // using axios to hit the get route of API and filtering the response for our use.
        const response = await axios.get("https://v6.exchangerate-api.com/v6/e84d2a5918a9e263e76ff37a/latest/AED");
        const result = response.data.conversion_rates;
        var lastUpdated = response.data.time_last_update_utc;
        var countryCode = [], rates = [];

        // Using axios to hit the get route of country codes.
        const country = await axios.get("https://v6.exchangerate-api.com/v6/e84d2a5918a9e263e76ff37a/codes");
        const allCountryNames = country.data.supported_codes;
        var countryNames = [];
        
        for(let index = 0; index < allCountryNames.length; index++){
            countryNames.push(allCountryNames[index][1]);
        }

        // Obtained result is in key-value pair JS object format
        // Store keys in one and values in another array.
        Object.keys(result).forEach(key =>{
            const value = result[key];
            countryCode.push(key);
            rates.push(value);
        });

        res.render("index.ejs", {
            allCountry : countryCode,
            allRates : rates,
            countryName : countryNames,
            inputValue : "",
            convertedValue : "",
            lastTimeUpdated : lastUpdated
        });
    }
    // Error handling
    catch(error){
        console.log(error.message);
    };
});

// Post Route
app.post("/", async (req,res)=>{
    try{
        // using axios to hit the get route of API and filtering the response for our use.
        const response = await axios.get("https://v6.exchangerate-api.com/v6/e84d2a5918a9e263e76ff37a/latest/AED");
        const result = response.data.conversion_rates;
        var lastUpdated = response.data.time_last_update_utc;
        var countryCode = [], rates = [];

        // using axios to hit the get route of country codes.
        const country = await axios.get("https://v6.exchangerate-api.com/v6/e84d2a5918a9e263e76ff37a/codes");
        const allCountryNames = country.data.supported_codes;
        var countryNames = [];
        
        for(let index = 0; index < allCountryNames.length; index++){
            countryNames.push(allCountryNames[index][1]);
        }

        // Obtained result is in key-value pair JS object format
        // Store keys in one and values in another array.
        Object.keys(result).forEach(key =>{
            const value = result[key];
            countryCode.push(key);
            rates.push(value);
        });

        // Extract values submitted in form and calculate result.
        var base = response.data.conversion_rates[req.body["base-currency"]];
        var value = req.body.value;
        var target = response.data.conversion_rates[req.body["conversion-currency"]];
        var calculated = (target/base)*value;

        res.render("index.ejs", {
            allCountry : countryCode,
            allRates : rates,
            countryName : countryNames,
            inputValue : parseFloat(value).toFixed(3) + " " + req.body["base-currency"],
            convertedValue : calculated.toFixed(3) + " " + req.body["conversion-currency"],
            lastTimeUpdated : lastUpdated
        });
    }
    // Error handling
    catch(error){
        console.log(error.message);
    }
});

// Listening to port 3000
app.listen(port, ()=>{
    console.log(`Server started successfully on port ${port}`);
});