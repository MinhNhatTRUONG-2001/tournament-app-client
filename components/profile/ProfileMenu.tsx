import { StyleSheet } from "react-native";
import { List } from "react-native-paper"
import { tertiary } from "../../theme/colors";

const ProfileMenu = ({ navigation, userInfo, setUserInfo }: any) => {
    const styles = StyleSheet.create({
        subHeader: {
            fontSize: 16,
            fontWeight: "bold",
            color: "gray"
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
    
    return <>
        <List.Section>
            <List.Subheader style={styles.subHeader}>Account</List.Subheader>
            <List.Item
                title="Change user information"
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => navigation.navigate("ChangeUserInfo", 
                    { 
                        userInfo,
                        setUserInfoCallback: (newValue: any) => setUserInfo(newValue), 
                    }
                )}
                style={styles.item}
            />
            <List.Item
                title="Change password"
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => navigation.navigate("ChangePassword")}
                style={styles.item}
            />
        </List.Section>
        <List.Section>
            <List.Subheader style={styles.subHeader}>Help & About</List.Subheader>
            <List.Item
                title="FAQ"
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => navigation.navigate("FAQ")}
                style={styles.item}
            />
            <List.Item
                title="Contact us"
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => navigation.navigate("ContactUs")}
                style={styles.item}
            />
            <List.Item
                title="About"
                right={() => <List.Icon icon="chevron-right" />}
                onPress={() => navigation.navigate("About")}
                style={styles.item}
            />
        </List.Section>
    </>
}

export default ProfileMenu