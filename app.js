const express = require("express");
const bodyParser = require('body-parser');
const licenseKeyGen = require('license-key-gen');
const app = express();

app.use("/", express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.post('/validate-license', (req, res) => {
  const expiredUsers = ['B', 'A'];
  const licenseKey = req.body.licenseKey;
  const username = req.body.username;

  if (expiredUsers.includes(username)) {
    res.send('License key expired');
  } else {
    // Generate the expected license key based on the provided code
    const studentUser = { company: username };
    const licenseData = { info: studentUser, prodCode: 'EEN850392', appVersion: '1.0' };

    try {
      const aexpectedLicenseKey = licenseKeyGen.createLicense(licenseData);
      const expectedLicenseKey = aexpectedLicenseKey.license;
      console.log(aexpectedLicenseKey);
      console.log(expectedLicenseKey)
      if (licenseKey === expectedLicenseKey) {
        res.send('License key valid');
      } else {
        res.send('Invalid license key');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Error generating license key');
    }
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server starting on port " + port);
});
