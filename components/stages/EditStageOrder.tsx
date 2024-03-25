import { ScrollView, StyleSheet, View } from "react-native";
import CustomTextInput from "../custom/CustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary } from "../../theme/colors";
import { Text } from "react-native-paper";
import { useState } from "react";

const EditStageOrder = ({ route, navigation }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        container2: {
            backgroundColor: primary,
            flexDirection: 'row',
        },
        text: {
            marginHorizontal: 5
        },
        errorText: {
            alignSelf: 'center',
            paddingBottom: 5,
            color: error
        },
        datePicker: {
            alignItems: 'center'
        }
    });

    const { token } = route.params
    const { stageList } = route.params
    const { setStageList } = route.params
    var temporaryStageList: any[] = stageList
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

    const handleInputChange = (event: any) => {
        temporaryStageList[event.target.name].stage_order = event.target.value
    }

    const updateStageOrder = () => {
        var requestBody: any[] = []
        temporaryStageList.forEach(s => {
            requestBody.push({ id: s.id, tournament_id: s.tournament_id, stage_order: s.stage_order })
        });
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/order/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => response.json())
        .then(() => {
            setStageList(temporaryStageList)
            navigation.goBack()
        })
        .catch((error: any) => {
            setServerErrorMessage(error.message)
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {temporaryStageList.map((stage, index) => 
                    <View style={styles.container2}>
                        <CustomTextInput
                            name={index}
                            inputMode="numeric"
                            onChangeText={handleInputChange}/>
                        <Text>{stage.name}</Text>
                    </View>
                )}
                <CustomButton buttonText="Update" onPress={updateStageOrder} />
                <Text style={styles.errorText}>{serverErrorMessage}</Text>
            </ScrollView>
        </View>
    )
}

export default EditStageOrder