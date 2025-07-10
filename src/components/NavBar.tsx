import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";

library.add(faBars, faX);

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

    useEffect(() => {
    const handleClickOutside = (event: Event) => {
        const target = event.target as Node;
        if (
        isMenuOpen &&
        popupRef.current &&
        !popupRef.current.contains(target) &&
        !( (event.target as HTMLElement).closest(".nav-menu-icon") )
        ) {
        setIsMenuOpen(false);
        }
    };
      
  const handleResize = () => {
    if (window.innerWidth >= 700 && isMenuOpen) {
      setIsMenuOpen(false); 
    }
  };

    if (isMenuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
    } else {
        document.removeEventListener("mousedown", handleClickOutside);
    }  
    window.addEventListener("resize", handleResize);  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);  
    };
    }, [isMenuOpen]);

  return (
    <header className="header">
      <nav className="nav-bar">
        <button className="nav-menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? (
            <FontAwesomeIcon icon={faX} />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </button>
        <Link to="/" className="nav-logo-link" onClick={closeMenu}>
          <img className="nav-logo" src={""} alt="Price Wolves Logo" />
        </Link>

        {/* Desktop menus (remain as per your CSS) */}
        <ul className="nav-link-container desktop-menu">
            <li>
            <Link to="/dashboard" className="nav-link">
                Dashboard
            </Link>
            </li>
            <li>
            <Link to="/add-item" className="nav-link">
                Add Item
            </Link>
            </li>
            <li>
            <Link to="/create-new-item" className="nav-link">
                Create New Item
            </Link>
            </li>
            <li>
            <Link to="/create-new-store" className="nav-link">
                Create New Store
            </Link>
            </li>
        </ul>

        {/* Mobile popup menu overlay */}
        {isMenuOpen && (
          <div className="popup-menu" ref={popupRef}>
            <ul className="nav-link-container">
                <li>
                <Link to="/dashboard" className="nav-link" onClick={closeMenu}>
                    Dashboard
                </Link>
                </li>
                <li>
                <Link to="/add-item" className="nav-link" onClick={closeMenu}>
                    Add Item
                </Link>
                </li>
                <li>
                <Link to="/create-new-item" className="nav-link" onClick={closeMenu}>
                    Create New Item
                </Link>
                </li>
                <li>
                <Link to="/create-new-store" className="nav-link" onClick={closeMenu}>
                    Create New Store
                </Link>
                </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
