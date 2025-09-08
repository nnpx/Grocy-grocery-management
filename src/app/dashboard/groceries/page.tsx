import { GroceryItemsClient } from '@/components/grocy/GroceryItemsClient';
import { mockGroceryItems } from '@/lib/mock-data';

export default function GroceriesPage() {
    return <GroceryItemsClient items={mockGroceryItems} />;
}
