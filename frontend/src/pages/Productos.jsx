import { useCallback, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import BarraFiltros from '../molecules/BarraFiltros';
import { CATEGORIA_TODAS } from '../data/productos';
import { useCarrito } from '../context/CarritoContext';
import useProductos from '../hooks/useProductos';
import GrillaProductos from '../organisms/GrillaProductos';

export function filtrarProductos(productos, categoria, busqueda) {
    const texto = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
        const coincideCategoria = categoria === CATEGORIA_TODAS || producto.categoria === categoria;
        const coincideBusqueda = texto === '' || producto.nombre.toLowerCase().includes(texto);

        return coincideCategoria && coincideBusqueda;
    });
}

function Productos() {
    const { productos, cargando, error } = useProductos();
    const { agregar } = useCarrito();
    const location = useLocation();
    const history = useHistory();

    const parametros = new URLSearchParams(location.search);
    const [categoria, setCategoria] = useState(parametros.get('categoria') || CATEGORIA_TODAS);
    const [busqueda, setBusqueda] = useState(parametros.get('q') || '');

    const actualizarParametro = useCallback(
        (nombre, valor) => {
            const nuevosParametros = new URLSearchParams(location.search);

            if (valor) {
                nuevosParametros.set(nombre, valor);
            } else {
                nuevosParametros.delete(nombre);
            }

            history.replace({ pathname: location.pathname, search: nuevosParametros.toString() });
        },
        [history, location.pathname, location.search]
    );

    const cambiarCategoria = useCallback(
        (nuevaCategoria) => {
            setCategoria(nuevaCategoria);
            actualizarParametro(
                'categoria',
                nuevaCategoria === CATEGORIA_TODAS ? '' : nuevaCategoria
            );
        },
        [actualizarParametro]
    );

    const cambiarBusqueda = useCallback(
        (nuevaBusqueda) => {
            setBusqueda(nuevaBusqueda);
            actualizarParametro('q', nuevaBusqueda.trim());
        },
        [actualizarParametro]
    );

    const visibles = useMemo(
        () => filtrarProductos(productos, categoria, busqueda),
        [productos, categoria, busqueda]
    );

    if (cargando) {
        return <p className="estado-catalogo">Cargando productos...</p>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <section className="catalogo">
            <h1>Nuestros productos</h1>
            <p>Conoce nuestra selección de productos frescos, naturales y de calidad.</p>

            <BarraFiltros
                busqueda={busqueda}
                categoria={categoria}
                onBusquedaChange={cambiarBusqueda}
                onCategoriaChange={cambiarCategoria}
                total={visibles.length}
            />

            {visibles.length === 0 ? (
                <p className="sin-resultados">No se encontraron productos</p>
            ) : (
                <GrillaProductos productos={visibles} onAgregar={agregar} />
            )}
        </section>
    );
}

export default Productos;
