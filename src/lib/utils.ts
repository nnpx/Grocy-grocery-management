import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInDays, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getExpiryStatus(expiryDate: string) {
  const daysLeft = differenceInDays(parseISO(expiryDate), new Date());

  if (daysLeft <= 2) {
    return {
      text: daysLeft <= 0 ? 'Expired' : `Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
      variant: 'destructive' as const,
      days: daysLeft,
    };
  }
  if (daysLeft <= 7) {
    return {
      text: `Expires in ${daysLeft} days`,
      variant: 'accent' as const,
      days: daysLeft,
    };
  }
  return {
    text: `Expires in ${daysLeft} days`,
    variant: 'primary' as const,
    days: daysLeft,
  };
}
