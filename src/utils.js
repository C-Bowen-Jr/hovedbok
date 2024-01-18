import {FormattedNumber} from 'react-intl';

export function format_date(date) {
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
};

export function format_date_db(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

export function formatCurrency(value) {
    const formattedValue = parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formattedValue;
};