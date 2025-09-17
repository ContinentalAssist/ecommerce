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
            // Usar currency style para evitar truncamiento y obtener formato completo
            formattedValue = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numericValue);
            
            // Remover el símbolo COP que agrega automáticamente
            formattedValue = formattedValue.replace(/\s*COP\s*/, '').replace(/^\$\s*/, '');
            currencySymbol = 'COP';
            break;
            
        case 'MXN':
            formattedValue = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numericValue);
            
            formattedValue = formattedValue.replace(/\s*MXN\s*/, '').replace(/^\$\s*/, '');
            currencySymbol = 'MXN';
            break;
            
        case 'USD':
        default:
            formattedValue = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numericValue);
            
            formattedValue = formattedValue.replace(/^\$\s*/, '');
            currencySymbol = 'USD';
            break;
    }
    
    // Separar la parte entera y decimal
    const parts = formattedValue.split(/[.,]/); // Usar regex para manejar tanto punto como coma
    const decimalPart = parts[parts.length - 1]; // La última parte es siempre decimal
    const integerPart = parts.slice(0, -1).join(''); // Todo excepto la última parte
    
    // Para COP, asegurar que use comas como separador de miles
    let formattedIntegerPart;
    if (currency === 'COP') {
        // Reformatear con comas como separador de miles
        formattedIntegerPart = parseInt(integerPart.replace(/[.,]/g, ''))
            .toLocaleString('es-CO');
    } else {
        formattedIntegerPart = integerPart;
    }
    
    return (
        <span class='divisa'>
            $ {formattedIntegerPart}.<small>{decimalPart} {currencySymbol}</small>
        </span>
    );
}