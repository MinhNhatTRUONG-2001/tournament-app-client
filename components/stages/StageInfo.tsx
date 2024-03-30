import { Alert, StyleSheet, View } from "react-native";
import { error, primary } from "../../theme/colors";
import { Text } from "react-native-paper";
import CustomButton from "../custom/CustomButton";
import { useEffect, useState } from "react";
import { getTimezone } from "../../data/getTimezone";

const StageInfo = ({ navigation, token, stageList, setStageList, stageInfo, setStageInfo }: any) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        item: {
            marginHorizontal: 5
        },
        keyText: {
            marginHorizontal: 10,
            marginVertical: 5,
            fontSize: 16,
            fontWeight: 'bold'
        },
        valueText: {
            fontWeight: 'normal'
        },
        errorText: {
            alignSelf: 'center',
            paddingBottom: 5,
            color: error
        }
    });

    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')
    const [stageFormat, setStageFormat] = useState<string>()

    const deleteStage = () => {
        Alert.prompt(
            "Confirm deletion",
            `Do you want to delete this stage and connected matches? Type "${stageInfo.name}" to confirm.`,
            (input: string) => {
                if (input === stageInfo.name) {
                    fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/${stageInfo.id}/${token}`, { method: 'DELETE' })
                    .then(() => {
                        setStageList(stageList.filter((t: any) => t.id !== stageInfo.id))
                        navigation.goBack()
                    })
                    .catch((error: any) => {
                        setServerErrorMessage(error.message)
                    })
                }
                else {
                    Alert.alert("Error", "The input is not correct")
                }
            })
    }

    useEffect(() => {
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stage_format/${stageInfo.format_id}`)
            .then(response => response.json())
            .then((data) => {
                setStageFormat(data.name)
            })
            .catch(console.error)
    }, [])

    return (
        <View style={styles.container}>
            {stageInfo &&
                <>
                    <Text style={styles.keyText}>Name:
                        <Text style={styles.valueText}> {stageInfo.name}</Text>
                    </Text>
                    <Text style={styles.keyText}>Format:
                        <Text style={styles.valueText}> {stageFormat}</Text>
                    </Text>
                    <Text style={styles.keyText}>Start date:
                        <Text style={styles.valueText}> {stageInfo.start_date ? `${new Date(stageInfo.start_date).toLocaleString()} (UTC${getTimezone(new Date(stageInfo.start_date))})` : 'N/A'}</Text>
                    </Text>
                    <Text style={styles.keyText}>End date:
                        <Text style={styles.valueText}> {stageInfo.end_date ? `${new Date(stageInfo.end_date).toLocaleString()} (UTC${getTimezone(new Date(stageInfo.end_date))})` : 'N/A'}</Text>
                    </Text>
                    <Text style={styles.keyText}>Places:
                        <Text style={styles.valueText}> {stageInfo.places.length > 0 ? stageInfo.places.join('; ') : 'N/A'}</Text>
                    </Text>
                    <Text style={styles.keyText}>Description:
                        <Text style={styles.valueText}> {stageInfo.description ? stageInfo.description : 'N/A'}</Text>
                    </Text>
                </>
            }
            <CustomButton buttonText="Edit" onPress={() => navigation.navigate("EditStage", { navigation, token, stageList, setStageList, stageInfo, setStageInfo })} />
            <CustomButton buttonText="Delete" onPress={deleteStage} buttonColor={error} />
            <Text style={styles.errorText}>{serverErrorMessage}</Text>
        </View>
    )
}

export default StageInfo