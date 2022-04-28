import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./styles";
import RenderLogs from "../../components/RenderLogs";

var myVar;

const StockScreen = () => {
  const [data, setData] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [summaryData, setSummaryData] = useState([]);

  const formatData = (data) => {
    var temp = summaryData;
    var arrData = [];
    if (temp.length < 1) {
      data.forEach((element) => {
        arrData.push({
          code: element.code,
          price: [element.price],
        });
      });
    } else {
      temp.forEach((item) => {
        data.forEach((element) => {
          if (item.code == element.code) {
            arrData.push({
              code: item.code,
              price: item.price.concat(element.price),
            });
          }
        });
      });
    }
    console.log(arrData);
    setSummaryData(arrData);
  };

  function autoRefresh() {
    setIsPaused(false);
    myVar = setInterval(fetchSomeStock, 2000);
  }

  function stopRefresh() {
    setIsPaused(true);
    clearInterval(myVar);
  }

  function fetchSomeStock() {
    fetch(`https://join.reckon.com/stock-pricing`)
      .then((response) => response.json())
      .then((json) => {
        if (json.length > 0) {
          var temp = data;
          var now = new Date().toLocaleString();
          var toAdd = { date: now, data: json };
          setData((temp) => [...temp, toAdd]);
          formatData(json);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const triggerAutoFetch = () => {
    if (isPaused) {
      autoRefresh();
      setIsPaused(false);
    } else {
      stopRefresh();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    autoRefresh();
    return () => {
      stopRefresh();
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ margin: 10 }}>
      <RenderLogs item={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>MY - STOCK</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Text style={styles.contTitle}>Summary</Text>
        <Button
          title={isPaused ? "RESUME" : "PAUSE"}
          onPress={triggerAutoFetch}
          color={isPaused ? "limegreen" : "indianred"}
        />
      </View>
      <View
        style={[
          styles.dataContainer,
          {
            flexDirection: "row",
            padding: 5,
          },
        ]}
      >
        <View>
          <Text style={{ fontWeight: "bold" }}>Stock</Text>
          {summaryData.map((item, index) => (
            <Text key={index}>{item?.code}</Text>
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
            marginLeft: 5,
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold" }}>Starting</Text>
            {summaryData.map((item, index) => (
              <Text key={index}>{item?.price[0]}</Text>
            ))}
          </View>
          <View>
            <Text style={{ fontWeight: "bold" }}>Lowest</Text>
            {summaryData.map((item, index) => (
              <Text key={index}>{Math.min(...item.price)}</Text>
            ))}
          </View>
          <View>
            <Text style={{ fontWeight: "bold" }}>Highest</Text>
            {summaryData.map((item, index) => (
              <Text key={index}>{Math.max(...item.price)}</Text>
            ))}
          </View>
          <View>
            <Text style={{ fontWeight: "bold" }}>Current</Text>
            {summaryData.map((item, index) => (
              <Text key={index}>
                {item.price.length > 0
                  ? item?.price[item?.price.length - 1]
                  : item.price[0]}
              </Text>
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.contTitle}>Logs</Text>
      <View style={[styles.dataContainer, { flex: 1 }]}>
        <FlatList
          data={[...data].reverse()}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default StockScreen;
