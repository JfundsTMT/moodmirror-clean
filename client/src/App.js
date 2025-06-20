// App.js
import Journal from './components/Journal';
import ShadowCalendar from './components/ShadowCalendar';

function App() {
  return (
<div className="min-h-screen bg-gradient-to-br from-[#100015] via-[#1b0030] to-[#2c0057] text-white font-mono">

      <ShadowCalendar />

      <Journal />
    </div>
  );
}

export default App;
