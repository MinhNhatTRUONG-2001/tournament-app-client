import { Alert, StyleSheet, View } from "react-native";
import CustomTextInput from "../custom/CustomTextInput";
import { primary } from "../../theme/colors";
import CustomButton from "../custom/CustomButton";
import { Text } from "react-native-paper";
import { Formik } from "formik";
import * as yup from 'yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

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
        horizontalLine: {
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
            paddingVertical: 10
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

    const handleSigningIn = async (values: any) => {
        await AsyncStorage.setItem("token", "test")
        setToken("test")
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleSigningIn} validationSchema={validationSchema}>
            {
                ({ handleSubmit }) =>
                    <View style={styles.container}>
                        <Text variant="titleMedium" style={styles.text}>
                            You haven't siged in yet. Sign in here:
                        </Text>
                        <CustomTextInput name="username_or_email" label="Username or Email" inputMode="email" />
                        <CustomTextInput name="password" label="Password" secureTextEntry={true} />
                        <CustomButton buttonText="Sign in" onPress={handleSubmit} />
                        <View
                            style={styles.horizontalLine}
                        />
                        <Text variant="titleMedium" style={styles.text}>
                            Don't have an account yet? Create here:
                        </Text>
                        <CustomButton buttonText="Create account" onPress={() => navigation.navigate("SignUp")} />
                    </View>
            }
        </Formik>
    )
}

export default SignIn