import { Link } from 'react-router-dom';
import RoiCalculatorWidget from '@/components/RoiCalculatorWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Monitor } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const RoiCalculatorSection = () => {
  const { t } = useTranslation();

  return (
    <section id="roi-calculator" className="py-16 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('roi.home.title')}</h2>
          <p className="text-lg text-muted-foreground">{t('roi.home.desc')}</p>
        </div>
        <RoiCalculatorWidget idPrefix="home-roi" />
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gradient-to-br from-brand-purple/10 via-background to-brand-blue/10 border-brand-purple/20">
            <CardContent className="p-8 md:p-10 text-center">
              <div className="flex justify-center gap-4 mb-6">
                <div className="bg-brand-purple/10 p-3 rounded-full">
                  <Monitor className="h-6 w-6 text-brand-purple" />
                </div>
                <div className="bg-brand-blue/10 p-3 rounded-full">
                  <Smartphone className="h-6 w-6 text-brand-blue" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{t('roi.page.downloadTitle')}</h3>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t('roi.page.downloadDesc')}</p>
              <Button asChild size="lg" className="btn-primary">
                <Link to="/download">{t('roi.page.downloadCta')}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          <Link to="/roi-calculator" className="underline">
            {t('roi.home.fullLink')}
          </Link>
        </p>

      </div>
    </section>
  );
};

export default RoiCalculatorSection;
