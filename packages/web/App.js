import React, { useRef, useState } from 'react';
import { Elevator } from './pages/Elevator';
function App() {
    const [activePage, setActivePage] = useState('elevator');
    const divRef = useRef(null);
    return (<div style={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }} className="App">
      {activePage === 'elevator' ? Elevator() : undefined}
      <span ref={divRef}></span>
    </div>);
}
export default App;
