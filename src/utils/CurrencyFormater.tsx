export default function CurrencyFormatter(currency:string,value:number)
{
    let fractionDigits = 0

    if(currency != 'COP')
    {
        fractionDigits = 2
    }
    else
    {
        // value = Math.ceil(value)
        // value = Number(String(value).replace(/\.00$/, ''))
    }

    // Math.ceil(total).toLocaleString('es-LA',{
        //     style:'currency',
        //     currency:currency,
        //     minimumFractionDigits:fractionDigits,
        //     maximumFractionDigits:fractionDigits
        // })


    let newValue = Intl.NumberFormat('es-MX',{
        style:'currency',
        minimumFractionDigits:fractionDigits,
        maximumFractionDigits:fractionDigits,
        currencyDisplay:'code',
        currency:currency||'USD'
    }).format(value)

    newValue = newValue.replace(/[a-z]{3}/i, "").trim()
    newValue = newValue.replace(/\.00$/, '')

    // newValue = '$'+newValue+' '+currency

    return(
        <span class='divisa'>{'$'+newValue.split(/\.|,/)[0]+'.'}<small>{newValue.split(/\.|,/)[1]+' '+currency}</small></span>
    )
}