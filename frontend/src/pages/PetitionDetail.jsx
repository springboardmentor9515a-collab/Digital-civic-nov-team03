import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/dashboard.css';

export default function PetitionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [petition, setPetition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPetition = async () => {
            try {
                const res = await api.get(`/petitions/${id}`);
                setPetition(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load petition.');
            } finally {
                setLoading(false);
            }
        };

        fetchPetition();
    }, [id]);

    const handleSign = async () => {
        try {
            await api.post(`/petitions/${id}/sign`);
            // Optimistic update
            setPetition(prev => ({
                ...prev,
                signatures: (prev.signatures || 0) + 1
            }));
            alert('Petition signed successfully!');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to sign petition.');
        }
    };



    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this petition?')) return;

        try {
            await api.delete(`/petitions/${id}`);
            alert('Petition deleted successfully');
            navigate('/petitions');
        } catch (err) {
            console.error(err);
            alert('Failed to delete petition');
        }
    };



    return (
        <div className="dash-container">
            {/* TOP NAVBAR */}
            <header className="topbar">
                <div className="logo">
                    <span style={{ fontSize: '20px' }}>🏛️</span>
                    <b>Civix</b> <span className="beta">Beta</span>
                </div>

                <nav className="nav-links">
                    <a onClick={() => navigate('/dashboard')}>Home</a>
                    <a onClick={() => navigate('/dashboard')} className="active">Petitions</a>
                    <a>Polls</a>
                    <a>Reports</a>
                </nav>

                <div className="user-area">
                    <div className="user-wrapper">
                        <span className="user-circle">S</span>
                        <span>Sri</span>
                        <span style={{ fontSize: '10px', color: '#999', marginLeft: '4px' }}>▼</span>
                    </div>
                </div>
            </header>

            <div className="dash-body">
                {/* LEFT SIDEBAR */}
                <aside className="left-panel">
                    <div className="profile-card">
                        <div className="avatar-lg">S</div>
                        <div className="profile-info">
                            <h4>Sri</h4>
                            <p className="role">Unverified Official</p>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                📍 San Diego, CA
                            </div>
                        </div>
                    </div>

                    <ul className="side-menu">
                        <li onClick={() => navigate('/dashboard')}>
                            <span className="menu-icon">🏠</span> Dashboard
                        </li>
                        <li className="active" onClick={() => navigate('/petitions')}>
                            <span className="menu-icon">📄</span> Petitions
                        </li>
                        <li><span className="menu-icon">📊</span> Polls</li>
                        <li><span className="menu-icon">👥</span> Officials</li>
                        <li><span className="menu-icon">📈</span> Reports</li>
                        <li><span className="menu-icon">⚙️</span> Settings</li>
                    </ul>

                    <div style={{ marginTop: 'auto', padding: '12px', color: '#6b7280', fontSize: '14px', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span>❓</span> Help & Support
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="content">
                    <div style={{ maxWidth: '900px', margin: '0 0' }}>
                        <button
                            onClick={() => navigate('/petitions')}
                            style={{
                                marginBottom: '16px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#6b7280',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            &larr; Back to Petitions
                        </button>

                        {loading ? (
                            <div className="p-4" style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading details...</div>
                        ) : error ? (
                            <div className="p-4 error" style={{ color: '#ef4444', textAlign: 'center', padding: '40px' }}>{error}</div>
                        ) : petition ? (
                            <div className="petition-box" style={{ background: '#fff', borderRadius: '16px', padding: '40px', border: '1px solid #eef0f3', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', minHeight: '400px', position: 'relative' }}>


                                {/* Top Actions */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '30px',
                                        right: '30px',
                                        display: 'flex',
                                        gap: '10px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: '6px 12px',
                                            background: '#f3f4f6',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#374151'
                                        }}
                                    >
                                        {petition.status}
                                    </div>

                                    {/* DELETE BUTTON */}
                                    <button
                                        onClick={handleDelete}
                                        style={{
                                            border: 'none',
                                            background: '#fee2e2',
                                            color: '#dc2626',
                                            padding: '6px 12px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>


                                {/* Badge */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                    <span style={{
                                        background: '#eff6ff',
                                        color: '#2563eb',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        letterSpacing: '0.5px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {petition.category}
                                    </span>
                                    <span style={{ color: '#ef4444', fontSize: '16px' }}>📍</span>
                                </div>

                                {/* Title */}
                                <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', marginBottom: '32px', lineHeight: '1.2' }}>
                                    {petition.title}
                                </h1>

                                <div style={{ height: '1px', background: '#f3f4f6', marginBottom: '32px' }}></div>

                                {/* Description */}
                                <div style={{ marginBottom: '40px', fontSize: '15px', lineHeight: '1.7', color: '#374151', minHeight: '60px' }}>
                                    {petition.description}
                                </div>

                                {/* Signatures / Progress Section */}
                                <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '28px', fontWeight: '800', color: '#2563eb' }}>{petition.signatures || 0}</span>
                                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#374151' }}>signatures</span>
                                    </div>

                                    <div style={{ width: '200px', height: '6px', background: '#e5e7eb', borderRadius: '3px', marginBottom: '12px', overflow: 'hidden' }}>
                                        <div style={{ width: `${Math.min(((petition.signatures || 0) / (petition.goal || 100)) * 100, 100)}%`, height: '100%', background: '#2563eb' }}></div>
                                    </div>

                                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
                                        Goal: {petition.goal || 100} signatures
                                    </div>

                                    {/* Sign Button */}
                                    {petition.status === 'Active' && (
                                        <button
                                            onClick={handleSign}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid #d1d5db',
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#374151',
                                                cursor: 'pointer',
                                                backgroundColor: '#fff'
                                            }}
                                        >
                                            Sign Petition
                                        </button>
                                    )}
                                </div>

                                <div style={{ marginTop: '40px', fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
                                    Petition created by <strong>Sri</strong> on {new Date(petition.createdAt).toLocaleDateString()}
                                </div>

                            </div>
                        ) : null}
                    </div>
                </main>
            </div>
        </div>
    );
}
