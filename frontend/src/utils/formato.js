const formateadorPesosChilenos = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
});

export function formatearPrecio(valor) {
    return formateadorPesosChilenos.format(valor);
}

export default formatearPrecio;
