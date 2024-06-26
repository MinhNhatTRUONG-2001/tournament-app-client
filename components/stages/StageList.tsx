import { StyleSheet, View } from "react-native";
import { primary, tertiary } from "../../theme/colors";
import { List, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import CustomButton from "../custom/CustomButton";

const StageList = ({ navigation, token, tournamentId }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'center',
        },
        container2: {
            flex: 1,
            backgroundColor: primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        item: {
            borderWidth: 1.5,
            borderStyle: "solid",
            borderColor: tertiary,
            borderRadius: 5,
            padding: 5,
            margin: 5
        }
    });

    const [stageList, setStageList] = useState<any[]>()
    const [stageFormats, setStageFormats] = useState<any[]>()

    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/all/${tournamentId}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(async response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else throw new Error(await response.text())
                })
                .then(data => setStageList(data))
                .catch(console.error)
        }
        else {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/all/${tournamentId}`)
                .then(async response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else throw new Error(await response.text())
                })
                .then(data => setStageList(data))
                .catch(console.error)
        }
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stage_format`)
            .then(async response => {
                if (response.ok) {
                    return response.json()
                }
                else throw new Error(await response.text())
            })
            .then((data: any) => {
                setStageFormats(data)
            })
            .catch(console.error)
    }, [token])

    return (
        <View style={styles.container}>
            {stageList ?
                <List.Section>
                    {stageList.map((s: any) => {
                        const stageFormat = stageFormats?.find(sf => sf.id === s.format_id)["name"]
                        return <List.Item
                            key={s.id}
                            title={s.name}
                            description={stageFormat}
                            right={() => <List.Icon icon="chevron-right" />}
                            onPress={() => navigation.navigate("StageDetails", { navigation, token, stageId: s.id, stageList, setStageList })}
                            style={styles.item}
                        />
                    }
                    )}
                </List.Section>
                : <View style={styles.container2}>
                    <Text>Loading...</Text>
                </View>
            }
            {(token && stageList) &&
                <>
                    {stageList.length > 1 &&
                        <CustomButton
                            buttonText="Change stage order"
                            icon="menu"
                            onPress={() => navigation.navigate("EditStageOrder", { navigation, token, tournamentId, stageList, setStageList })}
                        />
                    }
                    <CustomButton
                        buttonText="New stage"
                        icon="plus"
                        onPress={() => navigation.navigate("NewStage", { navigation, token, tournamentId, stageList, setStageList })}
                    />
                </>
            }
        </View>
    )
}

export default StageList