export const formatearDinero = (cantidad: number = 0) =>{
    return cantidad.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}