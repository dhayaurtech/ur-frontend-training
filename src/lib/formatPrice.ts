export function formatPrice(amount:number):string{
    const price = Intl.NumberFormat("en-IN",{
        style:'currency',
        currency:'INR',
        minimumFractionDigits:2,
        maximumFractionDigits:2
    }).format(amount);

    return price;
}

