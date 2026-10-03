import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import TarjetaProducto from './TarjetaProducto';

function GrillaProductos({ productos, onAgregar }) {
    return (
        <Row xs={1} md={3} className="g-4">
            {productos.map((producto) => (
                <Col key={producto.codigo}>
                    <TarjetaProducto producto={producto} onAgregar={onAgregar} />
                </Col>
            ))}
        </Row>
    );
}

export default GrillaProductos;
