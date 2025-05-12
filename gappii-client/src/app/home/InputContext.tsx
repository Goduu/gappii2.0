"use client"
import { createContext, useContext, ReactNode, useState, RefObject, useRef, useEffect } from 'react';
import { experimental_useObject } from "@ai-sdk/react";
import { NewSubjectActivity, UnderstandSubjectsSchema } from '@/components/lesson-session/types';
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
    newSubjectLesson?: { activities: NewSubjectActivity[] | DeepPartial<NewSubjectActivity[]> } | null;
}

const InputContext = createContext<InputContextType | undefined>(undefined);

interface InputContextProviderProps {
    children: ReactNode;
}

export function InputContextProvider({ children }: InputContextProviderProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { changeRouter: setRouter, isNewRoute } = useSquareRouter()

    const { submit, isLoading, object: activities } = experimental_useObject({
        api: "/api/understandSubject",
        schema: UnderstandSubjectsSchema,
        onFinish({ object }) {
            if (object != null) {
                console.info(object)
            }
        },
        onError: (e) => {
            console.info("Error on InputContextProvider: ", e);
        },
    });

    useEffect(() => {
        if (activities?.activities?.[0] && isNewRoute) {
            setRouter('session/new-subject')
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
            newSubjectLesson: activities?.activities ? { activities: activities.activities } : null
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
