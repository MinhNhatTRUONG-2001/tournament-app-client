import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './components/Main';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
    return (
        <NavigationContainer>
            <PaperProvider>
                <SafeAreaProvider>
                    <Main />
                </SafeAreaProvider>
            </PaperProvider>
        </NavigationContainer>
    );
}