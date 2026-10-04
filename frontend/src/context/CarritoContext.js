import { createContext, useContext, useEffect, useMemo, useState } from 'react';

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

export function CarritoProvider({ children }) {
    const [items, setItems] = useState(leerCarritoGuardado);

    useEffect(() => {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
    }, [items]);

    const valor = useMemo(
        () => ({
            items,
            totalItems: items.reduce((total, item) => total + item.cantidad, 0),
            agregar: (producto) =>
                setItems((actuales) => [...actuales, { ...producto, cantidad: 1 }]),
            vaciar: () => setItems([])
        }),
        [items]
    );

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
