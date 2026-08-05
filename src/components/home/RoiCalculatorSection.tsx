import { Link } from 'react-router-dom';
import RoiCalculatorWidget from '@/components/RoiCalculatorWidget';
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
