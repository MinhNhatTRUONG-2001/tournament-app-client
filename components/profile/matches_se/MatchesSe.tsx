import { StyleSheet, View } from "react-native";
import { primary } from "../../../theme/colors";
import { useEffect, useState } from "react";
import { DataTable, SegmentedButtons } from "react-native-paper";

const MatchesSe = ({ navigation, token, stageId }: any) => {
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

    const [value, setValue] = useState('');
    const [items] = useState([
        {
          key: 1,
          name: 'Cupcake',
          calories: 356,
          fat: 16,
        },
        {
          key: 2,
          name: 'Eclair',
          calories: 262,
          fat: 16,
        },
        {
          key: 3,
          name: 'Frozen yogurt',
          calories: 159,
          fat: 6,
        },
        {
          key: 4,
          name: 'Gingerbread',
          calories: 305,
          fat: 3.7,
        },
       ]);

    return (
        <View style={styles.container}>
            <SegmentedButtons
                value={value}
                onValueChange={setValue}
                buttons={[
                    {
                    value: 'walk',
                    label: 'Walking',
                    },
                    {
                    value: 'train',
                    label: 'Transit',
                    },
                    { value: 'drive', label: 'Driving' },
                ]}
            />
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Dessert</DataTable.Title>
                    <DataTable.Title numeric>Calories</DataTable.Title>
                    <DataTable.Title numeric>Fat</DataTable.Title>
                </DataTable.Header>

                {items.map((item) => (
                    <DataTable.Row key={item.key}>
                    <DataTable.Cell>{item.name}</DataTable.Cell>
                    <DataTable.Cell numeric>{item.calories}</DataTable.Cell>
                    <DataTable.Cell numeric>{item.fat}</DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
        </View>
    )
}

export default MatchesSe