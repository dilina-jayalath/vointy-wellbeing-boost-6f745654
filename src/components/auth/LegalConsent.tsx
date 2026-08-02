import React from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "@/lib/i18n";

interface LegalConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

const LegalConsent = ({ checked, onChange, id = "legal-consent" }: LegalConsentProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        className="mt-0.5"
        aria-required
      />
      <label htmlFor={id} className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
        {t("legalConsent.prefix")}{" "}
        <Link to="/terms-of-service" target="_blank" className="text-brand-purple hover:underline font-medium">
          {t("legalConsent.terms")}
        </Link>
        {", "}
        <Link to="/privacy-policy" target="_blank" className="text-brand-purple hover:underline font-medium">
          {t("legalConsent.privacy")}
        </Link>{" "}
        {t("legalConsent.and")}{" "}
        <Link to="/cookie-policy" target="_blank" className="text-brand-purple hover:underline font-medium">
          {t("legalConsent.cookies")}
        </Link>
        {t("legalConsent.suffix")} *
      </label>
    </div>
  );
};

export default LegalConsent;
