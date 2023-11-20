import React, {useReducer} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ImageList, ImageListItem, Badge } from '@mui/material';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'sonner';
import { saveFile, setReceiptList, setReceiptSelling } from './Store';

export default function ProductImageGrid() {
    const productList = useSelector((state) => state.productList);
    const receiptList = useSelector((state) => state.receiptList);
    const isRestock = useSelector((state) => state.isRestock);

    const dispatch = useDispatch();

    const handleProductClicked = (item) => {
        if (item.quantity === 0) {
            toast.error("Insufficient product stock");
            return;
        }
        if (isRestock) {
            toast.error("Restock mode active, exit first")
            return;
        }
        item.quantity -= 1;
        let previousQuantity = 0;
        if (receiptList.has(item.sku)) {
            previousQuantity = receiptList.get(item.sku).quantity;
        }
        
        receiptList.set(item.sku, {
            myProduct: true,
            title: item.title,
            quantity: previousQuantity + 1,
            variant: item.variant,
            cost: "0.00",
            tags: "",
        });
        const updatedList = new Map(receiptList);
        dispatch(setReceiptList(updatedList));
        dispatch(setReceiptSelling(true));
    };

    const handleAddFor = (item) => {
         item.quantity += 1;
         // Other state changes were tried, including this.forceUpdate()
         const updatedList = new Map();
         dispatch(setReceiptList(updatedList));
    };

    if (productList.length > 0) {
        return (
            <ImageList sx={{ width: 800, height: 560, marginBlock: 0 }} cols={4} rowHeight={200} gap={0}>
                {productList.map((item) => (
                    
                    <ImageListItem key={item.img}>
                        <img
                            src={`${item.img}?w=200&h=200&fit=crop&auto=format`}
                            srcSet={`${item.img}?w=200&h=200&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.title}
                            loading="lazy"
                            onClick={() => handleProductClicked(item)}
                        />
                        {isRestock && (<Fab 
                            sx={{position: "absolute", left: 80, bottom: 50, border: 2, borderColor:"white"}}
                            size="small" 
                            color="primary" 
                            aria-label="add"
                            onClick={() => handleAddFor(item)}>
                            <AddIcon />
                        </Fab>)}
                        <Badge 
                            sx={{left: -20, top: -20}} 
                            badgeContent={item.quantity} 
                            id={item.sku}
                            color={item.quantity > 0 ? "primary" : "warning"}></Badge>
                    </ImageListItem>
                ))}
            </ImageList>
        );
    }
    else {
        return (
            <div sx={{ width: 800, height: 450, padding:12}}>
                <h2>No products</h2>
                <p>Go to File: Add Product</p>
            </div>
        );
    }
}