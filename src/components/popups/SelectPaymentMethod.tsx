import * as React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Dialog, { DialogContent, ScaleAnimation } from "react-native-popup-dialog";
import Icon from "react-native-vector-icons/FontAwesome";
import { Constants, globalStyles } from "../../helpers";
import { StripePaymentMethod } from "../../interfaces";

interface Props {
  show: boolean;
  close: () => void;
  onSelect: (paymentMethod: StripePaymentMethod) => void;
}

export function SelectPaymentMethod({ show, close, onSelect }: Props) {
  const methods: string[] = ["card", "bank"];

  return (
    <Dialog onTouchOutside={close} width={0.5} visible={show} dialogAnimation={new ScaleAnimation()}>
      <DialogContent>
        <FlatList
          data={methods}
          style={{ marginTop: DimensionHelper.wp("1%"), marginBottom: DimensionHelper.wp("-5%") }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                onSelect(new StripePaymentMethod({ type: item }));
                close();
              }}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Icon
                name={index == 0 ? "credit-card-alt" : "bank"}
                style={{ color: Constants.Colors.button_green, marginHorizontal: DimensionHelper.wp("4%") }}
                size={DimensionHelper.wp("6%")}
              />
              <Text
                style={{
                  fontSize: DimensionHelper.wp("4.8%"),
                  fontFamily: Constants.Fonts.RobotoRegular,
                  textAlign: "center",
                  paddingVertical: DimensionHelper.wp("2%"),
                }}
              >
                Add {item[0].toUpperCase() + item.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item: any) => item}
          ItemSeparatorComponent={() => <View style={globalStyles.cardListSeperator} />}
        />
      </DialogContent>
    </Dialog>
  );
}
