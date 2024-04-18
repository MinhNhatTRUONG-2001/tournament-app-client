import { ScrollView, StyleSheet, View } from "react-native";
import { primary } from "../../theme/colors";
import { Divider, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import StageInfo from "./StageInfo";
import MatchListSE from "../matches_se/MatchListSE";
import MatchListRR from "../matches_rr/MatchListRR";
import { stageFormatsEnum } from "../../data/stageFormatsEnum";

const StageDetails = ({ route, navigation }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        item: {
            padding: 5,
            margin: 5
        },
        text: {
            alignSelf: 'center',
            paddingTop: 10
        }
    });

    const { token } = route.params
    const { stageId } = route.params
    const { stageList } = route.params
    const { setStageList } = route.params
    const [stageInfo, setStageInfo] = useState<any>()
    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/${stageId}`, {
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
                .then(data => setStageInfo(data))
                .catch(console.error)
        }
        else {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/${stageId}`)
                .then(async response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else throw new Error(await response.text())
                })
                .then(data => setStageInfo(data))
                .catch(console.error)
        }
    }, [])

    return (
        <View style={styles.container}>
            {stageInfo &&
                <ScrollView>
                    <Text variant="titleMedium" style={styles.text}>Stage information</Text>
                    <StageInfo
                        navigation={navigation}
                        token={token}
                        stageList={stageList}
                        setStageList={setStageList}
                        stageInfo={stageInfo}
                        setStageInfo={setStageInfo} />
                    <Divider />
                    <Text variant="titleMedium" style={styles.text}>Matches</Text>
                    {stageInfo.format_id === stageFormatsEnum.SINGLE_ELIMINATION &&
                        <MatchListSE
                            navigation={navigation}
                            token={token}
                            stageId={stageId}
                            includeThirdPlaceMatch={stageInfo.include_third_place_match}
                        />
                    }
                    {stageInfo.format_id === stageFormatsEnum.ROUND_ROBIN &&
                        <MatchListRR
                            navigation={navigation}
                            token={token}
                            stageId={stageId}
                            stageInfo={stageInfo}
                        />
                    }
                </ScrollView>
            }
        </View>
    )
}

export default StageDetails