import Card from 'react-bootstrap/Card';
import BadgeCategoria from '../atoms/BadgeCategoria';
import Boton from '../atoms/Boton';
import EtiquetaPrecio from '../atoms/EtiquetaPrecio';

function TarjetaProducto({ producto, onAgregar }) {
    return (
        <Card className="tarjeta-producto h-100">
            <Card.Body>
                <BadgeCategoria>{producto.categoria}</BadgeCategoria>
                <Card.Title as="h3">{producto.nombre}</Card.Title>
                <EtiquetaPrecio valor={producto.precio} />
            </Card.Body>

            <Card.Footer className="tarjeta-producto-accion">
                <Boton onClick={() => onAgregar(producto)}>Agregar</Boton>
            </Card.Footer>
        </Card>
    );
}

export default TarjetaProducto;
