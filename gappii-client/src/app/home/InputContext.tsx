import { createContext, useContext, ReactNode, useState, RefObject, useRef } from 'react';

interface InputContextType {
    inputValue: string;
    setInputValue: (input: string) => void;
    inputRef: RefObject<HTMLInputElement | null>;
    focusInput: () => void;
    blurAndClearInput: () => void;
}

const InputContext = createContext<InputContextType | undefined>(undefined);

interface InputContextProviderProps {
    children: ReactNode;
}

export function InputContextProvider({ children }: InputContextProviderProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = () => {
        inputRef.current?.focus();
    }

    const blurAndClearInput = () => {
        inputRef.current?.blur();
        setInputValue('');
    }

    return (
        <InputContext.Provider value={{ inputValue, setInputValue, inputRef, focusInput, blurAndClearInput }}>
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
