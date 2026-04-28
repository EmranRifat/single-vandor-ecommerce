// 'use client';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { CartProvider } from '@/lib/cart-context';
// import { Provider } from 'react-redux';
// import { store } from '@/lib/store';
// import { HeroUIProvider } from '@heroui/react';
// import { useState, ReactNode } from 'react';

// export function Providers({ children }: { children: ReactNode }) {
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 60 * 1000,
//             refetchOnWindowFocus: false,
//           },
//         },
//       })
//   );

//   return (
//     <HeroUIProvider>
//       <Provider store={store}>
//         <QueryClientProvider client={queryClient}>
//           <CartProvider>{children}</CartProvider>
//         </QueryClientProvider>
//       </Provider>
//     </HeroUIProvider>
//   );
// }



'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/lib/cart-context';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/lib/store';
import { useState, ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );


  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>{children}</CartProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}