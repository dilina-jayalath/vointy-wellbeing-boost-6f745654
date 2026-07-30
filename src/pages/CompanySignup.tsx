import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2, MailCheck } from "lucide-react";

const perks = [
  "Unlimited employees",
  "Unlimited teams",
  "All activities",
  "No per-user fees",
];

const CompanySignup = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/employer`,
        data: {
          full_name: form.contactName.trim(),
          company_name: form.companyName.trim(),
          account_type: "employer",
        },
      },
    });
    setIsLoading(false);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-display text-brand-dark mb-4 leading-tight">
                Join Vointy <span className="gradient-text">free</span> as a company
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Register your company, get your credentials by email, and invite your employees from your own
                company panel. Unlimited employees, unlimited teams — no cost.
              </p>
              <ul className="space-y-3">
                {perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-brand-purple flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mt-8">
                Need analytics, campaigns and events?{" "}
                <Link to="/subscription" className="text-brand-purple font-medium hover:underline">
                  See the €149/month Employer Dashboard
                </Link>
              </p>
            </div>

            {done ? (
              <Card className="shadow-xl border-none">
                <CardContent className="p-10 text-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <MailCheck size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-dark">Check your email</h2>
                  <p className="text-gray-600">
                    We sent a confirmation link to <strong>{form.email}</strong>. Confirm it to activate your
                    credentials, then sign in to your company panel and start inviting employees.
                  </p>
                  <Button asChild className="bg-brand-purple hover:bg-brand-purple-dark">
                    <Link to="/login">Go to login</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-2xl border-none overflow-hidden">
                <CardHeader className="bg-brand-purple text-white p-8">
                  <CardTitle className="text-2xl">Create your company account</CardTitle>
                  <CardDescription className="text-white/80">
                    Free forever. No credit card required.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 bg-white">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company name *</Label>
                      <Input id="companyName" name="companyName" value={form.companyName} onChange={onChange} required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact person *</Label>
                      <Input id="contactName" name="contactName" value={form.contactName} onChange={onChange} required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work email *</Label>
                      <Input id="email" name="email" type="email" value={form.email} onChange={onChange} required className="h-12" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input id="password" name="password" type="password" value={form.password} onChange={onChange} required className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm password *</Label>
                        <Input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} required className="h-12" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full btn-primary h-12 text-lg font-bold" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create free company account"}
                    </Button>
                    <p className="text-sm text-gray-500 text-center">
                      Already registered?{" "}
                      <Link to="/login" className="text-brand-purple hover:underline">Log in</Link>
                    </p>
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

export default CompanySignup;
