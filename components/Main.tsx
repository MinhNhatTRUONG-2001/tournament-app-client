import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import ProfileStack from './profile/ProfileStack';
import TournamentStack from './tournaments/TournamentStack';
import { secondary, tertiary } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const BottomTab = createBottomTabNavigator()

const Main = () => {
    const [token, setToken] = useState<string>('')
    return (
        <>
            <StatusBar style="auto" />
            <NavigationContainer>
                <BottomTab.Navigator
                    screenOptions={({route}) => ({
                        headerShown: false,
                        tabBarStyle: {
                            backgroundColor: secondary
                        },
                        tabBarIcon: ({ color, size }) => {
                            if (route.name === 'Tournaments') {
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
                    <BottomTab.Screen name="Tournaments" component={TournamentStack} />
                    <BottomTab.Screen
                        name="ProfileStack"
                        children={() => <ProfileStack token={token} setToken={setToken}/>}
                        options={{ title: 'Profile' }}
                    />
                </BottomTab.Navigator>
            </NavigationContainer>
        </>
    );
}

export default Main