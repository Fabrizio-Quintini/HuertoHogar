import Form from 'react-bootstrap/Form';

function CampoBusqueda({ valor, onChange, marcador = 'Buscar productos' }) {
    return (
        <Form.Group className="campo-busqueda" controlId="campo-busqueda">
            <Form.Label>Buscar</Form.Label>
            <Form.Control
                type="search"
                placeholder={marcador}
                value={valor}
                onChange={(evento) => onChange(evento.target.value)}
            />
        </Form.Group>
    );
}

export default CampoBusqueda;
