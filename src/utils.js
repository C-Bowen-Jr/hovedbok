import {FormattedNumber} from 'react-intl';

export function format_date(date) {
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
};

export function format_date_db(date) {
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

export function formatCurrency(value) {
    const formattedValue = parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formattedValue;
};