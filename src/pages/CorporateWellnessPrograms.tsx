import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Activity,
  Users,
  BarChart3,
  Trophy,
  ClipboardList,
  MessageCircle,
  Check,
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'A 158-activity archive, plus your own',
    text: 'Employees pick activities from Vointy\u2019s archive of 158 ready-made activities, or create their own \u2014 for example a team nature walk. Every completed activity is worth one point.',
  },
  {
    icon: Users,
    title: 'Unlimited teams and employees',
    text: 'Split the company into as many teams as you need and give employees team-based access. There is no limit on the number of teams.',
  },
  {
    icon: BarChart3,
    title: 'Activity Index reporting',
    text: 'Points are summed monthly and then across the year from the day an employee joins, giving each team a comparable Activity Index.',
  },
  {
    icon: Trophy,
    title: 'Challenges and campaigns',
    text: 'Launch company-wide challenges and wellbeing campaigns, invite teams to take part and follow participation as it happens.',
  },
  {
    icon: ClipboardList,
    title: 'Surveys and ROI analysis',
    text: 'Run employee wellbeing surveys and upload your own sick leave file to compare absence data against activity data in the employer panel.',
  },
  {
    icon: MessageCircle,
    title: 'Social feed and team chat',
    text: 'A social-media style feed and real-time team chat keep the programme social instead of another dashboard nobody opens.',
  },
];

const faqs = [
  {
    q: 'What does a corporate wellness program with Vointy cost?',
    a: 'Joining Vointy is free: the free plan covers up to 1000 registered employees per company. The Employer panel \u2014 analytics, campaigns, events, invitations and reporting \u2014 costs \u20ac149/month per company and includes up to 1000 registered employees, with each additional 1000 registrations priced at \u20ac149/month.',
  },
  {
    q: 'How do employees join the program?',
    a: 'A company registers with a form and receives credentials by email. From the employer panel you invite employees by email, organise them into teams and activate their accounts.',
  },
  {
    q: 'How is wellbeing measured?',
    a: 'Through the Activity Index. Each employee earns one point for every completed activity; points are summed monthly and accumulated over the year following their join date, so teams and periods can be compared directly.',
  },
  {
    q: 'Can we see the effect on sick leave?',
    a: 'The ROI view lets an employer upload its own sick leave records as a CSV file and compare them with the company\u2019s activity data. Vointy does not supply absence figures for you \u2014 the comparison uses your data.',
  },
  {
    q: 'Do employees need to install an app?',
    a: 'No. Vointy runs in the browser and can be installed as a progressive web app on iOS (Safari) and Android (Chrome) from vointy.life.',
  },
];

const CorporateWellnessPrograms = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen">
      <Seo
        title="Corporate Wellness Programs — Vointy.life"
        description="Run a corporate wellness program with shared activities, unlimited teams and employer analytics. Free up to 1000 employees, employer panel €149/month."
        path="/corporate-wellness-programs"
        jsonLd={jsonLd}
      />
      <Header />

      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Corporate wellness programs that employees actually use
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Vointy is a corporate wellness program built around healthy habits
              and shared activities. Companies join for free with unlimited teams
              and up to 1000 registered employees; the Employer panel with
              analytics, campaigns and reporting is €149/month.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/company-signup">Start free for your company</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/subscription">See pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-5">
            <h2 className="text-3xl font-bold font-display">
              How the program works
            </h2>
            <p className="text-lg text-muted-foreground">
              Register your company with the free form and you receive
              credentials by email. In your own panel you invite employees,
              organise them into unlimited teams and choose activities from
              Vointy&apos;s archive or create your own. Employees complete
              activities in a social feed, earn one point per activity and see
              their team&apos;s progress.
            </p>
            <p className="text-lg text-muted-foreground">
              When you want tracking, analytics, campaign and event creation and
              invitation management, the{' '}
              <Link to="/subscription" className="text-brand-purple underline">
                Employer panel subscription
              </Link>{' '}
              opens the reporting views: activity summary, engagement,
              wellbeing, ROI against your own sick leave data, and predictive
              analytics.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-display text-center mb-12">
            What&apos;s included
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title}>
                <CardContent className="pt-6">
                  <f.icon className="h-10 w-10 text-brand-purple mb-4" />
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground">{f.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-8">
              What a company pays
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Free plan</h3>
                  <p className="text-muted-foreground mb-4">
                    €0 — up to 1000 registered employees per company,
                    unlimited teams, full activity archive and social feed.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <Check className="h-4 w-4 text-brand-purple mt-0.5" />
                      Employee invitations by email
                    </li>
                    <li className="flex gap-2">
                      <Check className="h-4 w-4 text-brand-purple mt-0.5" />
                      Team-based access
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">Employer panel</h3>
                  <p className="text-muted-foreground mb-4">
                    €149/month per company, including up to 1000 registered
                    employees. Each further 1000 registrations is
                    €149/month.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <Check className="h-4 w-4 text-brand-purple mt-0.5" />
                      Tracking, analytics and reporting
                    </li>
                    <li className="flex gap-2">
                      <Check className="h-4 w-4 text-brand-purple mt-0.5" />
                      Campaigns, events and invitations
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="text-lg font-bold mb-2">{f.q}</h3>
                  <p className="text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display mb-4">
            Start your wellness program this week
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Register your company for free, or{' '}
            <Link to="/contact-form" className="text-brand-purple underline">
              contact us
            </Link>{' '}
            to walk through the Employer panel first. Read more{' '}
            <Link to="/about" className="text-brand-purple underline">
              about Wellthyforce Oy
            </Link>
            .
          </p>
          <Button asChild size="lg">
            <Link to="/company-signup">Create a free company account</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CorporateWellnessPrograms;
