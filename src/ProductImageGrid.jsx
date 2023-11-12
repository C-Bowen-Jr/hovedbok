import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ImageList, ImageListItem, Badge } from '@mui/material';
import { setReceiptList, setReceiptSelling } from './Store';

export default function ProductImageGrid() {
    const productList = useSelector((state) => state.productList);
    const receiptList = useSelector((state) => state.receiptList);

    const dispatch = useDispatch();

    const handleProductClicked = (item) => {
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
                        <Badge sx={{left: -15, top: -15}} badgeContent={item.quantity} color="primary"></Badge>
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