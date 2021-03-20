const express = require('express');

const {
    google
} = require('googleapis');


const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
    extended: true
}));


app.get('/', (req, res) => {

    res.render("index");

});


app.post('/', async function (req, res) {

    const {
        name,
        rollNumber
    } = req.body;


    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({
        version: "v4",
        auth: client
    });

    const spreadsheetId = "1vkE37oz9_WQI4lFJSY7oHZga3VbqQhNDI0BdVaBqumY";

    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    // Read rows from spreadsheet

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "2K19!C6:C195",
    });
    const getRows1 = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "2K19!CD6:CD195",
    });

    const rollNo = getRows.data.values;
    const studentId = rollNumber;
    let index = 0;
    for (let i = 0; i <= rollNo.length; i++) {
        if (rollNo[i][0] === studentId) {
            console.log("Found");
            console.log("Number of Hours worked");
            index = i;
            break;
        }
    }
    const hours = getRows1.data.values;
    console.log(hours[index][0]);

});


app.listen(3000, function () {
    console.log('server is up and running on port 3000');
});