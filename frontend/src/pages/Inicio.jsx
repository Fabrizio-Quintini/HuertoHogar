function Inicio() {
    return (
        <>
            <section className="hero">
                <h1>Del campo a tu hogar</h1>

                <p>
                    Productos frescos, naturales y de calidad directamente para ti.
                </p>

                <a className="boton-principal" href="/productos">
                    Ver productos
                </a>
            </section>

            <section className="productos-destacados">
                <h2>Productos destacados</h2>

                <div className="container text-center">
                    <div className="row">

                        <div className="col-12 col-md-4">
                            <div className="tarjeta-producto">
                                <img
                                    src="/img/MANZANA-FUJI.jpg"
                                    alt="Manzanas Fuji"
                                    className="imagen-producto"
                                />
                                <h3>Manzanas Fuji</h3>
                                <p>Frutas Frescas</p>
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <div className="tarjeta-producto">
                                <img
                                    src="/img/naranja-valencia.webp"
                                    alt="Naranjas Valencia"
                                    className="imagen-producto"
                                />
                                <h3>Naranjas Valencia</h3>
                                <p>Frutas Frescas</p>
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <div className="tarjeta-producto">
                                <img
                                    src="/img/platano.jpg"
                                    alt="Plátanos Cavendish"
                                    className="imagen-producto"
                                />
                                <h3>Plátanos Cavendish</h3>
                                <p>Frutas Frescas</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="sobre-nosotros">
                <h2>Conoce HuertoHogar</h2>

                <p>
                    Conectamos a productores locales con familias que buscan
                    productos frescos, naturales y de calidad.
                </p>

                <a className="boton-principal" href="/nosotros">
                    Conócenos
                </a>
            </section>
        </>
    );
}

export default Inicio;