
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      content: "Vointy's social approach to wellness has transformed our company culture. Within 6 months, we saw a 28% reduction in sick leaves and our teams are more engaged and connected than ever before.",
      author: "Sarah Johnson",
      title: "HR Director, TechVision Inc."
    },
    {
      content: "What stands out about Vointy is how it feels like a social platform employees actually want to use. The engagement is incredible, and we've seen sick leaves drop by nearly a third since implementation.",
      author: "Michael Chen",
      title: "CEO, Quantum Solutions"
    },
    {
      content: "The analytics from Vointy have been incredibly valuable. We can now see a direct correlation between social wellness engagement and reduced sick days. Our team health scores improve every month.",
      author: "Priya Patel",
      title: "Wellness Coordinator, Global Finance Group"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">
          What Our Clients <span className="gradient-text">Say</span>
        </h2>
        <p className="section-subtitle text-center">
          Don't just take our word for it. Here's how companies are reducing sick leaves with Vointy's social wellness platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl border border-gray-100 shadow-md relative">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-8 h-8 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold">
                "
              </div>
              <p className="text-gray-700 mb-8 italic">{testimonial.content}</p>
              <div>
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex flex-wrap justify-center gap-x-12 gap-y-8">
            {['TechCorp', 'Innovate Inc', 'GlobalHR', 'MegaSoft', 'Future Systems'].map((company, index) => (
              <div key={index} className="text-xl font-bold text-gray-400">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
