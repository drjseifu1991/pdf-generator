const express = require('express')
const multer = require('multer')
const generatePdf = require('./PDFGenerator')
const path = require('path')

const app = express()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      /*Appending extension with original name*/
      cb(null, file.fieldname + path.extname(file.originalname)) 
    }
})
  
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

// upload imagas to upload folder
const cpUpload = upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, {name: 'signature', maxCount: 1}])

//call pdf generator and the pdf generetor function will create pdf and send back the pdf
app.post('/generate', cpUpload, function (req, res) {
    const receiptData = {
        date: req.body.date,
        title: req.body.title,
        intro: req.body.intro,
        subHeading: req.body.subHeading,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address, 
        donationID: req.body.donationID,
        receiptNumber: req.body.receiptNumber,
        receiptCreated: req.body.receiptCreated,
        donationAmount: req.body.donationAmount,
        contributionToFundraisingCost: req.body.contributionToFundraisingCost,
        taxDeductionInfo: req.body.taxDeductionInfo,
        outro: req.body.outro,
        charityName: req.body.charityName
    }

    // stream the pdf to the client
    const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment;filename=invoice.pdf`,
      });
      generatePdf(
        receiptData,
        (chunk) => stream.write(chunk),
        () => stream.end()
      )
})
 
app.listen(3000, () => {
    console.log("App is listening on port 3000")
})