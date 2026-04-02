import React from "react";
import "./Services.css";

function Services() {
  return (
    <section className="services">
      
      {/* Left Content */}
      <div className="services-text">
        <h1>Our Services</h1>

        <p>
          AdFlow Network provides modern and result-driven digital advertising solutions to help businesses grow faster and reach the right audience effectively.

We specialize in creating powerful marketing strategies that increase brand visibility, boost engagement, and maximize conversions across digital platforms
        </p>

        <button className="btn">More Informations &gt;&gt;</button>
      </div>

      {/* Right Images */}
      <div className="services-images">
        <img
  src="https://images.unsplash.com/photo-1557838923-2985c318be48"
  alt="advertising campaign"
  className="img-top"
/>

<img
  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
  alt="digital marketing analytics"
  className="img-middle"
/>

<img
  src="https://images.unsplash.com/photo-1563986768609-322da13575f3"
  alt="social media advertising"
  className="img-bottom"
/>
        /
      </div>

    </section>
  );
}

export default Services;