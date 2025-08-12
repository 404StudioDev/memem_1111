import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Auto-import all images from /public/images/*/*
const imageModules = import.meta.glob(
  "/public/images/*/*.{png,jpg,jpeg,gif,webp}",
  { eager: true }
);

export default function ImageUpload({ onSelectImage }) {
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Build templates list from files
    const loadedTemplates = Object.keys(imageModules).map((path, index) => {
      const parts = path.split("/");
      const category = parts[parts.length - 2];
      const filename = parts[parts.length - 1];
      return {
        id: index + 1,
        name: filename
          .replace(/\.(png|jpe?g|gif|webp)$/i, "")
          .replace(/[-_]/g, " "),
        url: path.replace("/public", ""), // convert for browser use
        category,
      };
    });
    setTemplates(loadedTemplates);
  }, []);

  // Filter templates
  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Search box */}
      <input
        type="text"
        placeholder="Search templates..."
        className="border px-3 py-1 rounded w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Templates grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="border rounded overflow-hidden cursor-pointer group"
            onClick={() => onSelectImage(template)}
          >
            <img
              src={template.url}
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

ImageUpload.propTypes = {
  onSelectImage: PropTypes.func.isRequired,
};
