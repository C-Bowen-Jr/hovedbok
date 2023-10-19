import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@mui/base/Button';
// As iframe.write() <href="">, working dir is /public

function htmlNewLine(text) {
    return text.replaceAll(String.fromCharCode(10), "<br>").replaceAll(String.fromCharCode(13), "<br>");
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function PackingSlip(props) {
    const address = htmlNewLine("Test Address");
    //const receiptList = props.receipt;
    //const giftMessage = props.message;
    const giftMessage = ""; //useSelector((state) => state.giftMessage);
    const receiptList = useSelector((state) => state.receiptList);
    const currentOrderNumber = useSelector((state) => state.currentOrderNumber);
    const handlePrint = () => {
        const iframe = document.getElementById('print-frame');
        const content = iframe.contentWindow.document;

        const todays_date = new Date();

        const headerHTML = `
        <div class="header">
            <div class="company-name">
                <h1>Company Name</h1>
                <h2>CompanyWebsite.com</h2>
            </div>
            <div class="ship-label">Ship To:</div>
            <div class="ship-content">${address}</div>
            <div class="order-label">
                Order #:<br>
                Date:<br>
            </div>
            <div class="order-content">
                ${currentOrderNumber}
                ${todays_date.getMonth() + 1}/${todays_date.getDate()}/${todays_date.getFullYear()}
            </div>
            <div class="company-logo"><img width="120px" src="./logo.png" /></div>
        </div>
    `;

        let giftHTML = "";
        if (giftMessage.length > 0) {
            giftHTML = `
            <div class="gift-message">
                <h1>Gift Message:</h1>
                <p>${giftMessage}</p>
            </div>
        `;
        }

        let lines = "";
        Array.from(receiptList).forEach((item) => {
            lines += `<li key="${item[0]}">${item[1].quantity} x ${item[0]}`;
        });
        const bodyHTML = `
        <div class="body">
            <ul>
                ${lines}
            </ul>
            ${giftHTML}
        </div>
    `;

        content.open();
        content.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Packing Slip</title>
          <link rel="stylesheet" type="text/css" href="PackingSlip.css">
        </head>
        <body>
          <div class="packing-slip">
            ${headerHTML}
            ${bodyHTML}
            <div class="footer"></div>
          </div>
        </body>
      </html>
    `);
        content.close();

        
        sleep(500).then(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        });
        //document.getElementById("status-printed").checked = true;
    };

    return (
        <>
            <Button onClick={handlePrint} className="btn bold">Print</Button>
            <iframe id="print-frame" title="Packing Slip" style={{ display: 'none' }} />
        </>
    );
};

export default PackingSlip;