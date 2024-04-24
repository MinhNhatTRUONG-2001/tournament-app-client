import { Platform, ScrollView, StyleSheet, View } from "react-native";
import FormikCustomTextInput from "../custom/FormikCustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary } from "../../theme/colors";
import { FieldArray, Formik } from "formik";
import { Menu, Text } from "react-native-paper";
import { useState } from "react";
import CustomTextInput from "../custom/CustomTextInput";

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
    const { stageInfo } = route.params
    const { setMatchList } = route.params
    const { matchInfo } = route.params
    const { setMatchInfo } = route.params
    const { setTableResults } = route.params
    const [showTeamsMenu, setShowTeamsMenu] = useState<boolean>(false)
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

    const initialValues = {
        'winner': matchInfo.winner,
        'team_1_score': matchInfo.team_1_score,
        'team_2_score': matchInfo.team_2_score,
        'team_1_subscores': matchInfo.team_1_subscores,
        'team_2_subscores': matchInfo.team_2_subscores,
        'team_1_other_criteria_values': matchInfo.team_1_other_criteria_values,
        'team_2_other_criteria_values': matchInfo.team_2_other_criteria_values
    }

    const updateMatchScores = (values: any) => {
        var requestBody = { ...values }
        if (requestBody["winner"] === "") {
            requestBody["winner"] = null
        }
        else if (requestBody["winner"] === "Draw") {
            requestBody["winner"] = " "
        }
        requestBody["team_1_score"] = parseFloat(requestBody["team_1_score"]) || 0
        requestBody["team_2_score"] = parseFloat(requestBody["team_2_score"]) || 0

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
                    requestBody["team_1_subscores"][i] = parseFloat(requestBody["team_1_subscores"][i]) || 0
                }
            }
            for (var i = 0; i < requestBody["team_2_subscores"].length; i++) {
                if (!requestBody["team_2_subscores"][i]) {
                    requestBody["team_2_subscores"][i] = 0
                }
                else {
                    requestBody["team_2_subscores"][i] = parseFloat(requestBody["team_2_subscores"][i]) || 0
                }
            }
        }
        //console.log(requestBody)
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/${matchInfo.id}/match_score`, {
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
            .then(data => {
                setMatchInfo(data)
                fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/all/${matchInfo.stage_id}`, {
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
                    .then(data2 => {
                        setMatchList(data2)
                        navigation.goBack()
                    })
                    .catch(console.error)
                fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/table_results/${matchInfo.stage_id}/${matchInfo.group_number}`, {
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
                    .then(data => {
                        setTableResults(data)
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
                                    <FormikCustomTextInput
                                        name="winner"
                                        label="Winner"
                                        editable={false}
                                        onPressIn={() => setShowTeamsMenu(true)}
                                    />
                                }
                            >
                                <ScrollView>
                                    {[matchInfo.team_1, matchInfo.team_2, 'Draw', ''].map(team => <Menu.Item
                                        onPress={() => {
                                            values["winner"] = team
                                            setShowTeamsMenu(false)
                                        }}
                                        title={team}
                                    />)}
                                </ScrollView>
                            </Menu>
                            <FormikCustomTextInput
                                name="team_1_score"
                                label={`${matchInfo.team_1} Score`}
                                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                value={values.team_1_score.toString()}
                                onChangeText={(text: string) => {
                                    handleChange(`team_1_score`)(text)
                                    values["team_1_score"] = parseFloat(text) || 0
                                    if (values["team_1_score"] > values["team_2_score"]) {
                                        handleChange(`winner`)(matchInfo.team_1)
                                    }
                                    else if (values["team_1_score"] < values["team_2_score"]) {
                                        handleChange(`winner`)(matchInfo.team_2)
                                    }
                                    else {
                                        handleChange(`winner`)('Draw')
                                    }
                                }}
                            />
                            <FormikCustomTextInput
                                name="team_2_score"
                                label={`${matchInfo.team_2} Score`}
                                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                value={values.team_2_score.toString()}
                                onChangeText={(text: string) => {
                                    handleChange(`team_2_score`)(text)
                                    values["team_2_score"] = parseFloat(text) || 0
                                    if (values["team_1_score"] > values["team_2_score"]) {
                                        handleChange(`winner`)(matchInfo.team_1)
                                    }
                                    else if (values["team_1_score"] < values["team_2_score"]) {
                                        handleChange(`winner`)(matchInfo.team_2)
                                    }
                                    else {
                                        handleChange(`winner`)('Draw')
                                    }
                                }}
                            />
                            {(matchInfo.team_1_subscores && matchInfo.team_2_subscores) &&
                                <>
                                    <Text style={styles.text}>{matchInfo.team_1} Subscores</Text>
                                    <FieldArray name="team_1_subscores">
                                        {() => (
                                            <ScrollView horizontal>
                                                {values.team_1_subscores?.map((value: any, index: number) => (
                                                    <CustomTextInput
                                                        key={index}
                                                        keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                        onChangeText={handleChange(`team_1_subscores.${index}`)}
                                                        value={value.toString()}
                                                        label={`Subscore ${index + 1}`}
                                                        width={110}
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
                                                    <CustomTextInput
                                                        key={index}
                                                        keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                        onChangeText={handleChange(`team_2_subscores.${index}`)}
                                                        value={value.toString()}
                                                        label={`Subscore ${index + 1}`}
                                                        width={110}
                                                    />
                                                ))}
                                            </ScrollView>
                                        )}
                                    </FieldArray>
                                </>
                            }
                            {stageInfo.other_criteria_names &&
                                <>
                                    <Text style={styles.text}>{matchInfo.team_1} other criteria values</Text>
                                    <FieldArray name="team_1_other_criteria_values">
                                        {() => (
                                            <ScrollView horizontal>
                                                {values.team_1_other_criteria_values?.map((value: any, index: number) => (
                                                    <CustomTextInput
                                                        key={index}
                                                        keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                        onChangeText={handleChange(`team_1_other_criteria_values.${index}`)}
                                                        value={value.toString()}
                                                        label={stageInfo.other_criteria_names[index]}
                                                        width={150}
                                                    />
                                                ))}
                                            </ScrollView>
                                        )}
                                    </FieldArray>
                                    <Text style={styles.text}>{matchInfo.team_2} other criteria values</Text>
                                    <FieldArray name="team_2_other_criteria_values">
                                        {() => (
                                            <ScrollView horizontal>
                                                {values.team_2_other_criteria_values?.map((value: any, index: number) => (
                                                    <CustomTextInput
                                                        key={index}
                                                        keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                        onChangeText={handleChange(`team_2_other_criteria_values.${index}`)}
                                                        value={value.toString()}
                                                        label={stageInfo.other_criteria_names[index]}
                                                        width={150}
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