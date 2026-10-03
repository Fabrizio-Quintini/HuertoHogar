import { formatearPrecio } from '../utils/formato';

function EtiquetaPrecio({ valor }) {
    return <span className="precio">{formatearPrecio(valor)}</span>;
}

export default EtiquetaPrecio;
