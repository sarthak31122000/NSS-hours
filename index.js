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
    let year = rollNumber.slice(0, 4);
    year = year.toUpperCase();
    let lastCol = "";
    if (year === "2K19") {
        lastCol = "CD";
    } else if (year === "2K20") {
        lastCol = "AT"
    }
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: year + "!C6:C1000",
    });
    const getRows1 = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: year + "!" + lastCol + "6:" + lastCol + "1000",
    });

    const rollNo = getRows.data.values;

    const studentId = rollNumber;
    let index = -1;
    for (let i = 0; i <= rollNo.length; i++) {
        if (rollNo[i][0] === studentId) {
            console.log("Found");
            console.log("Number of Hours worked");
            index = i;
            break;
        }
    }
    const hours = getRows1.data.values;
    if (index != -1) {
        console.log(hours[index][0]);
        return res.redirect('back');
    } else {
        console.log("not found");
        return res.redirect('back');
    }


});


app.listen(3000, function () {
    console.log('server is up and running on port 3000');
});