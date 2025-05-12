"use client"
import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, X, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebugContexts } from './useDebugContexts';

type ContextValue = unknown;

// Helper function to perform deep search
const deepSearch = (obj: ContextValue, searchTerm: string): boolean => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();

    if (obj === null || obj === undefined) return false;
    
    if (typeof obj === 'string') {
        return obj.toLowerCase().includes(term);
    }
    
    if (typeof obj === 'number' || typeof obj === 'boolean') {
        return String(obj).toLowerCase().includes(term);
    }
    
    if (Array.isArray(obj)) {
        return obj.some(item => deepSearch(item, searchTerm));
    }
    
    if (typeof obj === 'object') {
        return Object.entries(obj).some(([key, value]) => 
            key.toLowerCase().includes(term) || deepSearch(value, searchTerm)
        );
    }
    
    return false;
};

interface TreeNodeProps {
    name: string;
    value: ContextValue;
    level?: number;
    filter?: string;
}

const TreeNode = ({ name, value, level = 0, filter = '' }: TreeNodeProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const paddingLeft = level * 20;

    const isObject = typeof value === 'object' && value !== null;
    const hasChildren = isObject && Object.keys(value as object).length > 0;
    
    // Use deep search for visibility check
    const isVisible = !filter || 
        name.toLowerCase().includes(filter.toLowerCase()) ||
        deepSearch(value, filter);

    if (!isVisible) return null;

    const toggleExpand = () => {
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
    };

    const renderValue = () => {
        if (value === null) return <span className="text-gray-500">null</span>;
        if (value === undefined) return <span className="text-gray-500">undefined</span>;
        if (typeof value === 'string') return <span className="text-green-500">&ldquo;{value}&rdquo;</span>;
        if (typeof value === 'number') return <span className="text-blue-500">{value}</span>;
        if (typeof value === 'boolean') return <span className="text-purple-500">{value.toString()}</span>;
        if (Array.isArray(value)) return <span className="text-orange-500">[{value.length} items]</span>;
        if (isObject) return <span className="text-gray-400">{'{'}{Object.keys(value as object).length} keys{'}'}</span>;
        return <span className="text-gray-400">{String(value)}</span>;
    };

    return (
        <div style={{ paddingLeft: `${paddingLeft}px` }} className="select-none">
            <div
                className={cn(
                    "flex items-center gap-1 py-1 hover:bg-gray-800/50 rounded px-1",
                    hasChildren && "cursor-pointer"
                )}
                onClick={toggleExpand}
            >
                {hasChildren && (
                    <span className="w-4 h-4 flex items-center justify-center">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                )}
                {!hasChildren && <span className="w-4" />}
                <span className="text-yellow-500">{name}:</span>
                {!hasChildren && renderValue()}
            </div>
            {isExpanded && hasChildren && (
                <div>
                    {Object.entries(value as object).map(([key, val]) => (
                        <TreeNode
                            key={key}
                            name={key}
                            value={val}
                            level={level + 1}
                            filter={filter}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const DebugBox = () => {
    const contexts = useDebugContexts();
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('');

    const toggleDebugBox = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    const filteredContexts = useMemo(() => {
        if (!filter) return contexts;
        return contexts.filter(context => 
            context.name.toLowerCase().includes(filter.toLowerCase()) ||
            deepSearch(context.value, filter)
        );
    }, [contexts, filter]);

    return (
        <>
            {/* Floating debug button */}
            <motion.button
                className="fixed bottom-4 right-4 z-50 bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
                onClick={toggleDebugBox}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Bug className="w-6 h-6 text-yellow-500" />
            </motion.button>

            {/* Debug box */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-20 right-4 z-50 w-96 h-96 bg-gray-900 rounded-lg shadow-xl border border-gray-700 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-yellow-500">Debug Box</h3>
                            <button
                                onClick={toggleDebugBox}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-2 border-b border-gray-700">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Filter..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="w-full bg-gray-800 text-white pl-8 pr-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto p-2 font-mono text-sm">
                            {filteredContexts.map((context) => (
                                <div key={context.name} className="mb-2">
                                    <div className="text-lg font-semibold text-yellow-500 mb-1">
                                        {context.name}
                                    </div>
                                    <TreeNode
                                        name="value"
                                        value={context.value}
                                        filter={filter}
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}; 