import BadgeCategoria from '../atoms/BadgeCategoria';
import Boton from '../atoms/Boton';
import EtiquetaPrecio from '../atoms/EtiquetaPrecio';
import SelectorCantidad from '../molecules/SelectorCantidad';

function FilaCarrito({ item, onCantidadChange, onEliminar }) {
    return (
        <tr className="fila-carrito">
            <td data-label="Producto">
                <div className="fila-carrito-producto">
                    <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="imagen-carrito"
                    />

                    <div>
                        <h3 className="fila-carrito-nombre">{item.nombre}</h3>
                        <BadgeCategoria>{item.categoria}</BadgeCategoria>
                        <EtiquetaPrecio valor={item.precio} />
                    </div>
                </div>
            </td>

            <td data-label="Cantidad">
                <SelectorCantidad item={item} onCambio={onCantidadChange} />
            </td>

            <td data-label="Subtotal">
                <EtiquetaPrecio valor={item.precio * item.cantidad} />
            </td>

            <td data-label="Acciones">
                <Boton
                    variant="outline-danger"
                    size="sm"
                    ariaLabel={`Eliminar ${item.nombre} del carrito`}
                    onClick={() => onEliminar(item)}
                >
                    Eliminar
                </Boton>
            </td>
        </tr>
    );
}

export default FilaCarrito;