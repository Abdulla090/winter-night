import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const layout = {
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 40,
        xxxl: 64,
    },
    radius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32,
        full: 9999,
    },
    screen: {
        width,
        height,
        padding: 24, // High-end generous padding
    },
    shadows: {
        sm: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
        },
        lg: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 10,
        },
        // Colored shadows for "Beast" mode
        gold: {
            shadowColor: "#FFC000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 8,
        }
    }
};
