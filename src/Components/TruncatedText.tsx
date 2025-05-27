import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';

interface TruncatedTextProps extends TextProps {
    text: string;
    maxLength?: number;
    fontWeight?: TextStyle['fontWeight'];
    fontSize?: TextStyle['fontSize'];
    color?: TextStyle['color'];
    // Ajoutez d'autres propriétés de style au besoin
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
    text,
    maxLength = 20,
    fontWeight,
    fontSize,
    color,
    style,
    numberOfLines,
    ellipsizeMode,
    ...restProps
}) => {
    const truncatedText = text.length > maxLength 
        ? `${text.substring(0, maxLength)}...` 
        : text;

    const textStyle: StyleProp<TextStyle> = [
        {
            fontWeight,
            fontSize,
            color,
        },
        style,
    ];

    return (
        <Text
            style={textStyle}
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
            {...restProps}
        >
        {truncatedText}
        </Text>
    );
};

export default TruncatedText;