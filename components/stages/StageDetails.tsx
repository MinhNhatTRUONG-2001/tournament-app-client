import { ScrollView, StyleSheet, View } from "react-native";
import { primary } from "../../theme/colors";
import { Divider } from "react-native-paper";
import { useEffect, useState } from "react";
import StageInfo from "./StageInfo";
import MatchesSe from "../matches_se/MatchesSe";

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
        }
    });

    const { token } = route.params;
    const { stageId } = route.params;
    const { stageList } = route.params;
    const { setStageList } = route.params;
    const [stageInfo, setStageInfo] = useState<any>()
    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/${stageId}/${token}`)
                .then(response => response.json())
                .then(data => setStageInfo(data))
                .catch(console.error)
        }
    }, [])

    return (
        <View style={styles.container}>
            {stageInfo &&
                <ScrollView> 
                    <StageInfo
                        navigation={navigation}
                        token={token}
                        stageList={stageList}
                        setStageList={setStageList}
                        stageInfo={stageInfo}
                        setStageInfo={setStageInfo}/>
                    <Divider />
                    {stageInfo.format_id === 1 &&
                        <MatchesSe
                            navigation={navigation}
                            token={token}
                            stageId={stageId}
                            includeThirdPlaceMatch={stageInfo.include_third_place_match}
                        />
                    }
                </ScrollView>
            }
        </View>
    )
}

export default StageDetails