import Form from 'react-bootstrap/Form';
import { CATEGORIAS, CATEGORIA_TODAS } from '../data/productos';

function SelectorCategoria({ categorias = CATEGORIAS, valor, onChange }) {
    return (
        <Form.Group className="selector-categoria" controlId="selector-categoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Select value={valor} onChange={(evento) => onChange(evento.target.value)}>
                <option value={CATEGORIA_TODAS}>{CATEGORIA_TODAS}</option>
                {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                        {categoria}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
}

export default SelectorCategoria;
