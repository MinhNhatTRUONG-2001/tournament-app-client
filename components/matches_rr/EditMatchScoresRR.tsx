import { Platform, ScrollView, StyleSheet, View } from "react-native";
import CustomTextInput from "../custom/CustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary } from "../../theme/colors";
import { FieldArray, Formik } from "formik";
import { Menu, Text, TextInput } from "react-native-paper";
import { useState } from "react";

const EditMatchScoresRR = ({ route, navigation }: any) => {
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
            marginHorizontal: 5,
            marginTop: 5
        },
        subText: {
            marginHorizontal: 10,
            marginVertical: 5,
            fontSize: 12,
            fontStyle: 'italic'
        },
        errorText: {
            alignSelf: 'center',
            paddingBottom: 5,
            color: error
        },
        datePicker: {
            alignItems: 'center'
        },
        multilineTextInput: {
            minHeight: 150,
            textAlignVertical: 'top',
            marginHorizontal: 5,
            marginBottom: 10
        }
    });

    const { token } = route.params
    const { matchList } = route.params
    const { setMatchList } = route.params
    const { matchInfo } = route.params
    const { setMatchInfo } = route.params
    const [showTeamsMenu, setShowTeamsMenu] = useState<boolean>(false)
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

    const initialValues = {
        'winner': matchInfo.winner,
        'team_1_score': matchInfo.team_1_score,
        'team_2_score': matchInfo.team_2_score,
        'team_1_subscores': matchInfo.team_1_subscores,
        'team_2_subscores': matchInfo.team_2_subscores,
    }

    const updateMatchScores = (values: any) => {
        var requestBody = { ...values }
        if (requestBody["winner"] === "") {
            requestBody["winner"] = null
        }
        requestBody["team_1_score"] = parseInt(requestBody["team_1_score"]) || 0
        requestBody["team_2_score"] = parseInt(requestBody["team_2_score"]) || 0

        if (requestBody["team_1_subscores"].length === 0 && requestBody["team_2_subscores"].length === 0) {
            requestBody["team_1_subscores"] = null
            requestBody["team_2_subscores"] = null
        }
        else {
            for (var i = 0; i < requestBody["team_1_subscores"].length; i++) {
                if (!requestBody["team_1_subscores"][i]) {
                    requestBody["team_1_subscores"][i] = 0
                }
                else {
                    requestBody["team_1_subscores"][i] = parseInt(requestBody["team_1_subscores"][i]) || 0
                }
            }
            for (var i = 0; i < requestBody["team_2_subscores"].length; i++) {
                if (!requestBody["team_2_subscores"][i]) {
                    requestBody["team_2_subscores"][i] = 0
                }
                else {
                    requestBody["team_2_subscores"][i] = parseInt(requestBody["team_2_subscores"][i]) || 0
                }
            }
        }
        //console.log(requestBody)
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/${matchInfo.id}/match_score/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(async response => {
                if (response.ok) {
                    return response.json()
                }
                else throw new Error(await response.text())
            })
            .then(data => {
                setMatchInfo(data)
                fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/all/${matchInfo.stage_id}/${token}`)
                    .then(async response => {
                        if (response.ok) {
                            return response.json()
                        }
                        else throw new Error(await response.text())
                    })
                    .then(data2 => {
                        setMatchList(data2)
                        navigation.goBack()
                    })
                    .catch(console.error)
            })
            .catch((error: any) => {
                setServerErrorMessage(error.message)
            })
    }

    return (
        <Formik initialValues={initialValues} onSubmit={updateMatchScores}>
            {
                ({ handleSubmit, values, handleChange }) =>
                    <View style={styles.container}>
                        <ScrollView>
                            <Menu
                                visible={showTeamsMenu}
                                onDismiss={() => setShowTeamsMenu(false)}
                                anchor={
                                    <CustomTextInput
                                        name="winner"
                                        label="Winner"
                                        editable={false}
                                        onPressIn={() => setShowTeamsMenu(true)}
                                    />
                                }
                            >
                                <ScrollView>
                                    {[matchInfo.team_1, matchInfo.team_2].map(team => <Menu.Item
                                        onPress={() => {
                                            values["winner"] = team
                                            setShowTeamsMenu(false)
                                        }}
                                        title={team}
                                    />)}
                                </ScrollView>
                            </Menu>
                            <CustomTextInput
                                name="team_1_score"
                                label={`${matchInfo.team_1} Score`}
                                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                value={values.team_1_score.toString()}
                            />
                            <CustomTextInput
                                name="team_2_score"
                                label={`${matchInfo.team_2} Score`}
                                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                value={values.team_2_score.toString()}
                            />
                            {matchInfo.best_of > 0 &&
                                <>
                                    <Text style={styles.text}>{matchInfo.team_1} Subscores</Text>
                                    <FieldArray name="team_1_subscores">
                                        {() => (
                                            <ScrollView horizontal>
                                                {values.team_1_subscores?.map((value: any, index: number) => (
                                                    <TextInput
                                                        key={index}
                                                        style={styles.text}
                                                        keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                        onChangeText={handleChange(`team_1_subscores.${index}`)}
                                                        value={value.toString()}
                                                        placeholder={`Subscore ${index + 1}`}
                                                    />
                                                ))}
                                            </ScrollView>
                                        )}
                                    </FieldArray>
                                    <Text style={styles.text}>{matchInfo.team_2} Subscores</Text>
                                    <FieldArray name="team_2_subscores">
                                        {() => (
                                            <ScrollView horizontal>
                                                {values.team_2_subscores?.map((value: any, index: number) => (
                                                    <TextInput
                                                        key={index}
                                                        style={styles.text}
                                                        keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                        onChangeText={handleChange(`team_2_subscores.${index}`)}
                                                        value={value.toString()}
                                                        placeholder={`Subscore ${index + 1}`}
                                                    />
                                                ))}
                                            </ScrollView>
                                        )}
                                    </FieldArray>
                                </>
                            }
                            <CustomButton buttonText="Update" onPress={handleSubmit} />
                            <Text style={styles.errorText}>{serverErrorMessage}</Text>
                        </ScrollView>
                    </View>
            }
        </Formik>
    )
}

export default EditMatchScoresRR