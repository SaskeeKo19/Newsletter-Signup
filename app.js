require("dotenv").config();

//Constant Require Section

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const mime = require("mime");
const https = require("https");
const { log } = require("console");

const app = express();

// *** ENV CONFIG ***
const config = {
	api_key: process.env.API_KEY,
	list_id: process.env.LIST_ID,
};

// *** Body Parser **

app.use(bodyParser.urlencoded({ extended: true }));

// *** Static Folder ***
app.use(
	express.static("styless", {
		setHeaders: (res, path) => {
			if (path.endsWith(".css")) {
				res.setHeader("Content-Type", "text/css");
			}
		},
	})
);

// *** Tracking HTML File ***

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/signup.html");
});

// *** Signup Route **

app.post("/", (req, res) => {
	const firstName = req.body.fname;
	const lastName = req.body.lname;
	const mail = req.body.emailid;
	const interest = req.body.genre;
	const textBox = req.body.othertopics;

	console.log(firstName, lastName, mail, interest, textBox);

	// *** Construct Requesting data ***

	const data = {
		members: [
			{
				email_address: mail,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
					GENRE: interest,
					SUGGESTION: textBox,
				},
			},
		],
	};
	// *** Stringify inputed data ***
	const jsonData = JSON.stringify(data);
	// *** url = "https://<data center>.api.mailchimp.com/3.0/lists/{listID}

	const url = `https://us21.api.mailchimp.com/3.0/lists/${config.list_id}`;
	const options = {
		method: "POST",
		auth: `SaskeeKo19:${config.api_key}`,
	};

	const request = https.request(url, options, (response) => {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", () => {
			console.log(JSON.parse(jsonData));
		});
	});
	request.write(jsonData);
	request.end();
});

app.post("/fail", (req, res) => {
	console.log("Redirecting to homepage...");
	res.redirect("/");
});

app.listen(4200, () => {
	console.log("The server is good to go.");
});
