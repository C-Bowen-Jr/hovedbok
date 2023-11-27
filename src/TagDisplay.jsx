import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import OutlinedTagIcon from '@mui/icons-material/LocalOfferOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { setSellTags } from './Store';

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

export default function TagArray() {
    const sellTags = useSelector((state) => state.sellTags);

    const dispatch = useDispatch();

    const handleDelete = (tagToDelete) => {
        const newList = sellTags.filter((checkTag) => checkTag.key !== tagToDelete.key);
        dispatch(setSellTags(newList));
    };

    if (sellTags.length > 0) {
        return (
            <Paper
                elevation={2}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                }}
                component="ul"
            >
                {sellTags.map((data) => {
                    return (
                        <ListItem key={data.key}>
                            <Chip
                                icon={<OutlinedTagIcon />}
                                label={data.label}
                                deleteIcon={<HighlightOffIcon 
                                    sx={{
                                        '&:hover': {
                                            '& > path,use': {
                                                fill: '#f44336',
                                            },
                                        },
                                    }}
                                />}
                                onDelete={() => {handleDelete(data)}}
                            />
                        </ListItem>
                    );
                })}
            </Paper>
        );
    }
}