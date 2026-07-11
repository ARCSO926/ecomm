import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, User, X, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/shop#categories" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, signOut, profile } = useAuth();
  const totalItems = useCartStore((s) => s.totalItems());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">S</span>
          Shelfie
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-9"
            />
          </div>
        </form>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-accent-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/admin" aria-label="Admin dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile" aria-label="Profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => signOut()} aria-label="Sign out">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button asChild className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className={cn("md:hidden overflow-hidden transition-all", open ? "max-h-64 border-t" : "max-h-0")}>
        <div className="container flex flex-col gap-3 py-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-9" />
          </form>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="text-sm font-medium" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          )}
          {profile && <p className="text-xs text-muted-foreground">Signed in as {profile.email}</p>}
        </div>
      </div>
    </header>
  );
}
