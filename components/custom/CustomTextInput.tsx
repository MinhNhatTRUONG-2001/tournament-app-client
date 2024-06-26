import { StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { error, tertiary } from "../../theme/colors";

const CustomTextInput = ({ width, ...props }: any) => {
    const styles = StyleSheet.create({
        input: {
            paddingVertical: 5,
            marginHorizontal: 5,
            marginVertical: 5,
            width: width
        },
        text: {
            marginHorizontal: 5,
            color: error
        }
    });

    return (
        <>
            <TextInput
                style={styles.input}
                activeUnderlineColor={tertiary}
                {...props}
            />
        </>
    )
}

export default CustomTextInput