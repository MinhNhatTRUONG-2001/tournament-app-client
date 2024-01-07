import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Tournament Manager</Text>
            <SignIn/>
            <SignUp/>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
