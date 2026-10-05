import Button from 'react-bootstrap/Button';

function Boton({
    children,
    variant = 'success',
    type = 'button',
    size,
    disabled = false,
    ariaLabel,
    onClick,
    className = ''
}) {
    return (
        <Button
            variant={variant}
            type={type}
            size={size}
            disabled={disabled}
            aria-label={ariaLabel}
            onClick={onClick}
            className={className}
        >
            {children}
        </Button>
    );
}

export default Boton;