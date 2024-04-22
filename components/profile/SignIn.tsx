import { StyleSheet, View } from "react-native";
import FormikCustomTextInput from "../custom/FormikCustomTextInput";
import { error, primary, tertiary } from "../../theme/colors";
import CustomButton from "../custom/CustomButton";
import { Checkbox, Divider, Text } from "react-native-paper";
import { Formik } from "formik";
import * as yup from 'yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const SignIn = ({ navigation, setToken }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        text: {
            alignSelf: 'center',
            paddingTop: 10,
            paddingBottom: 5
        },
        pressableText: {
            alignSelf: 'center',
            paddingBottom: 15,
            color: tertiary
        },
        errorText: {
            alignSelf: 'center',
            paddingBottom: 5,
            color: error
        }
    });

    const initialValues = {
        'username_or_email': '',
        'password': ''
    }

    const validationSchema = yup.object().shape({
        username_or_email: yup
            .string()
            .required("Username or Email is required"),
        password: yup
            .string()
            .required("Password is required"),
    })

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [disabledSubmitButton, setDisabledSubmitButton] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleSigningIn = async (values: any) => {
        setDisabledSubmitButton(true)
        fetch(process.env.EXPO_PUBLIC_AUTH_SERVER_URL + "/sign_in", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then(response => response.json())
            .then(async data => {
                if (data.isSuccess) {
                    setErrorMessage('')
                    await AsyncStorage.setItem("token", data.token)
                    setToken(data.token)
                    navigation.navigate('TournamentList')
                }
                else {
                    setErrorMessage(data.message)
                }
            })
            .catch(console.error)
        setDisabledSubmitButton(false)
    }

    return (
        <View style={styles.container}>
            <Formik initialValues={initialValues} onSubmit={handleSigningIn} validationSchema={validationSchema}>
                {
                    ({ handleSubmit }) =>
                        <>
                            <Text variant="titleMedium" style={styles.text}>
                                You haven't signed in yet. Sign in here:
                            </Text>
                            <FormikCustomTextInput name="username_or_email" label="Username or Email" inputMode="email" />
                            <FormikCustomTextInput name="password" label="Password" secureTextEntry={!showPassword} />
                            <Checkbox.Item
                                label="Show password"
                                labelStyle={{ textAlign: 'left' }}
                                status={showPassword ? 'checked' : 'unchecked'}
                                onPress={() => { setShowPassword(!showPassword) }}
                                color={tertiary}
                                position="leading"
                                mode="android"
                            />
                            <CustomButton buttonText="Sign in" onPress={handleSubmit} disabled={disabledSubmitButton} />
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </>
                }
            </Formik>
            <Text variant="titleMedium" style={styles.pressableText} onPress={() => navigation.navigate("ForgotPassword")}>
                Forgot your password? Press here
            </Text>
            <Divider />
            <Text variant="titleMedium" style={styles.text}>
                Don't have an account yet? Create here:
            </Text>
            <CustomButton buttonText="Create account" onPress={() => navigation.navigate("SignUp")} />
        </View>
    )
}

export default SignIn