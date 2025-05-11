import { Activity } from '@/components/quiz/types';
import { createContext, useContext, ReactNode, useState } from 'react';

interface LessonSessionContextType {
    questions: Activity[];
    setQuestions: (questions: Activity[]) => void;
    attempts: Attempt[];
    addAttempt: (attempt: Attempt) => void;
}

const LessonSessionContext = createContext<LessonSessionContextType | undefined>(undefined);

interface LessonSessionProviderProps {
    children: ReactNode;
}

export function LessonSessionProvider({ children }: LessonSessionProviderProps) {
    const [questions, setQuestions] = useState<Activity[]>([]);
    const [attempts, setAttempts] = useState<Attempt[]>([]);

    const addAttempt = (newAttempt: Attempt) => {
        setAttempts([...attempts, newAttempt]);
    }

    return (
        <LessonSessionContext.Provider value={{ questions, setQuestions, attempts, addAttempt }}>
            {children}
        </LessonSessionContext.Provider>
    );
}

export function useLessonSession() {
    const context = useContext(LessonSessionContext);
    if (context === undefined) {
        throw new Error('useLessonSession must be used within a LessonSessionProvider');
    }
    return context;
}

type Attempt = {
    activity: Activity;
    answer: boolean;
}

