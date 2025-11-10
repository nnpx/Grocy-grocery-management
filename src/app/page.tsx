import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChefHat, ListChecks, Heart, Users } from "lucide-react";
import Image from "next/image";
import { RecipeCard } from "@/components/grocy/RecipeCard";
import { mockRecipes } from "@/lib/mock-data";

export default function LandingPage() {
  const communityRecipes = mockRecipes.slice(0, 6);

  return (
    <div className="bg-background font-body text-foreground">
      {/* Header */}
      <header className="top-0 z-40 sticky bg-background/80 backdrop-blur-sm">
        <div className="flex justify-between items-center mx-auto px-4 sm:px-6 h-20 container">
          <Link href="/" className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="font-headline font-bold text-primary text-2xl">
              Grocy
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 font-medium text-sm">
            <Link
              href="/"
              className="text-foreground/80 hover:text-accent transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard/recipes"
              className="text-foreground/80 hover:text-accent transition-colors"
            >
              Community Recipes
            </Link>
            <Link
              href="/login"
              className="text-foreground/80 hover:text-accent transition-colors"
            >
              Login
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              asChild
              className="hidden md:flex hover:bg-accent/90 uppercase tracking-wide"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button asChild variant="ghost" className="md:hidden">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 container">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-headline font-bold text-foreground text-4xl sm:text-6xl tracking-tight">
              Smarter Grocery Management.{" "}
              <span className="text-accent">Delicious</span> Recipe Inspiration.
            </h1>
            <p className="mt-6 text-muted-foreground text-lg leading-8">
              Track groceries, avoid waste, and explore community-shared recipes
              — all in one place.
            </p>
            <div className="flex justify-center items-center gap-x-6 mt-10">
              <Button
                asChild
                size="lg"
                className="hover:bg-accent/90 uppercase tracking-wide"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
              <Link
                href="/login"
                className="font-semibold text-foreground/80 hover:text-accent text-sm leading-6"
              >
                Log in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="flow-root mt-16 sm:mt-24">
            <div className="bg-gray-900/5 -m-2 lg:-m-4 p-2 lg:p-4 rounded-xl lg:rounded-2xl ring-1 ring-gray-900/10 ring-inset">
              <Image
                src="https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/chicken_and_seafood_62744_16x9.jpg"
                alt="A vibrant display of fresh groceries and prepared meals, showcasing the possibilities with Grocy."
                width={1200}
                height={600}
                className="shadow-2xl rounded-lg ring-1 ring-gray-900/10 w-full object-cover"
                data-ai-hint="vibrant groceries meals"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="gap-12 md:gap-8 grid grid-cols-1 md:grid-cols-3 text-center">
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center bg-accent/10 mb-4 rounded-2xl w-16 h-16 text-accent">
                  <ListChecks className="w-8 h-8" />
                </div>
                <h3 className="font-headline font-bold text-xl">
                  Track Your Groceries
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Add items, set expiry dates, and always know what's in your
                  pantry.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center bg-accent/10 mb-4 rounded-2xl w-16 h-16 text-accent">
                  <ChefHat className="w-8 h-8" />
                </div>
                <h3 className="font-headline font-bold text-xl">
                  Get Recipe Suggestions
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Discover delicious recipes based on the ingredients you
                  already have at home.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center bg-accent/10 mb-4 rounded-2xl w-16 h-16 text-accent">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-headline font-bold text-xl">
                  Save Your Favorites
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Keep a personal collection of the recipes you love and want to
                  make again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Highlight Section */}
        <section className="py-20 sm:py-32">
          <div className="text-center">
            <h2 className="font-headline font-bold text-foreground text-3xl sm:text-4xl">
              From Our Community Kitchen
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Explore tasty{" "}
              <span className="font-semibold text-accent">recipes</span> shared
              by food lovers like you.
            </p>
          </div>
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-12">
            {communityRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="hover:bg-accent/10 hover:border-accent hover:text-accent uppercase tracking-wide"
            >
              <Link href="/dashboard/recipes">Browse More Recipes</Link>
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-32">
          <div className="relative mx-auto max-w-2xl text-center">
            <div className="top-1/2 -z-10 absolute inset-x-0 flex justify-center overflow-hidden -translate-y-1/2">
              <div
                className="flex-none bg-accent/20 opacity-50 blur-3xl rounded-full w-[50rem] h-[20rem] -translate-x-1/2"
                aria-hidden="true"
              />
            </div>
            <h2 className="font-headline font-bold text-foreground text-3xl sm:text-4xl tracking-tight">
              Ready to waste less and cook more?
            </h2>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="hover:bg-accent/90 uppercase tracking-wide"
              >
                <Link href="/signup">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="flex md:flex-row flex-col justify-between items-center gap-4 mx-auto px-4 sm:px-6 py-8 container">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Grocy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
