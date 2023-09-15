import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import OutlinedTagIcon from '@mui/icons-material/LocalOfferOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

export default function TagArray() {
    const [chipData, setChipData] = React.useState([
        { key: 0, label: 'Angular' },
        { key: 1, label: 'jQuery' },
        { key: 2, label: 'Polymer' },
        { key: 3, label: 'React' },
        { key: 4, label: 'Vue.js' },
    ]);

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };

    if (chipData.length > 0) {
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
                {chipData.map((data) => {
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
                                onDelete={handleDelete(data)}
                            />
                        </ListItem>
                    );
                })}
            </Paper>
        );
    }
}