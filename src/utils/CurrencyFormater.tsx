export default function CurrencyFormatter(currency:string,value:number)
{
    let fractionDigits = 0

    if(currency != 'COP')
    {
        fractionDigits = 2
    }

    return(
        // Math.ceil(total).toLocaleString('es-LA',{
        //     style:'currency',
        //     currency:currency,
        //     minimumFractionDigits:fractionDigits,
        //     maximumFractionDigits:fractionDigits
        // })
        Intl.NumberFormat('es',{
            style:'currency',
            minimumFractionDigits:fractionDigits,
            maximumFractionDigits:fractionDigits,
            currencyDisplay:'code',
            currency:currency
        }).format(Math.ceil(value))
    )
}