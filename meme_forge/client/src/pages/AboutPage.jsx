
import React from "react";
import PropTypes from "prop-types";
import { ArrowLeft, Zap, Users, Download, Palette } from "lucide-react";

const AboutPage = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Back Button */}
      <button
        onClick={onBackToHome}
        className="mb-8 flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-6">
        About Meme Forge
      </h1>
      <p className="text-center max-w-2xl mx-auto text-lg text-gray-700 mb-12">
        Meme Forge is your go-to meme generator where creativity meets fun.
        Upload your own image, choose a tone, and watch AI craft the perfect
        meme for you. Whether you like savage roasts, wholesome jokes, or
        cringe-worthy captions, we’ve got you covered.
      </p>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
          <Zap className="w-10 h-10 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">AI-Powered Captions</h3>
          <p className="text-gray-600">
            Let our smart AI generate witty, hilarious, or savage captions in
            seconds.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
          <Palette className="w-10 h-10 mx-auto text-pink-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Customizable Designs</h3>
          <p className="text-gray-600">
            Drag, edit, and style captions to match your creative vision.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
          <Users className="w-10 h-10 mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">For Everyone</h3>
          <p className="text-gray-600">
            Perfect for meme lovers, content creators, and social media addicts.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
          <Download className="w-10 h-10 mx-auto text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Easy Download</h3>
          <p className="text-gray-600">
            Save your meme instantly in JPG format, ready to share anywhere.
          </p>
        </div>
      </div>
    </div>
  );
};

AboutPage.propTypes = {
  onBackToHome: PropTypes.func.isRequired,
};

export default AboutPage;
