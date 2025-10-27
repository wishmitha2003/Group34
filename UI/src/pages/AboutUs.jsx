import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrophyIcon, 
  ShieldCheckIcon, 
  TruckIcon, 
  HeartIcon,
  UsersIcon,
  TargetIcon,
  StarIcon,
  ArrowRightIcon
} from 'lucide-react';

const AboutUs = () => {
  const features = [
    {
      icon: <TrophyIcon className="h-8 w-8" />,
      title: "Premium Quality",
      description: "We source only the highest quality materials for our sportswear, ensuring durability and comfort."
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "Authentic Products",
      description: "100% genuine products with verified authenticity and manufacturer warranties."
    },
    {
      icon: <TruckIcon className="h-8 w-8" />,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50 and express delivery options available."
    },
    {
      icon: <HeartIcon className="h-8 w-8" />,
      title: "Customer First",
      description: "Dedicated customer support and easy returns within 30 days."
    }
  ];

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Sarah Chen",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Mike Rodriguez",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emily Davis",
      role: "Customer Success",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "100+", label: "Brand Partners" },
    { number: "5", label: "Years of Excellence" },
    { number: "24/7", label: "Customer Support" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About GenZsport</h1>
            <p className="text-xl mb-8 opacity-90">
              Empowering the next generation of athletes with premium sportswear that combines 
              style, performance, and sustainability.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/categories"
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                Shop Now <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Our Story"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Born from Passion, Built for Performance
                </h3>
                <p className="text-gray-600 mb-4">
                  Founded in 2019, GenZsport started as a small startup with a big vision: to revolutionize 
                  the sportswear industry by creating products that truly understand the needs of modern athletes.
                </p>
                <p className="text-gray-600 mb-4">
                  Our journey began when our founder, a college athlete, noticed the gap between high-performance 
                  gear and affordable, stylish sportswear. We set out to bridge that gap, creating products that 
                  don't compromise on quality, style, or price.
                </p>
                <p className="text-gray-600">
                  Today, we're proud to serve over 50,000 customers worldwide and partner with leading sports 
                  brands to bring you the best selection of athletic wear.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose GenZsport?</h2>
            <p className="text-gray-600 text-lg">We're committed to excellence in everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg">The passionate people behind GenZsport</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <TargetIcon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To empower every athlete, from beginners to professionals, with high-quality, 
                affordable sportswear that enhances performance and inspires confidence in their journey.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                <StarIcon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the most trusted and innovative sportswear brand globally, known for 
                our commitment to quality, customer satisfaction, and sustainable practices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;