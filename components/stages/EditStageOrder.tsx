import { ScrollView, StyleSheet, View } from "react-native";
import CustomButton from "../custom/CustomButton";
import { error, primary } from "../../theme/colors";
import { Text, TextInput } from "react-native-paper";
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
            alignItems: 'center'
        },
        text: {
            marginHorizontal: 5,
        },
        textInput: {
            margin: 5,
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
    const [temporaryStageList, setTemporaryStageList] = useState<any[]>(stageList)
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

    const handleInputChange = (index: number, value: string) => {
        const updatedStageList = [...temporaryStageList]
        updatedStageList[index] = { ...updatedStageList[index], stage_order: parseInt(value, 10) || 0 }
        setTemporaryStageList(updatedStageList)
    }

    const updateStageOrder = () => {
        var requestBody: any[] = []
        temporaryStageList.forEach(s => {
            requestBody.push({ id: s.id, tournament_id: s.tournament_id, name: s.name, stage_order: s.stage_order })
        });
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/order`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(requestBody),
        })
            .then(async response => {
                if (response.ok) {
                    return response.json()
                }
                else throw new Error(await response.text())
            })
            .then(() => {
                temporaryStageList.sort((a, b) => a.stage_order - b.stage_order);
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
                        <TextInput
                            style={styles.textInput}
                            key={index}
                            value={stage.stage_order.toString()}
                            inputMode="numeric"
                            onChangeText={(value) => handleInputChange(index, value)}
                        />
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