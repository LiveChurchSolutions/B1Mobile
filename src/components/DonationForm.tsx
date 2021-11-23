import React, { useState, useEffect } from "react";
import { Image, ScrollView, View, TouchableOpacity, Text, TextInput } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import DropDownPicker from "react-native-dropdown-picker";
import { ModalDatePicker } from "react-native-material-date-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import { InputBox } from ".";
import Images from "../utils/Images";
import Colors from "../utils/Colors";
import { globalStyles, ApiHelper, Userhelper } from "../helper";
import {
  FundDonationInterface,
  FundInterface,
  StripePaymentMethod,
  StripeDonationInterface,
  PersonInterface,
} from "../interfaces";
import { FundDonations } from ".";

interface Props {
  paymentMethods: StripePaymentMethod[];
  customerId: string;
}

export function DonationForm({ paymentMethods: pm, customerId }: Props) {
  const person = Userhelper.person;
  const [donationType, setDonationType] = useState<string>("");
  const [isMethodsDropdownOpen, setIsMethodsDropdownOpen] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [date, setDate] = useState(new Date());  
  const [funds, setFunds] = useState<FundInterface[]>([]);
  const [fundDonations, setFundDonations] = useState<FundDonationInterface[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<{ label: string; value: string }[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [donation, setDonation] = React.useState<StripeDonationInterface>({
    id: pm[0]?.id,
    type: pm[0]?.type,
    customerId: customerId,
    person: {
      id: person?.id || "",
      email: person?.contactInfo.email || "",
      name: person?.name.display || "",
    },
    amount: 0,
    billing_cycle_anchor: +new Date(),
    interval: {
      interval_count: 1,
      interval: "month",
    },
    funds: [],
  });

  const handleSave = () => {
    if (donation.amount && donation.amount < .5) {
      console.log("show error")
    } else {
      console.log("show preview modal")
    }
    // let method = pm.find((pm) => pm.id === selectedMethod);
    // const payload: StripeDonationInterface = {
    //   ...donation,
    //   id: selectedMethod,
    //   type: method?.type,
    //   billing_cycle_anchor: +new Date(date),
    //   notes,
    // };
    // console.log("PAYLOAD: ", payload);
  };

  const handleCancel = () => {
    setDonationType("");
  };

  const loadData = () => {
    ApiHelper.get("/funds", "GivingApi").then((data) => {
      setFunds(data);
      if (data.length) setFundDonations([{ fundId: data[0].id }]);
    });
  };

  const handleFundDonationsChange = (fd: FundDonationInterface[]) => {
    setFundDonations(fd);
    let totalAmount = 0;
    let selectedFunds: any = [];
    for (const fundDonation of fd) {
      totalAmount += fundDonation.amount || 0;
      let fund = funds.find((fund: FundInterface) => fund.id === fundDonation.fundId);
      selectedFunds.push({ id: fundDonation.fundId, amount: fundDonation.amount || 0, name: fund?.name || "" });
    }
    let d = { ...donation };
    d.amount = totalAmount;
    d.funds = selectedFunds;
    setDonation(d);
    setTotal(totalAmount);
  };

  useEffect(loadData, []);

  useEffect(() => {
    setPaymentMethods(pm.map((p) => ({ label: `${p.name} ****${p.last4}`, value: p.id })));
  }, [pm]);

  return (
    <InputBox
      title="Donate"
      headerIcon={<Image source={Images.ic_give} style={globalStyles.donationIcon} />}
      saveFunction={donationType ? handleSave : undefined}
      cancelFunction={donationType ? handleCancel : undefined}
    >
      <ScrollView nestedScrollEnabled={true}>
        <View style={globalStyles.methodContainer}>
          <TouchableOpacity
            style={{
              ...globalStyles.methodButton,
              backgroundColor: donationType === "once" ? Colors.app_color : "white",
            }}
            onPress={() => setDonationType("once")}
          >
            <Text
              style={{ ...globalStyles.methodBtnText, color: donationType === "once" ? "white" : Colors.app_color }}
            >
              Make a Donation
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...globalStyles.methodButton,
              backgroundColor: donationType === "recurring" ? Colors.app_color : "white",
            }}
            onPress={() => setDonationType("recurring")}
          >
            <Text
              style={{
                ...globalStyles.methodBtnText,
                color: donationType === "recurring" ? "white" : Colors.app_color,
              }}
            >
              Make a Recurring Donation
            </Text>
          </TouchableOpacity>
        </View>
        {donationType ? (
          <View>
            <Text style={{ ...globalStyles.searchMainText, marginTop: wp("4%") }}>Payment Method</Text>
            <View style={{ width: wp("100%"), marginBottom: wp("12%") }}>
              <DropDownPicker
                listMode="SCROLLVIEW"
                open={isMethodsDropdownOpen}
                items={paymentMethods}
                value={selectedMethod}
                setOpen={setIsMethodsDropdownOpen}
                setValue={setSelectedMethod}
                setItems={setPaymentMethods}
                containerStyle={{
                  ...globalStyles.containerStyle,
                  height: isMethodsDropdownOpen ? paymentMethods.length * wp("12%") : 0,
                }}
                style={globalStyles.dropDownMainStyle}
                labelStyle={globalStyles.labelStyle}
                listItemContainerStyle={globalStyles.itemStyle}
                dropDownContainerStyle={globalStyles.dropDownStyle}
                scrollViewProps={{ scrollEnabled: true }}
                dropDownDirection="BOTTOM"
              />
            </View>
            <Text style={globalStyles.searchMainText}>
              {donationType === "once" ? "Donation Date" : "Recurring Donation Start Date"}
            </Text>
            <View style={globalStyles.dateInput}>
              <Text style={globalStyles.dateText} numberOfLines={1}>
                {moment(date).format("DD-MM-YYYY")}
              </Text>
              <ModalDatePicker
                button={<Icon name={"calendar-o"} style={globalStyles.selectionIcon} size={wp("6%")} />}
                locale="en"
                onSelect={(date: any) => setDate(date)}
                isHideOnSelect={true}
                initialDate={new Date()}
              />
            </View>
            <Text style={globalStyles.semiTitleText}>Fund</Text>
            <FundDonations funds={funds} fundDonations={fundDonations} updatedFunction={handleFundDonationsChange} />
            {fundDonations.length > 1 && <Text style={globalStyles.totalText}>Total Donation Amount: ${total}</Text>}
            <Text style={globalStyles.semiTitleText}>Notes</Text>
            <TextInput
              multiline={true}
              numberOfLines={3}
              style={globalStyles.notesInput}
              value={notes}
              onChangeText={(text) => setNotes(text)}
            />
          </View>
        ) : null}
      </ScrollView>
    </InputBox>
  );
}
