import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChefHat, ListChecks, Heart, Users } from 'lucide-react';
import Image from 'next/image';
import { RecipeCard } from '@/components/grocy/RecipeCard';
import { mockRecipes } from '@/lib/mock-data';

export default function LandingPage() {
  const communityRecipes = mockRecipes.slice(0, 6);

  return (
    <div className="bg-background font-body text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline text-primary">Grocy</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/" className="text-foreground/80 transition-colors hover:text-primary">Home</Link>
            <Link href="/dashboard/recipes" className="text-foreground/80 transition-colors hover:text-primary">Community Recipes</Link>
            <Link href="/login" className="text-foreground/80 transition-colors hover:text-primary">Login</Link>
          </nav>
          <div className="flex items-center gap-4">
             <Button asChild className="hidden md:flex tracking-wide uppercase">
                <Link href="/signup">Sign Up</Link>
            </Button>
            <Button asChild variant="ghost" className="md:hidden">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <section className="py-20 text-center sm:py-32">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-6xl">
              Smarter Grocery Management. Delicious Recipe Inspiration.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Track groceries, avoid waste, and explore community-shared recipes — all in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="tracking-wide uppercase">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Link href="/login" className="text-sm font-semibold leading-6 text-foreground/80">
                Log in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
           <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image 
                src="https://picsum.photos/seed/grocy-hero/1200/600" 
                alt="A vibrant display of fresh groceries and prepared meals, showcasing the possibilities with Grocy."
                width={1200}
                height={600}
                className="rounded-lg shadow-2xl ring-1 ring-gray-900/10"
                data-ai-hint="vibrant groceries meals"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3 md:gap-8">
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ListChecks className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold font-headline">Track Your Groceries</h3>
                <p className="mt-2 text-muted-foreground">Add items, set expiry dates, and always know what's in your pantry.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ChefHat className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold font-headline">Get Recipe Suggestions</h3>
                <p className="mt-2 text-muted-foreground">Discover delicious recipes based on the ingredients you already have at home.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold font-headline">Save Your Favorites</h3>
                <p className="mt-2 text-muted-foreground">Keep a personal collection of the recipes you love and want to make again.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Highlight Section */}
        <section className="py-20 sm:py-32">
            <div className="text-center">
                <h2 className="text-3xl font-bold font-headline text-foreground sm:text-4xl">From Our Community Kitchen</h2>
                <p className="mt-4 text-lg text-muted-foreground">Explore tasty recipes shared by food lovers like you.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {communityRecipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
            <div className="mt-12 text-center">
                <Button asChild size="lg" variant="outline" className="tracking-wide uppercase">
                    <Link href="/dashboard/recipes">Browse More Recipes</Link>
                </Button>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl">
              Ready to waste less and cook more?
            </h2>
            <div className="mt-10">
              <Button asChild size="lg" className="tracking-wide uppercase">
                <Link href="/signup">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Grocy. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">About</Link>
            <Link href="/contact" className="text-muted-foreground transition-colors hover:text-primary">Contact</Link>
            <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
