import Button from 'react-bootstrap/Button';

function Boton({ children, variant = 'success', type = 'button', onClick, className = '' }) {
    return (
        <Button variant={variant} type={type} onClick={onClick} className={className}>
            {children}
        </Button>
    );
}

export default Boton;
