import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LayoutTienda from './templates/LayoutTienda';
import Placeholder from './pages/Placeholder';
import Productos from './pages/Productos';

function App() {
    return (
        <Router>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => (
                        <LayoutTienda>
                            <Placeholder
                                titulo="Inicio"
                                descripcion="HuertoHogar conecta productores locales con familias. Esta vista se migra a React en una segunda etapa."
                            />
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
                    path="/nosotros"
                    render={() => (
                        <LayoutTienda>
                            <Placeholder
                                titulo="Nosotros"
                                descripcion="Próximamente: quiénes somos y dónde puedes encontrarnos."
                            />
                        </LayoutTienda>
                    )}
                />
                <Route
                    path="/registro"
                    render={() => (
                        <LayoutTienda>
                            <Placeholder
                                titulo="Registrarse"
                                descripcion="Próximamente: creación de cuenta con validación en tiempo real."
                            />
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
