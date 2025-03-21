
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';

const Header = () => {
  return (
    <header className="border-b py-4 px-4 bg-background">
      <div className="container mx-auto max-w-7xl flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">Signpov</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Templates</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background/95 backdrop-blur-sm shadow-lg border border-border">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link to="/templates" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-primary/5 p-6 no-underline outline-none focus:shadow-md">
                          <FileText className="h-6 w-6 text-primary mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium text-foreground">
                            Document Templates
                          </div>
                          <p className="text-sm leading-tight text-foreground/70">
                            Browse and edit our collection of document templates for contracts, agreements, and more.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/editor" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground bg-background/80">
                          <div className="text-sm font-medium leading-none text-foreground">Create New</div>
                          <p className="line-clamp-2 text-sm leading-snug text-foreground/70">
                            Start from scratch with our online document editor
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/templates?category=contract" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground bg-background/80">
                          <div className="text-sm font-medium leading-none text-foreground">Contracts</div>
                          <p className="line-clamp-2 text-sm leading-snug text-foreground/70">
                            Browse our collection of contract templates
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/templates?category=agreement" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground bg-background/80">
                          <div className="text-sm font-medium leading-none text-foreground">Agreements</div>
                          <p className="line-clamp-2 text-sm leading-snug text-foreground/70">
                            Browse our collection of agreement templates
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
            Dashboard
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button asChild variant="outline" className="rounded-lg">
            <Link to="/dashboard">
              My Documents
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
