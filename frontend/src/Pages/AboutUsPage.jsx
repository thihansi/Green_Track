import React from "react";
import aboutUS from "/aboutUS.png";

const AboutUs = () => {
  return (
    <div
      className="relative bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${aboutUS})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative bg-white bg-opacity-50 py-10 rounded-lg shadow-2xl max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center text-white mb-6 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          About Us
        </h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          Welcome to{" "}
          <span className="font-semibold text-blue-600">Green Track</span>, your
          dedicated partner in sustainable waste management solutions. We are
          committed to protecting the environment while providing our customers
          with efficient and effective waste management services tailored to
          their needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-300 p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-800">
              At EcoWaste, our mission is to promote sustainability and
              environmental responsibility through innovative waste management
              practices. We aim to minimize waste, maximize recycling, and
              educate communities about responsible waste disposal.
            </p>
          </div>

          <div className="bg-gray-300 p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-800">
              Our vision is to lead the way in waste management solutions,
              setting the standard for environmental stewardship and community
              engagement. We aspire to create a cleaner, greener future for
              generations to come, where waste is managed responsibly and
              sustainably.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join Us</h2>
          <p className="text-gray-800 mb-4">
            We invite you to partner with us in making a positive impact on
            our environment. Together, we can reduce waste, increase
            recycling efforts, and foster a culture of sustainability in our
            communities. Whether you're a business, organization, or resident,
            EcoWaste is here to support your waste management needs.
          </p>
          <p className="text-gray-800">
            Thank you for being a part of our mission. Together, let's work
            towards a cleaner, healthier planet!
          </p>
        </div>
      </div>
    </div>
);

};

export default AboutUs;
