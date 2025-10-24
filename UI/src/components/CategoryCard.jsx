import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';

const CategoryCard = ({ title, image, slug, productCount }) => {
  return (
    <Link 
      to={`/categories/${slug}`} 
      className="group block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
    >
      <div className="relative overflow-hidden rounded-lg shadow-md h-64 bg-gray-200">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy" // Better performance
          onError={(e) => {
            // Fallback if image fails to load
            e.target.src = '/images/category-placeholder.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white text-xl font-bold mb-1">{title}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-200 text-sm">
              {productCount} product{productCount !== 1 ? 's' : ''}
            </span>
            <span className="bg-white/20 p-1 rounded-full backdrop-blur-sm group-hover:bg-blue-600 transition-colors duration-300 group-hover:translate-x-1">
              <ChevronRightIcon className="h-4 w-4 text-white" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;