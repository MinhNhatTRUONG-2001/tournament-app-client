import { Alert, StyleSheet, View } from "react-native";
import CustomTextInput from "../custom/CustomTextInput";
import CustomButton from "../custom/CustomButton";
import { primary } from "../../theme/colors";
import { Formik } from "formik";
import * as yup from 'yup';
import { Text } from "react-native-paper";

const SignUp = () => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        text: {
            marginHorizontal: 5
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

    const handleSigningUp = (values: any) => {
        console.log(values)
        Alert.alert("Clicked!")
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleSigningUp} validationSchema={validationSchema}>
            {
                ({ handleSubmit }) =>
                    <View style={styles.container}>
                        <CustomTextInput name="username" label="Username" />
                        <CustomTextInput name="email" label="Email" inputMode="email" />
                        <CustomTextInput name="password" label="Password" secureTextEntry={true} />
                        <Text style={styles.text}>Password requirements:</Text>
                        <Text style={styles.text}>{"\u2022"} 8-64 characters</Text>
                        <Text style={styles.text}>{"\u2022"} At least one digit (0-9)</Text>
                        <Text style={styles.text}>{"\u2022"} At least one lowercase letter (a-z)</Text>
                        <Text style={styles.text}>{"\u2022"} At least one uppercase letter (A-Z)</Text>
                        <Text style={styles.text}>{"\u2022"} At least one special character</Text>
                        <CustomTextInput name="confirm_password" label="Confirm Password" secureTextEntry={true} />
                        <CustomButton
                            buttonText="Sign up"
                            onPress={handleSubmit}
                        />
                    </View>
            }
        </Formik>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SignUp