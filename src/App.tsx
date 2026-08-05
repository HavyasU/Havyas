
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!isAdmin && <CustomCursor />}
      {!isAdmin && <Navbar />}
      {/* Home hero is full-screen with its own padding; other pages need top padding for fixed navbar */}
      <main className={`flex-grow ${!isAdmin && !isHome ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <SmoothScroll>
        <Layout />
      </SmoothScroll>
    </Router>
  );
}

export default App;
