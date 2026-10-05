export const COSTO_ENVIO = 1990;

export const CANTIDAD_MAXIMA = 99;

const CANTIDAD_MINIMA = 1;

/**
 * Convierte un valor Proveniente del input numérico en una cantidad válida.
 * @param {number|string} valor Valor tipeado por el usuario.
 * @returns {number} Entero mayor o igual a 1.
 */
export function normalizarCantidad(valor) {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return CANTIDAD_MINIMA;
    }

    return Math.min(Math.max(Math.trunc(numero), CANTIDAD_MINIMA), CANTIDAD_MAXIMA);
}

/**
 * Indica si el producto se puede seguir aumentando en el carrito.
 * @param {number} cantidad Cantidad actual de la línea.
 * @returns {boolean} Verdadero mientras quede margen antes del tope.
 */
export function puedeAumentar(cantidad) {
    return normalizarCantidad(cantidad) < CANTIDAD_MAXIMA;
}

/**
 * Suma el precio de cada producto multiplicado por su cantidad.
 * @param {Array<{precio: number, cantidad: number}>} items Líneas del carrito.
 * @returns {number} Subtotal de la compra.
 */
export function calcularSubtotal(items) {
    if (!Array.isArray(items)) {
        return 0;
    }

    return items.reduce(
        (total, item) => total + (Number(item.precio) || 0) * normalizarCantidad(item.cantidad),
        0
    );
}

/**
 * @returns {number} Costo de despacho de la tienda.
 */
export function calcularEnvio() {
    return COSTO_ENVIO;
}

/**
 * @param {number} subtotal Subtotal de las líneas del carrito.
 * @param {number} envio Costo de despacho.
 * @returns {number} Total a pagar por la compra.
 */
export function calcularTotal(subtotal, envio) {
    return (Number(subtotal) || 0) + (Number(envio) || 0);
}