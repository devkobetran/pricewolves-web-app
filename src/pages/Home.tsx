import React from "react"
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <main className="main">
      <section className="page-container">
        <h1 className="page-title">Welcome to Price Wolves!</h1>
        <p className="page-text">
          Price Wolves aim to hunt stores with the lowest prices.
        </p>
        <Link to="/dashboard" className="button">Go to Dashboard</Link>
      </section>
    </main>
  );
};

export default Home
