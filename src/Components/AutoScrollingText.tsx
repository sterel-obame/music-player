import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Text, View, StyleSheet, Easing, TextProps, LayoutChangeEvent } from 'react-native';

interface MarqueeHeaderProps extends TextProps {
    children: ReactNode;
    fontSize?: number;
    color?: string;
    duration?: number;
}

const AutoScrollingText: React.FC<MarqueeHeaderProps> = ({
    children,
    fontSize = 16,
    color = 'white',
    duration = 10000,
    style,
    ...textProps
}) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const [textWidth, setTextWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const needsScrolling = textWidth > containerWidth;

    useEffect(() => {
        if (!needsScrolling) return;

        const animation = Animated.loop(
            Animated.sequence([
                // Défilement complet (droite à gauche)
                Animated.timing(translateX, {
                    toValue: -textWidth,
                    duration: duration,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                // Pause avant de recommencer
                Animated.delay(1000),
                // Reset position
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();
        return () => animation.stop();
    }, [textWidth, containerWidth, duration, needsScrolling]);

    const handleTextLayout = (e: LayoutChangeEvent) => {
        setTextWidth(e.nativeEvent.layout.width);
    };

    const handleContainerLayout = (e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
    };

    return (
        <View 
            style={[styles.container, style]} 
            onLayout={handleContainerLayout}
        >
            <Animated.View 
                style={[
                    styles.textContainer,
                    needsScrolling && { transform: [{ translateX }] }
                ]}
            >
                <Text 
                    {...textProps}
                    style={[
                        styles.text,
                        { fontSize, color },
                        style
                    ]}
                    onLayout={handleTextLayout}
                    numberOfLines={1}
                    ellipsizeMode="clip"
                >
                    {children}
                </Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        width: '100%',
    },
    textContainer: {
        flexDirection: 'row',
    },
    text: {
        flexShrink: 0,
        width: '100%',
    },
});

export default AutoScrollingText;