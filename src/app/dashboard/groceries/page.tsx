"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { GroceryItem } from "@/lib/types";
import { GroceryItemsClient } from "@/components/grocy/GroceryItemsClient";
import { useToast } from "@/hooks/use-toast";

type ApiResp = { items: GroceryItem[]; categories: string[] };

export default function GroceriesPage() {
  const [items, setItems] = useState<GroceryItem[] | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const token = sessionStorage.getItem("AUTH_TOKEN");
    if (!token) {
      toast({
        variant: "destructive",
        title: "Log in Required",
        description: "Please log in to access groceries page.",
      });
      router.push("/login");
      return;
    }

    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard/groceries", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result: ApiResp & { error?: string } = await response.json();
        console.log("Groceries API result:", result);

        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem("AUTH_TOKEN");
            toast({
              variant: "destructive",
              title: "Session Expired",
              description: "Please log in again.",
            });
            setTimeout(() => router.push("/login"), 500);
          } else if (response.status === 403) {
            toast({
              variant: "destructive",
              title: "Access Denied",
              description: "You do not have permission.",
            });
            setTimeout(() => router.push("/login"), 500);
          } else {
            toast({
              variant: "destructive",
              title: "Error Loading Groceries",
              description: result.error || "Try again later.",
            });
          }
          setLoading(false);
          return;
        }

        setItems(result.items || []);
        setCategories(result.categories || []);
        setLoading(false);
      } catch (e) {
        console.error("Groceries fetch error:", (e as Error).message);
        toast({
          variant: "destructive",
          title: "Network Error",
          description: "Could not connect to the server.",
        });
        setLoading(false);
      }
    }

    fetchData();
  }, [router, toast]);

  if (loading)
    return <div className="py-10 text-center">Loading Groceries...</div>;
  if (!items)
    return (
      <div className="py-10 text-gray-500 text-center">
        Groceries page not available.
      </div>
    );

  return <GroceryItemsClient items={items} categories={categories} />;
}
