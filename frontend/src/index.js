import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { CarritoProvider } from './context/CarritoContext';

const raiz = ReactDOM.createRoot(document.getElementById('root'));

raiz.render(
    <React.StrictMode>
        <CarritoProvider>
            <App />
        </CarritoProvider>
    </React.StrictMode>
);
