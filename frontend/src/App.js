import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LayoutTienda from './templates/LayoutTienda';
import Placeholder from './pages/Placeholder';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import Inicio from './pages/Inicio';
import Nosotros from './pages/Nosotros';
import Registro from './pages/Registro';

function App() {
    return (
        <Router>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => (
                        <LayoutTienda>
                            <Inicio />
                        </LayoutTienda>
                    )}
                />

                <Route
                    exact
                    path="/productos"
                    render={() => (
                        <LayoutTienda>
                            <Productos />
                        </LayoutTienda>
                    )}
                />

                <Route
                    exact
                    path="/carrito"
                    render={() => (
                        <LayoutTienda>
                            <Carrito />
                        </LayoutTienda>
                    )}
                />

                <Route
                    path="/nosotros"
                    render={() => (
                        <LayoutTienda>
                                <Nosotros/>
                        </LayoutTienda>
                    )}
                />

                <Route
                    path="/registro"
                    render={() => (
                        <LayoutTienda>
                            <Registro />
                        </LayoutTienda>
                    )}
                />

                <Route
                    render={() => (
                        <LayoutTienda>
                            <Placeholder
                                titulo="Página no encontrada"
                                descripcion="La ruta solicitada no existe en HuertoHogar."
                            />
                        </LayoutTienda>
                    )}
                />
            </Switch>
        </Router>
    );
}

export default App;