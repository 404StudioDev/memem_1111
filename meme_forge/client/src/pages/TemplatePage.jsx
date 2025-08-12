import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, Grid3X3, Search } from "lucide-react";

const imageModules = import.meta.glob("/public/images/.{png,jpg,jpeg,gif,webp}", { eager: true });

  export default function TemplatePage({ onBackToHome, onTemplateSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Build templates array with category from folder name
  const templates = useMemo(() => {
    return Object.keys(imageModules).map((path) => {
      const parts = path.split("/");
      const category = parts[parts.length - 2]; // folder before filename
      const name = parts[parts.length - 1];     // filename
      return {
        src: path.replace("/public", ""), // remove /public for correct URL
        name,
        category,
      };
    });
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(templates.map((t) => t.category));
    return ["All", ...cats];
  }, [templates]);

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchTerm]);

  return (
    <div className="p-4">
      {/* Back button */}
      <button onClick={onBackToHome} className="flex items-center gap-2 mb-4 text-blue-500 hover:underline">
        <ArrowLeft size={20} /> Back
      </button>

      {/* Search and category filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search templates..."
            className="pl-8 pr-2 py-1 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded border ${selectedCategory === cat ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of templates */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.src}
            className="border rounded overflow-hidden cursor-pointer group"
            onClick={() => onTemplateSelect(template)}
          >
            <img
              src={template.src}
              alt={template.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => (e.target.src = "/images/placeholder.jpg")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

TemplatePage.propTypes = {
  onBackToHome: PropTypes.func.isRequired,
  onTemplateSelect: PropTypes.func.isRequired,
};
