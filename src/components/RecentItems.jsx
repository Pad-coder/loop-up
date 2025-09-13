import React from 'react'
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

function RecentItems() {
    const featuredItems = [
    {
      id: 1,
      title: "Vintage Leather Jacket",
      description: "Barely worn, perfect for someone who loves vintage style",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=200&fit=crop",
      location: "Downtown",
      timeAgo: "2 hours ago",
      giver: "Sarah M."
    },
    {
      id: 2,
      title: "Children's Books Collection",
      description: "25 books perfect for ages 5-10, moving and can't take them",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
      location: "Suburbs",
      timeAgo: "4 hours ago",
      giver: "Mike & Jenny"
    },
    {
      id: 3,
      title: "Coffee Machine",
      description: "Works perfectly, upgraded to a new one",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop",
      location: "City Center", 
      timeAgo: "1 day ago",
      giver: "Alex K."
    },
    {
      id: 4,
      title: "Indoor Plants",
      description: "3 healthy plants, moving abroad and need good homes",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
      location: "East Side",
      timeAgo: "2 days ago",
      giver: "Emma L."
    }
  ];
  return (<>
  {/* Featured Items */}
      <section className="py-16 poppins-regular">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-body">Recently Available</h2>
            
            <Link to={"/freebie"} className="link-primary flex items-center gap-2">
            View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid  grid-cols-1 md:grid-cols-4 gap-6">
            {featuredItems.map(item => (
              <div key={item.id} className="product-card rounded-lg overflow-hidden cursor-pointer">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-success text-inverse px-2 py-1 rounded text-sm">
                    FREE
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-body mb-2">{item.title}</h3>
                  <p className="text-muted mb-4 text-sm">{item.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted">
                      <MapPin size={14} />
                      {item.location}
                    </div>
                    <div className="flex items-center gap-1 text-muted">
                      <Clock size={14} />
                      {item.timeAgo}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-light" style={{borderTopWidth: '1px'}}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">by {item.giver}</span>
                      <button className="btn-outline-primary px-3 py-1 rounded text-sm">
                        I'm Interested
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  </>)
}

export default RecentItems