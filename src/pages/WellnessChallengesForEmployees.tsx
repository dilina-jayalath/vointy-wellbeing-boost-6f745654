import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Moon, Footprints, Activity, Users, Sun, PlusCircle } from 'lucide-react';

const challengeTypes = [
  {
    icon: Moon,
    title: 'Recovery challenges',
    text: 'Sleep consistency, micro-breaks and stress reset routines — activities that help teams recover instead of only pushing harder.',
  },
  {
    icon: Footprints,
    title: 'Move more, effortlessly',
    text: 'Steps, active minutes and walk-and-talk meetings, so movement fits into a normal working day.',
  },
  {
    icon: Activity,
    title: 'Ergonomics & mobility',
    text: 'Five-minute mobility breaks, neck and shoulder routines and a desk setup checklist.',
  },
  {
    icon: Users,
    title: 'Team challenges',
    text: 'Shared goals, buddy pairs and encouragement with check-ins in the team feed and chat.',
  },
  {
    icon: Sun,
    title: 'Healthy routines',
    text: 'Hydration, outdoor time, screen breaks and one wellbeing action a day.',
  },
  {
    icon: PlusCircle,
    title: 'Your own challenge',
    text: 'Pick from Vointy\u2019s archive of 158 ready-made activities or create your own, such as a team nature walk.',
  },
];

const steps = [
  {
    title: '1. Create the challenge',
    text: 'In the Employer panel you name the challenge, set its period and choose which activities count towards it.',
  },
  {
    title: '2. Invite teams',
    text: 'Invite employees by email and organise them into as many teams as you need — there is no limit on teams or team size.',
  },
  {
    title: '3. Employees take part',
    text: 'Employees complete activities in a social-media style feed, earn one point per completed activity and cheer each other on in team chat.',
  },
  {
    title: '4. Follow the results',
    text: 'Points are summed monthly and across the year from each employee\u2019s join date, giving every team a comparable Activity Index.',
  },
];

const WellnessChallengesForEmployees = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to run a wellness challenge for employees with Vointy',
    description:
      'Create a wellness challenge in the Vointy Employer panel, invite teams, let employees complete activities and follow results through the Activity Index.',
    step: steps.map((s) => ({
      '@type': 'HowToStep',
      name: s.title,
      text: s.text,
    })),
  };

  return (
    <div className="min-h-screen">
      <Seo
        title="Wellness Challenges for Employees — Vointy.life"
        description="Run wellness challenges for employees: recovery, movement and team challenges from a 158-activity archive. Free for companies; Employer panel €149/month."
        path="/wellness-challenges-for-employees"
        jsonLd={jsonLd}
      />
      <Header />

      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-purple to-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Wellness challenges for employees
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Launch recovery, movement, mobility and team challenges in Vointy.
              Employees pick from an archive of 158 activities or create their
              own, earn one point per completed activity and see their team&apos;s
              progress. Companies join free; the Employer panel that creates
              challenges and campaigns is €149/month.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/company-signup">Start free for your company</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/subscription">See pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-display text-center mb-12">
            Challenge types you can run
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {challengeTypes.map((c) => (
              <Card key={c.title}>
                <CardContent className="pt-6">
                  <c.icon className="h-10 w-10 text-brand-purple mb-4" />
                  <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                  <p className="text-muted-foreground">{c.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-display mb-8">
              How a challenge runs in Vointy
            </h2>
            <div className="space-y-6">
              {steps.map((s) => (
                <div key={s.title}>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-5">
            <h2 className="text-3xl font-bold font-display">
              What it costs to run challenges
            </h2>
            <p className="text-lg text-muted-foreground">
              Joining Vointy is free and covers up to 1,000 registered employees
              per company, unlimited teams and the full activity archive.
              Creating challenges, campaigns and events, plus tracking and
              analytics, comes with the{' '}
              <Link to="/subscription" className="text-brand-purple underline">
                Employer panel subscription at €149/month
              </Link>{' '}
              per company, including up to 1,000 registered employees.
            </p>
            <p className="text-lg text-muted-foreground">
              Challenges are one part of a wider programme — see how the whole{' '}
              <Link
                to="/corporate-wellness-programs"
                className="text-brand-purple underline"
              >
                corporate wellness program works
              </Link>
              , or{' '}
              <Link to="/contact-form" className="text-brand-purple underline">
                contact the Vointy team
              </Link>{' '}
              to walk through the Employer panel.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display mb-4">
            Start your first employee challenge
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Register your company for free and invite your first team this week.
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

export default WellnessChallengesForEmployees;
