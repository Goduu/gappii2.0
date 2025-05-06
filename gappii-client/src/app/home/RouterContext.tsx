import { createContext, useContext, ReactNode, useState } from 'react';
import { Route } from './menuOptionsList';

interface RouterContextType {
    router: Route;
    setRouter: (router: Route) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
    children: ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
    const [router, setRouter] = useState<Route>('home');

    return (
        <RouterContext.Provider value={{ router, setRouter }}>
            {children}
        </RouterContext.Provider>
    );
}

export function useSquareRouter() {
    const context = useContext(RouterContext);
    if (context === undefined) {
        throw new Error('useRouter must be used within a RouterProvider');
    }
    return context;
}
