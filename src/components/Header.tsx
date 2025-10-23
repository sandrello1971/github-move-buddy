import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import sabadvanceLogo from '/lovable-uploads/9afc0cc7-085e-45e9-8a5d-eaccf88663b6.png';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
        </div>
      </div>
    </header>
  );
};