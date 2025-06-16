'use client'; // wasmはブラウザでしか動かないので no shit

import React from 'react';
import dynamic from 'next/dynamic';

const DynamicTerminalClient = dynamic(() => import('@/components/TerminalClient'), {
  ssr: false,
  loading: () => <p style={{ color: "white", textAlign: "center", paddingTop: "20px" }}>Loading Terminal...</p>,
});

const TerminalPage = () => {
  return (
    <div style={{ padding: '20px', height: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', backgroundColor: '#0d1117' }}>
      <h1 style={{ color: 'white', marginBottom: '10px', textAlign: 'center' }}>Fake Shell Terminal</h1>
      <div style={{ flex: 1, width: '100%', border: '1px solid #30363d', borderRadius: '6px', overflow: 'hidden' }}>
        <DynamicTerminalClient />
      </div>
    </div>
  );
};

export default TerminalPage; 