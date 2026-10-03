import { useCallback, useEffect, useState } from 'react';
import productoService from '../services/productoService';

const MENSAJE_ERROR = 'No fue posible cargar los productos';

export function useProductos() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargarProductos = useCallback(() => {
        setCargando(true);
        productoService
            .listarProductos()
            .then((datos) => {
                setProductos(datos);
                setError(null);
            })
            .catch((fallo) => {
                setProductos([]);
                setError(fallo && fallo.message ? fallo.message : MENSAJE_ERROR);
            })
            .finally(() => setCargando(false));
    }, []);

    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    return { productos, cargando, error, recargar: cargarProductos };
}

export default useProductos;
