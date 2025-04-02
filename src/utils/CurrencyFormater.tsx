
export default function CurrencyFormatter(currency: string, value: number) {

    const numericValue = Number(value);
    
    if (isNaN(numericValue)) {
        console.error('El valor proporcionado no es un número:', value);
        return null; // O retorna un valor predeterminado o un mensaje de error
    }

    let formattedValue;
    let currencySymbol;

    switch (currency) {
        case 'COP':
            formattedValue = new Intl.NumberFormat('es-CO', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numericValue);
            currencySymbol = 'COP';
            break;
        case 'MXN':
            formattedValue = new Intl.NumberFormat('es-MX', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numericValue);
            currencySymbol = 'MXN';
            break;
        case 'USD':
            default:
            formattedValue = new Intl.NumberFormat('en-US', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numericValue);
            currencySymbol = 'USD';
            break;
    }

    // Separar la parte entera y decimal
    const parts = formattedValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? parts[1] : '00'; // Asegurarse de que haya dos decimales

    // Para COP, cambiar el punto por una coma en la parte decimal
    const formattedIntegerPart = currency === 'COP' ? integerPart.replace(/\./g, ',') : integerPart;

    return (
        <span class='divisa'>
            $ {formattedIntegerPart}.<small>{decimalPart} {currencySymbol}</small>
        </span>
    );
}