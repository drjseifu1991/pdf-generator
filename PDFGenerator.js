const fs = require('fs');
const PDFDocumnet = require('pdfkit')

const tableRow = (doc, heigth) => {
    doc.lineJoin('miter')
      .rect(47.5, heigth, 500, 0)
      .stroke()
    return doc
}

const addText = (doc, text, width, heigth, indent, align) => {
    doc.y = heigth;
    doc.x = width;
    doc.text(text, {
      indent: indent,
      align: align,
    });
    return doc
}

const addImage = (doc, image, x, y, width, heigth) => {
    doc.image(image, x, y, { width: width, heigth: heigth })
}

const generatePdf = (receiptData, dataCallback, endCallback) => {
    try {
        // create pdf document
        const doc = new PDFDocument({ bufferPages: true, margin: 47.5 });

        // adding callback 
        doc.on('data', dataCallback);

        // adding callback when document end
        doc.on('end', endCallback);
      
        // add horizonatal line to pdf
        doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(0, 20).lineTo(595, 21).stroke().fontSize(10)

        // add date text to the pdf
        addText(doc, receiptData.date, 300, 53, 0, 'right')

        // add logo to the pdf
        addImage(doc, "./uploads/logo.jpg", 47.5, 65, 30,30)

        // title to the pdf    
        addText(doc, receiptData.title, 200, 79, 0, 'right')

        doc.moveDown(47.5, 100).fontSize(10)
        
        addText(doc, receiptData.intro, 47.5, 100, 0, 'left')

        addText(doc, receiptData.subHeading, 200, 100, 0, 'right')

        addText(doc, `Name: ${receiptData.name}`, 47.5, 125, 0, 'left')

        addText(doc, `Email: ${receiptData.email}`, 200, 125, 0, 'right')

        addText(doc, receiptData.address, 47.5, 150, 0, 'left')

        addImage(doc, "./uploads/image1.jpg", 47.5, 175, 500,100)

        addText(doc, `Donation ID: ${receiptData.donationID}`, 47.5, 300, 0, 'left')

        addText(doc, `Receipt No: ${receiptData.receiptNumber}`, 47.5, 325, 0, 'left')

        addText(doc, `Receipt created: ${receiptData.receiptCreated}`, 47.5, 350, 0, 'left')

        addImage(doc, "./uploads/image2.jpg", 47.5, 375, 500,100)

        tableRow(doc, 495)
        tableRow(doc, 515)
        tableRow(doc, 535)
        tableRow(doc, 550)

        doc.lineCap('butt').moveTo(270, 495).lineTo(270, 550).stroke()
        doc.lineCap('butt').moveTo(47.5, 495).lineTo(47.5, 550).stroke()
        doc.lineCap('butt').moveTo(547.5, 495).lineTo(547.5, 550).stroke();

        addText(doc, "Donation amount", 47.5, 500, 5, "justify")
        addText(doc, "Contriubtion to fundraising costs", 47.5, 520, 5, "justify")
        addText(doc, "Total", 47.5, 540, 5, "justify")
        addText(doc, receiptData.donationAmount, 270, 500,5, "justify")
        addText(doc, receiptData.contributionToFundraisingCost, 270, 520,5, "justify")
        addText(doc, `${+receiptData.donationAmount + +receiptData.contributionToFundraisingCost}`, 270, 540, 5, "justify")
        addText(doc, receiptData.taxDeductionInfo, 47.5, 575, 0, "center")
        addText(doc, receiptData.outro, 47.5, 600, 0, "center")
        addImage(doc, "./uploads/signature.jpg", 520, 630, 30,30)
        doc
        .text(receiptData.charityName, 55, 645, { align: "left"})
        .text(receiptData.address, 55, 665, { align: "left"})
        .text(receiptData.name, 300, 665, { align: "right", margin:{
            left: 0, right: 7.5, top: 0, bottom: 0
        }})
        doc.end()

    } catch (error) {
        
    }       
}
module.exports = generatePdf