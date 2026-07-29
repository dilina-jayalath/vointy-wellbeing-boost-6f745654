import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const FreeTeam = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          <div className="flex-1 p-8 md:p-12">
            <div className="inline-flex items-center gap-2 text-brand-blue font-semibold mb-4">
              <Users size={20} />
              <span>Free for companies</span>
            </div>
            <h2 className="text-3xl font-bold text-brand-dark mb-4">
              Unlimited employees. Unlimited teams. Free.
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Companies join Vointy for free and share credentials with employees across unlimited teams —
              no per-user fees, no team size limits. Only pay if you want the employer dashboard.
            </p>
            <Link to="/subscription">
              <Button className="btn-primary px-8">
                Get started free
              </Button>
            </Link>
          </div>
          <div className="md:w-1/3 bg-brand-blue flex items-center justify-center p-12">
            <div className="text-white text-center">
              <div className="text-6xl font-bold mb-2">0€</div>
              <div className="opacity-80 uppercase tracking-wider font-semibold">Forever free</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FreeTeam;
