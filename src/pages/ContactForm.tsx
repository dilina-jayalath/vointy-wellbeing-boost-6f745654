import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, CheckCircle2 } from 'lucide-react';

const ContactForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          company_name: formData.companyName,
          subject: formData.subject,
          message: formData.message
        }]);

      if (error) throw error;

      toast({
        title: t('license.success'),
        variant: 'default',
      });
      setIsSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Submission error:', error);
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-brand-dark mb-4">{t('license.title')}</h1>
            <p className="text-xl text-gray-600">{t('license.description')}</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {isSuccess ? (
              <Card className="text-center p-12 shadow-xl border-none">
                <CardContent className="space-y-6">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-bold text-brand-dark">{t('license.success')}</h2>
                  <p className="text-gray-600 text-lg">{t('contactFormPage.successMessage')}</p>
                  <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                    {t('contactFormPage.sendAnother')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-2xl border-none overflow-hidden">
                <CardHeader className="bg-brand-purple text-white p-8">
                  <h2 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-3">
                    <Send size={24} />
                    {t('license.formTitle')}
                  </h2>
                </CardHeader>
                <CardContent className="p-8 bg-white">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                          {t('license.firstName')} *
                        </Label>
                        <Input 
                          id="firstName" 
                          name="firstName" 
                          value={formData.firstName} 
                          onChange={handleChange} 
                          placeholder={t('contactFormPage.placeholderFirstName')}
                          required 
                          className="h-12 border-gray-200 focus:border-brand-purple focus:ring-brand-purple"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                          {t('license.lastName')} *
                        </Label>
                        <Input 
                          id="lastName" 
                          name="lastName" 
                          value={formData.lastName} 
                          onChange={handleChange} 
                          placeholder={t('contactFormPage.placeholderLastName')}
                          required 
                          className="h-12 border-gray-200 focus:border-brand-purple focus:ring-brand-purple"
                        />
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                          {t('license.email')} *
                        </Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          placeholder={t('contactFormPage.placeholderEmail')}
                          required 
                          className="h-12 border-gray-200 focus:border-brand-purple focus:ring-brand-purple"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-sm font-semibold text-gray-700">
                          {t('license.companyName')} *
                        </Label>
                        <Input 
                          id="companyName" 
                          name="companyName" 
                          value={formData.companyName} 
                          onChange={handleChange} 
                          placeholder={t('contactFormPage.placeholderCompany')}
                          required 
                          className="h-12 border-gray-200 focus:border-brand-purple focus:ring-brand-purple"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">
                        {t('license.subject')} *
                      </Label>
                      <Input 
                        id="subject" 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleChange} 
                        placeholder={t('contactFormPage.placeholderSubject')}
                        required 
                        className="h-12 border-gray-200 focus:border-brand-purple focus:ring-brand-purple"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                        {t('license.message')} *
                      </Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        rows={6} 
                        placeholder={t('contactFormPage.placeholderMessage')}
                        required 
                        className="border-gray-200 focus:border-brand-purple focus:ring-brand-purple resize-none"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full btn-primary h-14 text-lg font-bold shadow-lg shadow-brand-purple/20 transition-all hover:-translate-y-0.5" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('contactFormPage.sending') : t('license.submit')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactForm;
