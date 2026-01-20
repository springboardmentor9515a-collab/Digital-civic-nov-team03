import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton({ style, children }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            navigate('/', { replace: true });
        }
    };

    return (
        <button
            onClick={handleLogout}
            style={style || {
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}
        >
            {children || (
                <>
                    <span>🚪</span>
                    <span>Logout</span>
                </>
            )}
        </button>
    );
}
