import { StyleSheet, Text, View } from "react-native";
import React from "react";

const RenderLogs = ({ item }) => {
  return (
    <View>
      <Text>
        Updates for <Text style={{ fontWeight: "bold" }}>{item?.date}</Text>
      </Text>
      {item?.data.length > 0 ? (
        item.data.map((item, index) => (
          <View key={index}>
            <Text>
              {item.code} : {item.price}
            </Text>
          </View>
        ))
      ) : (
        <Text>No data.</Text>
      )}
    </View>
  );
};

export default RenderLogs;

const styles = StyleSheet.create({});
