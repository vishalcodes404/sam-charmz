import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ShopProvider } from './context/ShopContext'
import { AdminProvider } from './context/AdminContext'
import { BrowserRouter } from 'react-router-dom'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0f0f17',
                    color: '#a0a0b0',
                    fontFamily: 'system-ui, sans-serif',
                    padding: '40px 20px',
                    textAlign: 'center',
                }}>
                    <h1 style={{ color: '#D4AF37', fontSize: '24px', marginBottom: '12px', fontWeight: 600 }}>
                        Sam Charmz
                    </h1>
                    <p style={{ marginBottom: '24px', fontSize: '14px' }}>
                        We're experiencing a temporary issue. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 32px',
                            backgroundColor: '#D4AF37',
                            color: '#0f0f17',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <AdminProvider>
                <ShopProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </ShopProvider>
            </AdminProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
