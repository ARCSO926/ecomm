import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t bg-secondary/40 mt-24">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">S</span>
              Shelfie
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Thoughtfully sourced goods, delivered fast. Shop smarter with AI-guided recommendations.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground"><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="YouTube" className="text-muted-foreground hover:text-foreground"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-foreground">All products</Link></li>
              <li><Link to="/shop?category=featured" className="hover:text-foreground">Featured</Link></li>
              <li><Link to="/cart" className="hover:text-foreground">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
              <li><a href="#" className="hover:text-foreground">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Stay in the loop</h4>
            <p className="text-sm text-muted-foreground mb-3">Get product drops and offers in your inbox.</p>
            {subscribed ? (
              <p className="text-sm text-primary font-medium">You're subscribed. Thanks!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit">Join</Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Shelfie. All rights reserved.</p>
          <p>Built with React, Supabase & Groq AI.</p>
        </div>
      </div>
    </footer>
  );
}
