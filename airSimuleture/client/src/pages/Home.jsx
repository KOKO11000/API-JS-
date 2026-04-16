import React from "react";
import { Link } from "react-router";
import Menu from "../components/home/Menu";

export default function Home() {
  const features = [
    {
      icon: "✈",
      title: "Aircraft Management",
      description: "Manage your fleet with ease. Add, edit, and delete aircraft.",
      link: "/aircrafts",
      color: "sky"
    },
    {
      icon: "🏷️",
      title: "Aircraft Types",
      description:
        "Organize aircraft by type with detailed specifications.",
      link: "/aircraft-type",
      color: "blue"
    },
    {
      icon: "🛫",
      title: "Flight Operations",
      description: "Track flights in real-time with detailed metrics.",
      link: "/flights",
      color: "cyan"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Menu />
      
      {/* Hero Section */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="text-center mb-20">
            <h1 className="text-7xl font-bold mb-6 bg-linear-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Air Combat Simulator
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Command your fleet with precision. Manage fighter aircraft, coordinate operations, 
              and execute tactical missions in real-time.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group"
              >
                <div className="bg-linear-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-8 rounded-2xl border border-white/20 hover:border-sky-400/50 transition-all duration-300 h-full hover:shadow-2xl hover:shadow-sky-500/20 transform hover:-translate-y-2">
                  <div className="text-6xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="text-sky-400 font-semibold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Launch →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-linear-to-r from-sky-600/15 to-blue-600/15 border border-sky-500/30 rounded-2xl p-12 backdrop-blur-xl">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold bg-linear-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent mb-2">100+</div>
                <p className="text-gray-300 text-lg">Combat Aircraft</p>
              </div>
              <div>
                <div className="text-5xl font-bold bg-linear-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent mb-2">50+</div>
                <p className="text-gray-300 text-lg">Aircraft Types</p>
              </div>
              <div>
                <div className="text-5xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">24/7</div>
                <p className="text-gray-300 text-lg">Operations</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <h2 className="text-4xl font-bold mb-8 text-white">Ready for Deployment?</h2>
            <div className="flex gap-6 items-center justify-center flex-wrap">
              <Link
                to="/aircrafts"
                className="px-8 py-4 bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-sky-500/50 transition-all duration-300 transform hover:scale-105"
              >
                View Fleet
              </Link>
              <Link
                to="/flights"
                className="px-8 py-4 border-2 border-sky-500/50 hover:border-sky-400 text-white font-semibold rounded-xl backdrop-blur hover:bg-white/5 transition-all duration-300"
              >
                Launch Mission
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
