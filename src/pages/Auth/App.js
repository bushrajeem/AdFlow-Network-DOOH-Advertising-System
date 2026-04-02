import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

function App() {
  const [view, setView] = useState('login');

  return (
    <div className="min-h-screen bg-[#E9EDF0] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md transition-all duration-300">
        {view === 'login' ? (
          <Login onSwitch={() => setView('signup')} />
        ) : (
          <Signup onSwitch={() => setView('login')} />
        )}
      </div>
    </div>
  );
}

export default App;