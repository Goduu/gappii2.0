"use client"
import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { Route } from './menuOptionsList';

// Custom event for router changes
export const ROUTER_CHANGE_EVENT = 'router-change';

interface RouterContextType {
    router: Route;
    changeRouter: (router: Route) => void;
    isLessonRoute: boolean;
    isNewRoute: boolean;
    isInSquareRoute: boolean;
    onRouterChange: (callback: (newRoute: Route, oldRoute: Route) => void) => () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
    children: ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
    const [router, setRouter] = useState<Route>('home');
    const isLessonRoute = router.includes("session")
    const isNewRoute = router === "new"
    const isInSquareRoute = router === "inSquare"

    const handleChangeRouter = useCallback((newRouter: Route) => {
        const oldRouter = router;
        setRouter(newRouter);
        
        // Dispatch custom event with both old and new route
        const event = new CustomEvent(ROUTER_CHANGE_EVENT, {
            detail: { newRoute: newRouter, oldRoute: oldRouter }
        });
        window.dispatchEvent(event);
    }, [router]);

    // Custom hook to watch router changes
    const onRouterChange = useCallback((callback: (newRoute: Route, oldRoute: Route) => void) => {
        const handleRouterChange = (event: Event) => {
            const { newRoute, oldRoute } = (event as CustomEvent).detail;
            callback(newRoute, oldRoute);
        };

        window.addEventListener(ROUTER_CHANGE_EVENT, handleRouterChange);
        
        // Return cleanup function
        return () => {
            window.removeEventListener(ROUTER_CHANGE_EVENT, handleRouterChange);
        };
    }, []);

    return (
        <RouterContext.Provider value={{ 
            router, 
            isLessonRoute, 
            isNewRoute, 
            isInSquareRoute, 
            changeRouter: handleChangeRouter,
            onRouterChange 
        }}>
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

// Custom hook to watch router changes
export function useRouterChange(callback: (newRoute: Route, oldRoute: Route) => void) {
    const { onRouterChange } = useSquareRouter();

    useEffect(() => {
        return onRouterChange(callback);
    }, [callback, onRouterChange]);
}

