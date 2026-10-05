import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavbarBootstrap from 'react-bootstrap/Navbar';
import { Link, NavLink } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const ENLACES = [
    { to: '/', label: 'Inicio' },
    { to: '/productos', label: 'Productos' },
    { to: '/nosotros', label: 'Nosotros' }
];

function Navbar() {
    const { totalItems } = useCarrito();

    return (
        <NavbarBootstrap expand="lg" className="navbar-huertohogar">
            <Container fluid>
                <NavbarBootstrap.Brand as={Link} to="/">
                    HuertoHogar
                </NavbarBootstrap.Brand>

                <NavbarBootstrap.Toggle aria-controls="navbar-principal" />
                <NavbarBootstrap.Collapse id="navbar-principal">
                    <Nav className="me-auto">
                        {ENLACES.map(({ to, label }) => (
                            <Nav.Link key={to} as={NavLink} to={to} exact>
                                {label}
                            </Nav.Link>
                        ))}
                    </Nav>

                    <Nav>
                        <Nav.Link as={NavLink} to="/registro" exact>
                            Registrarse
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/carrito"
                            exact
                            className="carrito-enlace"
                        >
                            {`Carrito (${totalItems})`}
                        </Nav.Link>
                    </Nav>
                </NavbarBootstrap.Collapse>
            </Container>
        </NavbarBootstrap>
    );
}

export default Navbar;
