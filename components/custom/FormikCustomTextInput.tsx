import { StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { error, tertiary } from "../../theme/colors";
import { useField } from "formik";

const FormikCustomTextInput = ({ label, name, ...props }: any) => {
    const styles = StyleSheet.create({
        input: {
            paddingVertical: 5,
            marginHorizontal: 5,
            marginVertical: 10
        },
        text: {
            marginHorizontal: 5,
            color: error
        }
    });

    const [field, meta, helpers] = useField(name);
    const showError = meta.touched && meta.error;

    return (
        <>
            <TextInput
                label={label}
                style={styles.input}
                activeUnderlineColor={tertiary}
                onChangeText={value => helpers.setValue(value)}
                onBlur={() => helpers.setTouched(true)}
                value={field.value}
                error={showError}
                {...props}
            />
            {showError && <Text style={styles.text}>{meta.error}</Text>}
        </>
    )
}

export default FormikCustomTextInput