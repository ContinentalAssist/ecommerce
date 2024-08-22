export default function CurrencyFormatter(currency: string, value: number) {
    const numericValue = Number(value);
    
    if (isNaN(numericValue)) {
        console.error('El valor proporcionado no es un número:', value);
        return null; // O retorna un valor predeterminado o un mensaje de error
    }
    let formattedValue;

    if (currency === 'COP') {
        formattedValue = Math.ceil(numericValue);
    }
    else
    {
    // Mantener siempre dos decimales
    formattedValue = parseFloat(numericValue.toFixed(2));
     
    }
    const integerPart = Math.floor(formattedValue); 
    const decimalPart = (formattedValue - integerPart).toFixed(2).substring(2);


    return (
        <span class='divisa'>
            $ {integerPart}.<small>{decimalPart} {currency}</small>
        </span>
    );
}