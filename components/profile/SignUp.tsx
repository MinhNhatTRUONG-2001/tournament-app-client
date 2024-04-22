import { Alert, ScrollView, StyleSheet, View } from "react-native";
import FormikCustomTextInput from "../custom/FormikCustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary, tertiary } from "../../theme/colors";
import { Formik } from "formik";
import * as yup from 'yup';
import { Checkbox, Text } from "react-native-paper";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = ({ navigation, setToken }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        text: {
            marginHorizontal: 5
        },
        errorText: {
            alignSelf: 'center',
            paddingBottom: 5,
            color: error
        }
    });

    const initialValues = {
        'username': '',
        'email': '',
        'password': '',
        'confirm_password': ''
    }

    const validationSchema = yup.object().shape({
        username: yup
            .string()
            .max(50, "The maximum characters is 50")
            .required("Username is required"),
        email: yup
            .string()
            .email("Email address is invalid")
            .max(50, "The maximum characters is 50")
            .required("Email is required"),
        password: yup
            .string()
            .min(8, "Password must have at least 8 characters")
            .max(64, "Password must have at most 64 characters")
            .matches(/[0-9]/, "At least one digit is required")
            .matches(/[a-z]/, "At least one lowercase letter is required")
            .matches(/[A-Z]/, "At least one uppercase letter is required")
            .matches(/\W|_/, "At least one special character is required")
            .required("Password is required"),
        confirm_password: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords do not match")
    })

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [disabledSubmitButton, setDisabledSubmitButton] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleSigningUp = (values: any) => {
        setDisabledSubmitButton(true)
        fetch(process.env.EXPO_PUBLIC_AUTH_SERVER_URL + "/sign_up", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then(response => response.json())
            .then(data => {
                if (data.isSuccess) {
                    Alert.alert(data.message)
                    const signInValues = {
                        "username_or_email": values["email"],
                        "password": values["password"]
                    }
                    fetch(process.env.EXPO_PUBLIC_AUTH_SERVER_URL + "/sign_in", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(signInValues),
                    })
                        .then(async response => {
                            if (response.ok) {
                                return response.json()
                            }
                            else throw new Error(await response.text())
                        })
                        .then(async data => {
                            if (data.isSuccess) {
                                setErrorMessage('')
                                await AsyncStorage.setItem("token", data.token)
                                setToken(data.token)
                                navigation.goBack()
                                navigation.navigate("TournamentList")
                            }
                            else {
                                setErrorMessage(data.message)
                            }
                        })
                        .catch(console.error)
                }
                else {
                    setErrorMessage(data.message)
                }
            })
            .catch(console.error)
        setDisabledSubmitButton(false)
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleSigningUp} validationSchema={validationSchema}>
            {
                ({ handleSubmit }) =>
                    <View style={styles.container}>
                        <ScrollView>
                            <FormikCustomTextInput name="username" label="Username" />
                            <FormikCustomTextInput name="email" label="Email" inputMode="email" />
                            <FormikCustomTextInput name="password" label="Password" secureTextEntry={!showPassword} />
                            <Text style={styles.text}>Password requirements:</Text>
                            <Text style={styles.text}>{"\u2022"} 8-64 characters</Text>
                            <Text style={styles.text}>{"\u2022"} At least one digit (0-9)</Text>
                            <Text style={styles.text}>{"\u2022"} At least one lowercase letter (a-z)</Text>
                            <Text style={styles.text}>{"\u2022"} At least one uppercase letter (A-Z)</Text>
                            <Text style={styles.text}>{"\u2022"} At least one special character</Text>
                            <Text style={styles.text}>* Note: Do not add leading and trailing whitespaces. They will be removed after submitting.</Text>
                            <FormikCustomTextInput name="confirm_password" label="Confirm Password" secureTextEntry={!showPassword} />
                            <Checkbox.Item
                                label="Show password"
                                labelStyle={{ textAlign: 'left' }}
                                status={showPassword ? 'checked' : 'unchecked'}
                                onPress={() => { setShowPassword(!showPassword) }}
                                color={tertiary}
                                position="leading"
                                mode="android"
                            />
                            <CustomButton buttonText="Sign up" onPress={handleSubmit} disabled={disabledSubmitButton} />
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </ScrollView>
                    </View>
            }
        </Formik>
    )
}

export default SignUp