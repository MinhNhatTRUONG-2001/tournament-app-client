import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { defaultColor, primary, tertiary } from "../../theme/colors";

const CustomButton = ({ buttonText, onPress }: any) => {
    const styles = StyleSheet.create({
        button: {
            margin: 10
        }
    });
    
    return (
        <Button
            mode="contained"
            buttonColor={tertiary}
            textColor={primary}
            rippleColor={defaultColor}
            style={styles.button}
            onPress={onPress}
        >
            {buttonText}
        </Button>
    )
}

export default CustomButton