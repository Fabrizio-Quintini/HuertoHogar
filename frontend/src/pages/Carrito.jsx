import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import FilaCarrito from '../organisms/FilaCarrito';
import ResumenCarrito from '../molecules/ResumenCarrito';
import { useCarrito } from '../context/CarritoContext';

function Carrito() {
    const {
        items,
        totalItems,
        subtotal,
        envio,
        total,
        actualizarCantidad,
        eliminar,
        vaciar
    } = useCarrito();

    if (items.length === 0) {
        return (
            <section className="carrito">
                <h1>Carrito de compras</h1>

                <Alert variant="warning" className="carrito-vacio">
                    Tu carrito está vacío.
                </Alert>

                <Link className="boton-principal" to="/productos">
                    Ver productos
                </Link>
            </section>
        );
    }

    return (
        <section className="carrito">
            <h1>Carrito de compras</h1>
            <p>Revisa los productos que agregaste antes de finalizar tu compra.</p>

            <Table responsive className="tabla-carrito">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <FilaCarrito
                            key={item.codigo}
                            item={item}
                            onCantidadChange={(producto, cantidad) =>
                                actualizarCantidad(producto.codigo, cantidad)
                            }
                            onEliminar={(producto) => eliminar(producto.codigo)}
                        />
                    ))}
                </tbody>
            </Table>

            <ResumenCarrito
                subtotal={subtotal}
                envio={envio}
                total={total}
                totalItems={totalItems}
                onVaciar={vaciar}
            />
        </section>
    );
}

export default Carrito;