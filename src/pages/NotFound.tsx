import React from "react"

const NotFound: React.FC = () => {
  return (
    <main className="main">
      <section className="not-found-container page-container">
        <div className="page-header">
          <h1 className="page-title">Page Not Found | 404</h1>
        </div>
        <p className="not-found-text">
          Page Not Found
        </p>
      </section>
    </main>
  );
};

export default NotFound