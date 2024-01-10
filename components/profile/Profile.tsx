import { StyleSheet, View } from "react-native";
import { primary } from "../../theme/colors";
import SignIn from "./SignIn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import CustomButton from "../custom/CustomButton";

const Profile = ({ navigation, token, setToken }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
    });

    //const [token, setToken] = useState<string>('')

    const getToken = async () => {
        const result = await AsyncStorage.getItem("token")
        if (result !== null) {
            setToken(result)
        }
    }

    const handleSigningOut = async () => {
        await AsyncStorage.removeItem("token")
        setToken('')
    }

    useEffect(() => {
        getToken()
    }, [])

    return (
        <View style={styles.container}>
            {token
            ? <CustomButton buttonText="Sign out" onPress={handleSigningOut} />
            : <SignIn navigation={navigation} setToken={setToken} />}
            
        </View>
    )
}

export default Profile