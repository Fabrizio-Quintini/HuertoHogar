import Boton from '../atoms/Boton';
import EtiquetaPrecio from '../atoms/EtiquetaPrecio';

function ResumenCarrito({ subtotal, envio, total, totalItems, onVaciar }) {
    const hayItems = totalItems > 0;

    return (
        <div className="resumen-carrito">
            <h2>Resumen de la compra</h2>

            <div className="resumen-carrito-linea">
                <span>Subtotal</span>
                <EtiquetaPrecio valor={subtotal} />
            </div>

            <div className="resumen-carrito-linea">
                <span>Envío</span>
                <EtiquetaPrecio valor={envio} />
            </div>

            <div className="resumen-carrito-linea resumen-carrito-total">
                <span>Total</span>
                <EtiquetaPrecio valor={total} />
            </div>

            <div className="resumen-carrito-acciones">
                <Boton
                    variant="outline-danger"
                    size="sm"
                    disabled={!hayItems}
                    onClick={onVaciar}
                >
                    Vaciar carrito
                </Boton>

                <Boton className="resumen-carrito-comprar" disabled={!hayItems}>
                    Finalizar compra
                </Boton>
            </div>
        </div>
    );
}

export default ResumenCarrito;