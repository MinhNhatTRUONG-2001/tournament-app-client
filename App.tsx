import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './components/Main';
import { PaperProvider } from 'react-native-paper';

export default function App() {
    return (
        <PaperProvider>
            <SafeAreaProvider>
                <Main />
            </SafeAreaProvider>
        </PaperProvider>
    );
}