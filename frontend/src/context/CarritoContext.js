import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
    calcularEnvio,
    calcularSubtotal,
    calcularTotal,
    normalizarCantidad
} from '../utils/carrito';

export const CLAVE_CARRITO = 'hh_carrito';

const CarritoContext = createContext(null);

function leerCarritoGuardado() {
    try {
        const contenido = localStorage.getItem(CLAVE_CARRITO);
        return contenido ? JSON.parse(contenido) : [];
    } catch (error) {
        return [];
    }
}

/**
 * Agrega un producto al carrito o aumenta la cantidad si ya estaba agregado.
 * Evita duplicar la línea para que el resumen muestre una sola fila por producto.
 * @param {object} producto Producto a sumar.
 * @returns {void}
 */
function agregarItem(items, producto) {
    const existente = items.find((item) => item.codigo === producto.codigo);

    if (!existente) {
        return [...items, { ...producto, cantidad: 1 }];
    }

    return items.map((item) =>
        item.codigo === producto.codigo
            ? { ...item, cantidad: normalizarCantidad(item.cantidad + 1) }
            : item
    );
}

/**
 * Cambia la cantidad de una línea. Si la cantidad llega a 0 o es inválida,
 * la línea se elimina en lugar de dejar el carrito en un estado imposible.
 * @param {Array<object>} items Líneas del carrito.
 * @param {string} codigo Código del producto a modificar.
 * @param {number} cantidad Nueva cantidad.
 * @returns {Array<object>} Líneas actualizadas.
 */
function cambiarCantidad(items, codigo, cantidad) {
    const numero = Number(cantidad);
    const quedaSinUnidades = !Number.isFinite(numero) || numero < 1;

    if (quedaSinUnidades) {
        return items.filter((item) => item.codigo !== codigo);
    }

    return items.map((item) =>
        item.codigo === codigo ? { ...item, cantidad: normalizarCantidad(numero) } : item
    );
}

export function CarritoProvider({ children }) {
    const [items, setItems] = useState(leerCarritoGuardado);

    useEffect(() => {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
    }, [items]);

    const valor = useMemo(() => {
        const subtotal = calcularSubtotal(items);
        const envio = calcularEnvio();

        return {
            items,
            totalItems: items.reduce(
                (total, item) => total + normalizarCantidad(item.cantidad),
                0
            ),
            subtotal,
            envio,
            total: calcularTotal(subtotal, envio),
            agregar: (producto) => setItems((actuales) => agregarItem(actuales, producto)),
            actualizarCantidad: (codigo, cantidad) =>
                setItems((actuales) => cambiarCantidad(actuales, codigo, cantidad)),
            eliminar: (codigo) =>
                setItems((actuales) => actuales.filter((item) => item.codigo !== codigo)),
            vaciar: () => setItems([])
        };
    }, [items]);

    return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
    const contexto = useContext(CarritoContext);

    if (!contexto) {
        throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
    }

    return contexto;
}

export default CarritoContext;