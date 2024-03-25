import { Alert, StyleSheet, View } from "react-native";
import { error, primary } from "../../theme/colors";
import { List, Text } from "react-native-paper";
import CustomButton from "../custom/CustomButton";
import { useState } from "react";

const StageInfo = ({ navigation, token, stageList, setStageList, stageInfo, setStageInfo }: any) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        item: {
            marginHorizontal: 5
        },
        errorText: {
            alignSelf: 'center',
            paddingBottom: 5,
            color: error
        }
    });

    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')
    
    var displayedStageInfo = { ...stageInfo }
    delete displayedStageInfo["id"]
    delete displayedStageInfo["tournament_id"]
    delete displayedStageInfo["number_of_teams_per_group"]
    delete displayedStageInfo["number_of_groups"]
    delete displayedStageInfo["stage_order"]
    delete displayedStageInfo["number_of_legs_per_round"]
    delete displayedStageInfo["best_of_per_round"]
    delete displayedStageInfo["include_third_place_match"]
    delete displayedStageInfo["third_place_match_number_of_legs"]
    delete displayedStageInfo["third_place_match_best_of"]

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

    return (
        <View style={styles.container}>
            <List.Section>
                {
                    Object.entries(displayedStageInfo).map(([key, value]) => 
                        <List.Item
                            key={key}
                            title={key}
                            description={value ? value as string : 'N/A'}
                            style={styles.item}
                        />
                    )
                }
            </List.Section>
            <CustomButton buttonText="Edit" onPress={() => navigation.navigate("EditStage", { navigation, token, stageList, setStageList, stageInfo, setStageInfo })} />
            <CustomButton buttonText="Delete" onPress={deleteStage} buttonColor={error} />
            <Text style={styles.errorText}>{serverErrorMessage}</Text>
        </View>
    )
}

export default StageInfo