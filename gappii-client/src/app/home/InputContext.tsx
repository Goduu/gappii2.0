import { createContext, useContext, ReactNode, useState, RefObject, useRef, useEffect } from 'react';
import { experimental_useObject } from "@ai-sdk/react";
import { UnderstandSubjectActivity, UnderstandSubjectsSchema } from '@/components/quiz/types';
import { DeepPartial } from 'ai';
import { useSquareRouter } from './RouterContext';

interface InputContextType {
    inputValue: string;
    setInputValue: (input: string) => void;
    inputRef: RefObject<HTMLInputElement | null>;
    focusInput: () => void;
    blurAndClearInput: () => void;
    submit: (input: { userPrompt: string }) => void;
    isLoading: boolean;
    lesson?: { activities: UnderstandSubjectActivity[] | DeepPartial<UnderstandSubjectActivity[]> } | null;
}

const InputContext = createContext<InputContextType | undefined>(undefined);

interface InputContextProviderProps {
    children: ReactNode;
}

export function InputContextProvider({ children }: InputContextProviderProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { setRouter } = useSquareRouter()

    const { submit, isLoading, object: activities } = experimental_useObject({
        api: "/api/understandSubject",
        schema: UnderstandSubjectsSchema,
        onFinish({ object }) {
            if (object != null) {
                console.log(object)
            }
        },
        onError: () => {
            console.log("You've been rate limited, please try again later!");
        },
    });

    useEffect(() => {
        console.log(activities)
        if (activities?.activities?.[0]) {
            setRouter('add-lesson')
        }
    }, [activities, setRouter])

    const focusInput = () => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }

    const blurAndClearInput = () => {
        inputRef.current?.blur();
        setInputValue('');
    }
    return (
        <InputContext.Provider value={{
            inputValue,
            setInputValue,
            inputRef,
            focusInput,
            blurAndClearInput,
            submit,
            isLoading,
            lesson: activities?.activities ? { activities: activities.activities } : null
        }}>
            {children}
        </InputContext.Provider>
    );
}

export function useInput() {
    const context = useContext(InputContext);
    if (context === undefined) {
        throw new Error('useInput must be used within a InputContextProvider');
    }
    return context;
}
