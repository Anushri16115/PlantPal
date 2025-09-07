import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const isPathActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🌱 PlantPal
        </Link>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={() => setIsMenuOpen(false)}>
            🏠 Dashboard
          </Link>
          <Link to="/plants" className={isPathActive('/plants') ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
            🌱 My Plants
          </Link>
          <Link to="/encyclopedia" className={isActive('/encyclopedia')} onClick={() => setIsMenuOpen(false)}>
            📚 Encyclopedia
          </Link>
          <Link to="/health" className={isActive('/health')} onClick={() => setIsMenuOpen(false)}>
            🏥 Health Tracker
          </Link>
          <Link to="/analytics" className={isActive('/analytics')} onClick={() => setIsMenuOpen(false)}>
            📊 Analytics
          </Link>
          <Link to="/community" className={isActive('/community')} onClick={() => setIsMenuOpen(false)}>
            🌍 Community
          </Link>
        </div>
      </div>
    </nav>
  );
}
