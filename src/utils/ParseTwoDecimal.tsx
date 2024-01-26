export function ParseTwoDecimal(number : any = 0)
{
    if (number !== null) 
    {
        const num = number.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];    
      
        return Number(num).toFixed(2);  
    }
}