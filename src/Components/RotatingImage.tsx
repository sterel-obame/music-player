import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Image,
    StyleProp,
    ViewStyle,
    StyleSheet,
    Easing, // ✅ CORRECT import
} from 'react-native';

interface RotatingImageProps {
    source: any;
    isRotating: boolean;
    size?: number;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    speed?: number; // ms per full rotation
    style?: StyleProp<ViewStyle>;
}

const RotatingImage: React.FC<RotatingImageProps> = ({
    source,
    isRotating,
    size = 100,
    borderRadius = 50,
    borderWidth = 2,
    borderColor = '#000',
    speed = 3000,
    style,
}) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const animation = useRef<Animated.CompositeAnimation | null>(null);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const startRotation = () => {
        rotateAnim.setValue(0);
        animation.current = Animated.loop(
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: speed,
            easing: Easing.linear,
            useNativeDriver: true,
        })
        );
        animation.current.start();
    };

    const stopRotation = () => {
        animation.current?.stop();
        rotateAnim.stopAnimation();
        animation.current = null;
    };

    useEffect(() => {
        if (isRotating) {
        startRotation();
        } else {
        stopRotation();
        }
        return () => stopRotation();
    }, [isRotating, speed]);

    return (
        <Animated.View
        style={[
            {
            width: size,
            height: size,
            borderRadius,
            borderWidth,
            borderColor,
            transform: [{ rotate }],
            },
            style,
        ]}
        >
        <Image
            source={source}
            style={{ width: '100%', height: '100%', borderRadius }}
            resizeMode="cover"
        />
        </Animated.View>
    );
};

export default RotatingImage;
