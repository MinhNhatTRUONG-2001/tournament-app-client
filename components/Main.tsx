import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import ProfileStack from './profile/ProfileStack';
import TournamentStack from './tournaments/TournamentStack';
import { secondary, tertiary } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const BottomTab = createBottomTabNavigator()

const Main = () => {
    const navigation = useNavigation()
    const [token, setToken] = useState<string>('')
    return (
        <>
            <StatusBar style="auto" />
            <BottomTab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: secondary
                    },
                    tabBarIcon: ({ color, size }) => {
                        if (route.name === 'TournamentStack') {
                            return (
                                <Ionicons
                                    name="trophy"
                                    size={size}
                                    color={color}
                                />
                            );
                        } else if (route.name === 'ProfileStack') {
                            return (
                                <Ionicons
                                    name="person"
                                    size={size}
                                    color={color}
                                />
                            );
                        }
                    },
                    tabBarActiveTintColor: tertiary,
                })}
            >
                <BottomTab.Screen
                    name="TournamentStack"
                    children={() => <TournamentStack navigation={navigation} token={token} />}
                    options={{ title: 'Tournaments' }}
                />
                <BottomTab.Screen
                    name="ProfileStack"
                    children={() => <ProfileStack navigation={navigation} token={token} setToken={setToken} />}
                    options={{ title: 'Profile' }}
                />
            </BottomTab.Navigator>
        </>
    );
}

export default Main