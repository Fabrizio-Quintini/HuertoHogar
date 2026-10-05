import { useEffect, useState } from 'react';
import Boton from '../atoms/Boton';
import EtiquetaPrecio from '../atoms/EtiquetaPrecio';
import {
    esCantidadVacia,
    normalizarCantidad,
    puedeAumentar
} from '../utils/carrito';

function SelectorCantidad({ item, onCambio }) {
    const cantidad = normalizarCantidad(item.cantidad);

    // Borrador local: el input es controlado, pero sin estado propio no deja
    // escribir. Al vaciarlo para reescribir el valor, el input se quedaría
    // bloqueado mostrando la última cantidad confirmada.
    const [borrador, setBorrador] = useState(String(cantidad));

    useEffect(() => {
        setBorrador(String(cantidad));
    }, [cantidad]);

    const confirmar = (nuevaCantidad) => {
        if (!esCantidadVacia(nuevaCantidad)) {
            onCambio(item, nuevaCantidad);
        }
    };

    const cambiarDesdeInput = (evento) => {
        const escrito = evento.target.value;

        setBorrador(escrito);
        confirmar(escrito);
    };

    return (
        <div className="selector-cantidad">
            <Boton
                variant="outline-success"
                size="sm"
                ariaLabel={`Quitar una unidad de ${item.nombre}`}
                disabled={cantidad <= 1}
                onClick={() => onCambio(item, cantidad - 1)}
            >
                −
            </Boton>

            <input
                type="number"
                className="form-control selector-cantidad-input"
                min="1"
                max="99"
                aria-label={`Cantidad de ${item.nombre}`}
                value={borrador}
                onChange={cambiarDesdeInput}
                onBlur={() => setBorrador(String(cantidad))}
            />

            <Boton
                variant="outline-success"
                size="sm"
                ariaLabel={`Agregar una unidad de ${item.nombre}`}
                disabled={!puedeAumentar(cantidad)}
                onClick={() => onCambio(item, cantidad + 1)}
            >
                +
            </Boton>

            <EtiquetaPrecio valor={cantidad * item.precio} />
        </div>
    );
}

export default SelectorCantidad;