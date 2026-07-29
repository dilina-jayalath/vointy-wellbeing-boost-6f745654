
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      title: "5 Ways to Boost Employee Wellbeing in Remote Teams",
      excerpt: "Discover practical strategies to maintain team connection and support employee mental health in distributed work environments.",
      author: "Sarah Chen",
      date: "June 1, 2025",
      readTime: "5 min read",
      category: "Remote Work",
      image: "/placeholder.svg"
    },
    {
      title: "The ROI of Employee Wellness Programs: A Data-Driven Analysis",
      excerpt: "Learn how companies are measuring the return on investment of their wellness initiatives and the metrics that matter most.",
      author: "Mike Johnson",
      date: "May 28, 2025",
      readTime: "8 min read",
      category: "Analytics",
      image: "/placeholder.svg"
    },
    {
      title: "Building a Culture of Wellness: Best Practices from Top Companies",
      excerpt: "Explore how industry leaders are creating sustainable wellness cultures that engage employees and drive business results.",
      author: "Emma Rodriguez",
      date: "May 25, 2025",
      readTime: "6 min read",
      category: "Company Culture",
      image: "/placeholder.svg"
    },
    {
      title: "Mental Health in the Workplace: Breaking Down Barriers",
      excerpt: "Understanding the importance of mental health support and how to create an environment where employees feel safe to seek help.",
      author: "Dr. Alex Thompson",
      date: "May 22, 2025",
      readTime: "7 min read",
      category: "Mental Health",
      image: "/placeholder.svg"
    },
    {
      title: "The Science Behind Social Wellness Platforms",
      excerpt: "Dive deep into the research that shows how social connections impact employee health, productivity, and job satisfaction.",
      author: "Research Team",
      date: "May 19, 2025",
      readTime: "10 min read",
      category: "Research",
      image: "/placeholder.svg"
    },
    {
      title: "Implementing Wellness Programs: A Step-by-Step Guide",
      excerpt: "A comprehensive guide for HR leaders looking to launch successful employee wellness initiatives in their organizations.",
      author: "Lisa Park",
      date: "May 16, 2025",
      readTime: "12 min read",
      category: "Implementation",
      image: "/placeholder.svg"
    }
  ];

  const categories = ["All", "Remote Work", "Analytics", "Company Culture", "Mental Health", "Research", "Implementation"];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Vointy.life Blog
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Insights, research, and best practices for workplace wellness and employee engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <Button 
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  className={index === 0 ? "btn-primary" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-brand-purple bg-brand-purple/10 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">{post.readTime}</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-brand-purple transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span className="mr-3">{post.author}</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{post.date}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-brand-purple group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" className="btn-secondary">
                Load More Posts
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
