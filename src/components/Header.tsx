import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import sabadvanceLogo from '/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { to: '/', label: 'Home' },
    { to: '/blog?category=interviste', label: 'Interviste' },
    { to: '/blog?category=cucina', label: 'Cucina' },
    { to: '/blog?category=lifestyle-e-tempo-libero', label: 'Lifestyle' },
    { to: '/chi-siamo', label: 'Chi Siamo' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <img src={sabadvanceLogo} alt="Sabadvance - Logo" className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-blog-terracotta transition-all duration-300 relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blog-terracotta transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/blog?category=interviste" className="text-sm font-medium text-foreground hover:text-blog-terracotta transition-all duration-300 relative group">
            Interviste
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blog-terracotta transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/blog?category=cucina" className="text-sm font-medium text-foreground hover:text-blog-terracotta transition-all duration-300 relative group">
            Cucina
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blog-terracotta transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/blog?category=lifestyle-e-tempo-libero" className="text-sm font-medium text-foreground hover:text-blog-terracotta transition-all duration-300 relative group">
            Lifestyle
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blog-terracotta transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/chi-siamo" className="text-sm font-medium text-foreground hover:text-blog-terracotta transition-all duration-300 relative group">
            Chi Siamo
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blog-terracotta transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-lg font-medium text-foreground hover:text-blog-terracotta transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};