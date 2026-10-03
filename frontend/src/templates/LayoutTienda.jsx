import Footer from '../organisms/Footer';
import Navbar from '../organisms/Navbar';

function LayoutTienda({ children }) {
    return (
        <>
            <Navbar />
            <main className="contenido-principal">{children}</main>
            <Footer />
        </>
    );
}

export default LayoutTienda;
