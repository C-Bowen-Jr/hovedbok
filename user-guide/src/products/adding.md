# Adding New Products

To add a new product, go through File -> New Product (hotkey: Ctrl + N). This brings up a modal window. Let's go over the fields now.

**Product Name:** This is the product name for the packing slip. It doesn't need to be unique if you have variants like shirt sizes/colors/etc. That detail will be defined later.

**Product SKU:** This is the full SKU and should be unique between products. Captializing isn’t mandatory, but the common practice is. Also a suggestion that can be ignored if it isn’t your thing, is that variants are suffixed by “_VARIANT”. Examples might be GATORPLUSH, COFFEEMUG, RADSHIRT_MED, ENGRVDZIPPO_2SIDES.

**Variant:** This is the additional part of the product name that encapsulates the variation. This also shows up on the packing slip. You can leave this blank if this isn’t a product variation.

**Current Stock:** This is the current amount of a product you have. If your products are made-to-order, you can put this at either 0 or 1, but you will have to have at least 1 considered in stock at the time of filling out the ledger entry.

**Sold:** This is if you already have sales made. The database file will also contain this information with the right query, but this is a lower effort check to keep track of for your convenience. 

**Release Date:** This, if you care to track it, will store when a product was first made available to your customers. By default, this field auto fills in today’s date, but you can enter a date manually in MM/DD/YYYY format.

**Choose File:** This will let you select one of your product images in the products folder. For best results, square images are best. Variants might require additional image editing to help differentiate if you don’t have separate images for each.