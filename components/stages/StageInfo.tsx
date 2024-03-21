import { Alert, StyleSheet, View } from "react-native";
import { error, primary } from "../../theme/colors";
import { List } from "react-native-paper";
import CustomButton from "../custom/CustomButton";

const StageInfo = ({ navigation, token, stageList, setStageList, stageInfo, setStageInfo }: any) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        item: {
            padding: 5,
            margin: 5
        }
    });

    var displayedStageInfo = { ...stageInfo }
    delete displayedStageInfo["id"]
    //delete displayedStageInfo["user_id"]

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
                            description={value as string}
                            style={styles.item}
                        />
                    )
                }
            </List.Section>
            <CustomButton buttonText="Edit" onPress={() => navigation.navigate("EditStage", { navigation, token, stageList, setStageList, stageInfo, setStageInfo })} />
            <CustomButton buttonText="Delete" onPress={deleteStage} buttonColor={error} />
        </View>
    )
}

export default StageInfo