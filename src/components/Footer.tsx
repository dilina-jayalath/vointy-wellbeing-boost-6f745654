import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import vointyMark from '@/assets/vointy-mark.png.asset.json';


const Footer = () => {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, language }]);

      if (error) throw error;

      toast({
        title: t('newsletter.success'),
        variant: 'default',
      });
      setEmail('');
    } catch (error: any) {
      console.error('Newsletter error:', error);
      toast({
        title: t('errors.generic'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={vointyMark.url} alt="Vointy logo" className="h-9 w-auto" />
              <h3 className="text-xl font-bold">Vointy.life</h3>
            </div>

            <p className="text-gray-300 mb-4">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.product')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.features')}
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.benefits')}
                </a>
              </li>
              <li>
                <Link to="/subscription" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.testimonials')}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact-form" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{t('newsletter.title')}</h3>
            <p className="text-gray-300 mb-4">
              {t('newsletter.description')}
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')} 
                className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none flex-grow border border-gray-700 focus:border-brand-purple"
                required
              />
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-purple hover:bg-brand-purple/90 rounded-r-lg rounded-l-none"
              >
                {t('newsletter.button')}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}
            </p>
            <div className="flex space-x-6">
              <Link 
                to="/privacy-policy"
                className="text-gray-400 text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms-of-service"
                className="text-gray-400 text-sm hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to="/cookie-policy"
                className="text-gray-400 text-sm hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
              <Link 
                to="/admin"
                className="text-gray-400 text-sm hover:text-white transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
