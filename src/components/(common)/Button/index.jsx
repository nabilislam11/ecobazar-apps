// src/components/Button.jsx
import { Pressable, Text } from 'react-native';

// Button Container (Background, Border, Padding) Classes
const containerSizes = {
    sm: 'px-6 py-2.5',
    md: 'px-8 py-3.5',
    lg: 'px-10 py-4',
};

const containerVariants = {
    fill: 'bg-success active:bg-success-dark', // hover: এর বদলে active:
    border: 'bg-white border-2 border-success active:border-success-dark',
    ghost: 'bg-success/10 active:bg-success/20',
};

// Text (Font Size, Text Color) Classes
const textSizes = {
    sm: 'text-xs',   // text-tiny এর স্ট্যান্ডার্ড 
    md: 'text-sm',   // text-small এর স্ট্যান্ডার্ড
    lg: 'text-base', // text-medium এর স্ট্যান্ডার্ড
};

const textVariants = {
    fill: 'text-white',
    border: 'text-success', // active text color nativewind e directly text-e apply kora kothin, tai base color deya holo
    ghost: 'text-success',
};

export default function Button({
    size = 'md',
    variant = 'fill',
    className = '',     // Container-এর এক্সট্রা ক্লাসের জন্য
    textClassName = '', // Text-এর এক্সট্রা ক্লাসের জন্য
    children,
    disabled,
    ...props
}) {
    return (
        <Pressable
            disabled={disabled}
            className={`flex-row items-center justify-center gap-2 rounded-full transition-colors 
        ${containerSizes[size]} 
        ${containerVariants[variant]} 
        ${disabled ? 'opacity-50' : ''} 
        ${className}`}
            {...props}
        >
            {/* যদি চিলড্রেন সাধারণ টেক্সট হয়, তাহলে Text দিয়ে র‍্যাপ করবে, অন্যথায় আইকন থাকলে সরাসরি রেন্ডার করবে */}
            {typeof children === 'string' ? (
                <Text
                    className={`font-semibold text-center ${textSizes[size]} ${textVariants[variant]} ${textClassName}`}
                >
                    {children}
                </Text>
            ) : (
                children
            )}
        </Pressable>
    );
}