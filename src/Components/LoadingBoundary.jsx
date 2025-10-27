import React, { Suspense } from 'react';
import { Container, Spinner } from 'react-bootstrap';

/**
 * Componente de Suspense Boundary reutilizable con fallback visual elegante
 * Aprovecha React 18 Suspense para manejar cargas asíncronas de forma declarativa
 */
const LoadingBoundary = ({ children, minHeight = 400 }) => {
    return (
        <Suspense fallback={
            <Container 
                fluid 
                style={{ 
                    paddingTop: 80, 
                    textAlign: 'center',
                    minHeight: minHeight,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Spinner 
                    animation="border" 
                    role="status" 
                    variant="primary" 
                    style={{ width: 60, height: 60 }}
                >
                    <span className="visually-hidden">Cargando contenido...</span>
                </Spinner>
                <div style={{ marginTop: 16, color: '#64748b', fontSize: 18 }}>
                    Cargando productos...
                </div>
                <div style={{ marginTop: 8, color: '#94a3b8', fontSize: 14 }}>
                    Optimizado con React 18 ⚡
                </div>
            </Container>
        }>
            {children}
        </Suspense>
    );
};

export default LoadingBoundary;
