import React, {useReducer, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { ImageList, ImageListItem, Badge } from '@mui/material';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/EditNote';
import { listen } from '@tauri-apps/api/event';
import { toast } from 'sonner';
import { editSku, saveFile, setReceiptList, setReceiptSelling, setRestock, setEditing } from './Store';

export default function ProductImageGrid() {
    const productList = useSelector((state) => state.productList);
    const receiptList = useSelector((state) => state.receiptList);
    const isRestock = useSelector((state) => state.isRestock);
    const isEditing = useSelector((state) => state.isEditing);

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

    const handleEditFor = (item) => {
        dispatch(editSku(item.sku));
    };

    useEffect(() => {
        listen("menu-event", (e) => {
            if (e.payload == "sale-mode") {
                dispatch(setRestock(false));
                dispatch(setEditing(false));
                dispatch(saveFile());
            }
            else if (e.payload == "restock-mode") {
                dispatch(setEditing(false));
                dispatch(setRestock(true));
            }
            else if (e.payload == "edit-product-mode") {
                dispatch(editSku(undefined));
                dispatch(setRestock(false));
                dispatch(setEditing(true));
            }
        })
    }, []);

    if (productList.length > 0) {
        return (
            <ImageList sx={{ width: 800, height: 560, marginBlock: 0 }} cols={4} rowHeight={200} gap={0}>
                {productList.map((item) => (
                    
                    <ImageListItem key={item.img}>
                        <img
                            src={convertFileSrc(item.img)}
                            onError={({ currentTarget}) => {
                                currentTarget.onerror = null;
                                currentTarget.src=item.img;
                            }}
                            alt={item.title}
                            className="product_image"
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
                        {isEditing && (<Fab 
                            sx={{position: "absolute", left: 80, bottom: 50, border: 2, borderColor:"white"}}
                            size="small" 
                            color="secondary" 
                            aria-label="edit"
                            onClick={() => handleEditFor(item)}>
                            <EditIcon />
                        </Fab>)}
                        <Badge 
                            sx={{left: -20, top: -20}} 
                            badgeContent={item.quantity} 
                            id={item.sku}
                            color={item.quantity > 1 ? "primary" : "warning"}></Badge>
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