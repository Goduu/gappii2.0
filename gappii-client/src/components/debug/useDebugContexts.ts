"use client"
import { useSquareRouter } from '@/app/home/RouterContext';
import { useInput } from '@/app/home/InputContext';
import { useLessonSession } from '@/app/home/LessonSessionContext';

export const useDebugContexts = () => {
    const routerContext = useSquareRouter();
    const inputContext = useInput();
    const lessonSessionContext = useLessonSession();

    return [
        {
            name: 'Router Context',
            value: routerContext
        },
        {
            name: 'Input Context',
            value: inputContext
        },
        {
            name: 'Lesson Session Context',
            value: lessonSessionContext
        }
    ];
}; 