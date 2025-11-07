"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/lib/types";
import { FavoritesClient } from "@/components/grocy/FavoritesClient";
import { useToast } from "@/hooks/use-toast";

type ApiResp = { recipes: Recipe[] };

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const token = sessionStorage.getItem("AUTH_TOKEN");
    if (!token) {
      toast({
        variant: "destructive",
        title: "Log in Required",
        description: "Please log in to access your favorite recipes.",
      });
      router.push("/login");
      return;
    }

    async function fetchFavorites() {
      try {
        const res = await fetch("/api/dashboard/favorites", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data: ApiResp & { error?: string } = await res.json();
        console.log("⭐ Favorites API result:", data);

        if (!res.ok) {
          if (res.status === 401) {
            sessionStorage.removeItem("AUTH_TOKEN");
            toast({
              variant: "destructive",
              title: "Session Expired",
              description: "Please log in again.",
            });
            setTimeout(() => router.push("/login"), 500);
          } else {
            toast({
              variant: "destructive",
              title: "Error Loading Favorites",
              description: data.error || "Could not load favorite recipes.",
            });
          }
          setLoading(false);
          return;
        }

        setRecipes(data.recipes || []);
        setLoading(false);
      } catch (error) {
        console.error("Favorites fetch error:", (error as Error).message);
        toast({
          variant: "destructive",
          title: "Network Error",
          description: "Could not connect to the server.",
        });
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [router, toast]);

  if (loading)
    return <div className="py-10 text-center">Loading Favorite Recipes...</div>;
  if (!recipes)
    return (
      <div className="py-10 text-gray-500 text-center">
        Favorites page not available.
      </div>
    );

  return <FavoritesClient recipes={recipes} />;
}
