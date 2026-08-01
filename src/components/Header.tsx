import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import BackButton from '@/components/BackButton';
import vointyMark from '@/assets/vointy-mark.png.asset.json';


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { user, signOut, isAdmin } = useAuth();
  const { pathname } = useLocation();
  const showBack = pathname !== '/';


  const navLinks = [
    { label: t('nav.features'), href: '#features' },
    { label: t('nav.benefits'), href: '#benefits' },
    { label: t('nav.testimonials'), href: '#testimonials' },
    { label: t('nav.pricing'), href: '/subscription', isLink: true },
    ...(user ? [{ label: t('navExtra.myVointy'), href: '/app', isLink: true }] : []),
    { label: t('navExtra.employerPanel'), href: '/employer', isLink: true },
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBack && <BackButton className="text-gray-700 hover:text-brand-purple px-2" />}
            <Link to="/" className="flex items-center gap-2">
              <img src={vointyMark.url} alt="Vointy logo" className="h-9 w-auto" />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-bold text-brand-purple">Vointy<span className="text-brand-blue">.life</span></span>
                <span className="text-[11px] text-gray-500 font-medium tracking-wide">{t('hero.slogan', { defaultValue: 'Build healthier habits, together.' })}</span>
              </div>
            </Link>
          </div>

          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              {navLinks.map((link) => (
                link.isLink ? (
                  <Link key={link.label} to={link.href} className="text-gray-700 hover:text-brand-purple transition-colors font-medium text-sm lg:text-base">
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href} className="text-gray-700 hover:text-brand-purple transition-colors font-medium text-sm lg:text-base">
                    {link.label}
                  </a>
                )
              ))}
            </nav>
            
            <div className="h-6 w-px bg-gray-200" />
            
            <LanguageSwitcher />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/account" className="text-gray-700 hover:text-brand-purple transition-colors flex items-center gap-1 font-medium">
                  <UserIcon size={18} />
                  <span>{t('nav.account')}</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-brand-purple transition-colors font-medium">
                    {t('nav.admin')}
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={() => signOut()} className="flex items-center gap-1 text-gray-700 hover:text-red-600">
                  <LogOut size={18} />
                  <span>{t('nav.logout')}</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="btn-primary">{t('nav.login')}</Button>
              </Link>
            )}
          </div>
          
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-white border-t mt-4 py-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col space-y-4 px-2">
              {navLinks.map((link) => (
                link.isLink ? (
                  <Link 
                    key={link.label}
                    to={link.href} 
                    className="text-gray-700 hover:text-brand-purple transition-colors px-4 py-2 text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a 
                    key={link.label}
                    href={link.href} 
                    className="text-gray-700 hover:text-brand-purple transition-colors px-4 py-2 text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              ))}
              <div className="px-4 py-2">
                <p className="text-sm text-gray-500 mb-2">Language</p>
                <LanguageSwitcher />
              </div>
              <div className="px-4 pt-4 border-t flex flex-col space-y-4">
                {user ? (
                  <>
                    <Link 
                      to="/account" 
                      className="text-gray-700 flex items-center gap-2 text-lg font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserIcon size={20} />
                      {t('nav.account')}
                    </Link>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="text-gray-700 text-lg font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t('nav.admin')}
                      </Link>
                    )}
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start gap-2" 
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut size={20} />
                      {t('nav.logout')}
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full btn-primary">{t('nav.login')}</Button>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
