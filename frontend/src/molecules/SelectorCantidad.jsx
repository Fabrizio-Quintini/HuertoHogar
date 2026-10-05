import Boton from '../atoms/Boton';
import EtiquetaPrecio from '../atoms/EtiquetaPrecio';
import { normalizarCantidad, puedeAumentar } from '../utils/carrito';

function SelectorCantidad({ item, onCambio }) {
    const cantidad = normalizarCantidad(item.cantidad);

    const cambiarCantidad = (nuevaCantidad) => onCambio(item, nuevaCantidad);

    return (
        <div className="selector-cantidad">
            <Boton
                variant="outline-success"
                size="sm"
                ariaLabel={`Quitar una unidad de ${item.nombre}`}
                disabled={cantidad <= 1}
                onClick={() => cambiarCantidad(cantidad - 1)}
            >
                −
            </Boton>

            <input
                type="number"
                className="form-control selector-cantidad-input"
                min="1"
                aria-label={`Cantidad de ${item.nombre}`}
                value={cantidad}
                onChange={(evento) => cambiarCantidad(evento.target.value)}
            />

            <Boton
                variant="outline-success"
                size="sm"
                ariaLabel={`Agregar una unidad de ${item.nombre}`}
                disabled={!puedeAumentar(cantidad)}
                onClick={() => cambiarCantidad(cantidad + 1)}
            >
                +
            </Boton>

            <EtiquetaPrecio valor={cantidad * item.precio} />
        </div>
    );
}

export default SelectorCantidad;