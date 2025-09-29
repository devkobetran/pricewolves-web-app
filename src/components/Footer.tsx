import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
        <Link to="/" className="footer-business-name">
          Price Wolves
        </Link>
        <ul className="footer-link-container">
          <li>
            <Link to="/dashboard" className="footer-link">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/create-new-item" className="footer-link">
              Create New Item
            </Link>
          </li>
          <li>
            <Link to="/create-new-store" className="footer-link">
              Create New Store
            </Link>
          </li>
        </ul>
      <p className="copyright-notice">
        &copy; {new Date().getFullYear()} Price Wolves. All rights reserved.
      </p>
      <div className="contributor-info">
        <p>Software Engineer Contributors </p>
        <p>
          <a href="https://www.linkedin.com/in/kobetran/">Kobe Tran</a>
          &nbsp;&amp;&nbsp;
          <a href="https://www.linkedin.com/in/jecheung9/">Jeffrey Cheung</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
