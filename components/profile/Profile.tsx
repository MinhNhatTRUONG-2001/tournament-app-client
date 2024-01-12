import { StyleSheet, View } from "react-native";
import { primary } from "../../theme/colors";
import SignIn from "./SignIn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import CustomButton from "../custom/CustomButton";
import { Text } from "react-native-paper";

const Profile = ({ navigation, token, setToken }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        text: {
            alignSelf: 'center',
            paddingTop: 10
        }
    });

    const [username, setUsername] = useState<string | undefined>(undefined)

    if (token) {
        fetch(process.env.EXPO_PUBLIC_AUTH_SERVER_URL + "/get_username_by_id", {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.isSuccess) {
                setUsername(data.username)
            }
            else {
                console.log(data.message)
            }
        })
        .catch(console.error)
    }

    const getToken = async () => {
        const result = await AsyncStorage.getItem("token")
        if (result !== null) {
            setToken(result)
        }
    }

    const handleSigningOut = async () => {
        await AsyncStorage.removeItem("token")
        setToken('')
        setUsername(undefined)
    }

    useEffect(() => {
        getToken()
    }, [])

    return (
        <View style={styles.container}>
            {token && username
            ? <>
            <Text variant="titleMedium" style={styles.text}>You are signed in as: </Text>
            <Text variant="titleLarge"  style={styles.text}>{username}</Text>
                <CustomButton buttonText="Sign out" onPress={handleSigningOut} />
            </>
            : <SignIn navigation={navigation} setToken={setToken} />}
            
        </View>
    )
}

export default Profile