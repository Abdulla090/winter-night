import React from 'react';
import { View, TouchableOpacity, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Compass, Trophy, User } from 'lucide-react-native';

export const FloatingNavBar = ({ activeTab = 'home' }) => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();

    const navTo = (screen) => { // Simple navigation logic
        if (activeTab === screen) return;
        if (screen === 'home') navigation.navigate('Home');
        if (screen === 'explore') navigation.navigate('AllGames');
        // Add other screens here
    };

    // Render helper
    const renderItem = (tabName, IconComponent) => {
        const isActive = activeTab === tabName;

        return (
            <TouchableOpacity
                key={tabName}
                style={styles.item}
                onPress={() => navTo(tabName)}
                activeOpacity={0.8}
            >
                {isActive ? (
                    <View style={styles.activeWrapper}>
                        <LinearGradient
                            colors={['#D900FF', '#D900FF']}
                            style={styles.activeCircle}
                        >
                            <IconComponent size={24} color="#FFF" />
                        </LinearGradient>
                    </View>
                ) : (
                    <IconComponent size={24} color="#6B5A8A" />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.bar, { width: Math.min(width * 0.9, 400) }]}>
                {renderItem('profile', User)}
                {renderItem('leaderboard', Trophy)}
                {renderItem('explore', Compass)}
                {renderItem('home', Home)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999, // Ensure it's on top
    },
    bar: {
        flexDirection: 'row',
        backgroundColor: '#150824',
        borderRadius: 40,
        height: 70, // Fixed height to ensure visibility
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 25,
        justifyContent: 'space-between', // Distribute items evenly
        alignItems: 'center',
    },
    item: {
        flex: 1, // Take equal space
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    activeWrapper: {
        marginBottom: 30, // Pop out effect
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#0F0518',
        shadowColor: '#D900FF',
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 10,
    }
});
