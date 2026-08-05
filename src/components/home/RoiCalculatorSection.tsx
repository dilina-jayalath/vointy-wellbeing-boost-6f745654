import { Link } from 'react-router-dom';
import RoiCalculatorWidget from '@/components/RoiCalculatorWidget';

const RoiCalculatorSection = () => {
  return (
    <section id="roi-calculator" className="py-16 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Wellbeing ROI calculator</h2>
          <p className="text-lg text-muted-foreground">
            Enter your number of employees and average salary. The calculator shows the estimated
            savings your company can reach on the vointy.life platform.
          </p>
        </div>
        <RoiCalculatorWidget idPrefix="home-roi" />
        <p className="text-center text-sm text-muted-foreground mt-8">
          <Link to="/roi-calculator" className="underline">
            Open the full ROI calculator page
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RoiCalculatorSection;
