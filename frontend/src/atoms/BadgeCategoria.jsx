import Badge from 'react-bootstrap/Badge';

function BadgeCategoria({ children }) {
    return (
        <Badge bg="success" className="categoria-badge">
            {children}
        </Badge>
    );
}

export default BadgeCategoria;
