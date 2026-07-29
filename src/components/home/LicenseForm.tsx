import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send } from 'lucide-react';

const LicenseForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">
              {t('license.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('license.description')}
            </p>
            <div className="flex items-center gap-4 text-brand-purple">
              <div className="w-12 h-12 rounded-full bg-brand-purple/10 flex items-center justify-center">
                <Mail size={24} />
              </div>
              <div>
                <div className="font-bold">Email us</div>
                <div className="text-gray-500">hello@vointy.life</div>
              </div>
            </div>
          </div>
          
          <Card className="flex-1 shadow-2xl border-none">
            <CardHeader className="bg-brand-purple text-white rounded-t-xl">
              <CardTitle className="text-xl flex items-center gap-2">
                <Send size={20} />
                {t('license.formTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('license.firstName')}</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('license.lastName')}</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('license.email')}</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">{t('license.companyName')}</Label>
                    <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('license.subject')}</Label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">{t('license.message')}</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} required />
                </div>
                
                <Button type="submit" className="w-full btn-primary h-12 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : t('license.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LicenseForm;
