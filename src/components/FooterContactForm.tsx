import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send } from 'lucide-react';

const FooterContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_submissions').insert([
        {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          company_name: form.companyName || null,
          subject: form.subject,
          message: form.message,
          category: 'contact',
        },
      ]);
      if (error) throw error;

      toast({ title: 'Thank you! Your message has been sent.' });
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast({
        title: 'Something went wrong',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-brand-dark mb-3">Contact us</h2>
            <p className="text-muted-foreground">
              Send us a message and we will get back to you.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-brand-purple">
              <Mail size={18} />
              <span className="font-medium">contact@vointy.life</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-card p-6 sm:p-8 rounded-xl border shadow-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fc-firstName">First name</Label>
                <Input id="fc-firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fc-lastName">Last name</Label>
                <Input id="fc-lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fc-email">Email</Label>
                <Input id="fc-email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fc-companyName">Company (optional)</Label>
                <Input id="fc-companyName" name="companyName" value={form.companyName} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fc-subject">Subject</Label>
              <Input id="fc-subject" name="subject" value={form.subject} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fc-message">Message</Label>
              <Textarea id="fc-message" name="message" value={form.message} onChange={handleChange} rows={5} required />
            </div>

            <Button type="submit" className="w-full btn-primary h-12" disabled={isSubmitting}>
              <Send size={18} className="mr-2" />
              {isSubmitting ? 'Sending...' : 'Send message'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FooterContactForm;
