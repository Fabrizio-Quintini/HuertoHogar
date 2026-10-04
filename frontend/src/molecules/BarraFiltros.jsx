import CampoBusqueda from './CampoBusqueda';
import SelectorCategoria from './SelectorCategoria';

function BarraFiltros({ busqueda, categoria, onBusquedaChange, onCategoriaChange, total }) {
    return (
        <div className="barra-filtros">
            <CampoBusqueda valor={busqueda} onChange={onBusquedaChange} />
            <SelectorCategoria valor={categoria} onChange={onCategoriaChange} />
            <p className="conteo-resultados">
                {total} {total === 1 ? 'producto' : 'productos'}
            </p>
        </div>
    );
}

export default BarraFiltros;
