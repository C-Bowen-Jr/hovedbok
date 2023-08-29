import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { setReceiptList, setReceiptSelling } from './Store';

export default function ProductImageGrid() {
    const productList = useSelector((state) => state.productList);
    const receiptList = useSelector((state) => state.receiptList);

    const dispatch = useDispatch();

    const handleProductClicked = (item) => {
        let previousQuantity = 0;
        if (receiptList.has(item.title)) {
            previousQuantity = receiptList.get(item.title).quantity;
        }
        
        receiptList.set(item.title, {
            myProduct: true,
            quantity: previousQuantity + 1,
            cost: 0.0,
            tags: "",
        });
        const updatedList = new Map(receiptList);
        dispatch(setReceiptList(updatedList));
        dispatch(setReceiptSelling(true));
    };

    if (productList.length > 0) {
        return (
            <ImageList sx={{ width: 800, height: 450 }} cols={4} rowHeight={200} gap={0}>
                {productList.map((item) => (
                    <ImageListItem key={item.img}>
                        <img
                            src={`${item.img}?w=200&h=200&fit=crop&auto=format`}
                            srcSet={`${item.img}?w=200&h=200&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.title}
                            loading="lazy"
                            onClick={() => handleProductClicked(item)}
                        />
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

//const itemData = useSelector((state) => state.productList);

const itemData2 = [
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
    },
    {
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
    },
    {
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Camera',
    },
    {
        img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        title: 'Coffee',
    },
    {
        img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        title: 'Hats',
    },
    {
        img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        title: 'Honey',
    },
    {
        img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        title: 'Basketball',
    },
    {
        img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        title: 'Fern',
    },
    {
        img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        title: 'Mushrooms',
    },
    {
        img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
        title: 'Tomato basil',
    },
    {
        img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
        title: 'Sea star',
    },
    {
        img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
        title: 'Bike',
    },
];