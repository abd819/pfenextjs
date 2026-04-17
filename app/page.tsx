import { redirect } from 'next/navigation';

export default function RootPage() {
  // Directly force the root execution to bounce to the Arabic login view
  redirect('/ar/login');
}
