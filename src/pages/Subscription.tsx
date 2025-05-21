
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const pricingPlans = [
  {
    name: 'Basic',
    price: '€12',
    frequency: '/month per user',
    description: 'For small teams looking to get started with wellness activities',
    features: [
      'Up to 15 team members',
      'Basic wellness challenges',
      'Monthly reports',
      'Email support'
    ],
    mostPopular: false,
    ctaLabel: 'Get Started'
  },
  {
    name: 'Pro',
    price: '€24',
    frequency: '/month per user',
    description: 'For growing teams that need more features and engagement',
    features: [
      'Up to 50 team members',
      'Advanced wellness challenges',
      'Weekly reports',
      'Priority support',
      'Custom wellness programs',
      'Team analytics dashboard'
    ],
    mostPopular: true,
    ctaLabel: 'Start Free Trial'
  },
  {
    name: 'Enterprise',
    price: '€49',
    frequency: '/month per user',
    description: 'For large organizations requiring custom solutions',
    features: [
      'Unlimited team members',
      'Custom wellness programs',
      'Detailed analytics',
      'Dedicated account manager',
      'API access',
      'SSO integration',
      'White labeling'
    ],
    mostPopular: false,
    ctaLabel: 'Contact Sales'
  }
];

type SubscriptionFormData = {
  name: string;
  email: string;
  company: string;
  employees: string;
};

const Subscription = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    email: '',
    company: '',
    employees: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    
    // Scroll to the form section
    const formElement = document.getElementById('subscription-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "You need to select a subscription plan before proceeding.",
      });
      return;
    }
    
    setLoading(true);
    
    // This is where you would integrate with Supabase and Stripe
    // For now, we'll just simulate a submission
    setTimeout(() => {
      toast({
        title: "Request received!",
        description: "We'll contact you shortly about your " + selectedPlan + " subscription.",
      });
      setLoading(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-purple-50 to-white pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
              Choose Your <span className="gradient-text">Wellness</span> Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Invest in your team's wellbeing with our flexible subscription options.
              Select the plan that best fits your organization's needs.
            </p>
          </div>
        </section>
        
        {/* Pricing section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <Card key={plan.name} className={`overflow-hidden ${plan.mostPopular ? 'border-2 border-brand-purple relative' : 'border border-gray-200'}`}>
                  {plan.mostPopular && (
                    <div className="bg-brand-purple text-white py-1 px-4 text-sm font-medium absolute top-0 right-0">
                      Most Popular
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-end mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-500 ml-1">{plan.frequency}</span>
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <Button 
                      className={`w-full mb-6 ${plan.mostPopular ? 'bg-brand-purple hover:bg-brand-purple-dark' : ''}`}
                      onClick={() => handleSelectPlan(plan.name)}
                    >
                      {plan.ctaLabel}
                    </Button>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Subscription form */}
        <section id="subscription-form" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                {selectedPlan ? `Subscribe to ${selectedPlan} Plan` : 'Get Started with Vointy'}
              </h2>
              
              <Card className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-purple focus:border-brand-purple"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-purple focus:border-brand-purple"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-purple focus:border-brand-purple"
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="employees" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Employees
                      </label>
                      <select
                        id="employees"
                        name="employees"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-purple focus:border-brand-purple"
                        value={formData.employees}
                        onChange={handleInputChange}
                      >
                        <option value="">Select...</option>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="201-500">201-500</option>
                        <option value="501+">501+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Selected Plan
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {pricingPlans.map((plan) => (
                          <div
                            key={plan.name}
                            onClick={() => setSelectedPlan(plan.name)}
                            className={`
                              px-4 py-2 border rounded-md cursor-pointer transition-colors
                              ${selectedPlan === plan.name
                                ? 'bg-brand-purple text-white border-brand-purple'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-brand-purple'
                              }
                            `}
                          >
                            {plan.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-brand-purple hover:bg-brand-purple-dark"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Request Subscription'}
                    </Button>
                    
                    <p className="text-sm text-gray-500 text-center mt-4">
                      By subscribing, you agree to our Terms of Service and Privacy Policy.
                      We'll contact you to complete the setup of your subscription.
                    </p>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Subscription;
