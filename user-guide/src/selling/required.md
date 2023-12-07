# Selling Basics

The Selling tab is used to save records of sales and create packing slips for them.

The following are required fields:

**Expense:** Your shipping cost. Note: do not add etsy fees at this point.

**Earnings:** Your gross earnings for the sale.

**Fee:** This has 3 buttons for proper usage.
 - Etsy: Requires a valid Earnings and all items that will be on the receipt. Click products to add them.
 - PayPal: Same prerequists as Etsy. This is the correct button for other platforms that handle through PayPal like Shopify or BigCartel.
 - Manual: This button enables the Fee field for manual entry.

 **Address:** This is the address you are shipping to. It will appear on the packing slip.

**Your Products:** The grid of images of your products. The green dot at the bottom right is your current inventory level. Click to add to the order; it will populate on the receipt. Each click adds one to the receipt, and removes 1 from stock.

 On the next page, we'll go over fields we missed. You can skip them if you wish.

 ## Print

 Print becomes available when the required fields are filled in. This brings up the print preview. If everything looks accurate, you can click the print option in the preview window to print.

 ## Submit

 This finilizes the log and pushes changes to the database. It also saves quantity changes to stock, which are stored in /resource/data.json. A cancel instead would return those items back to stock.

 ## Clear / Cancel

 Clear becomes available and replaces the Submit button on a successfully logged database update. Both of these buttons will clear all fields to ready for the next order.
