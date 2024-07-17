import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const logoSource =
    colorScheme === "dark"
      ? require("../../assets/images/cooking.png")
      : require("../../assets/images/cooking.png");

  return (
    <>
      <View style={styles.container}>
        <ThemedView style={styles.nav} lightColor="#fcd34d" darkColor="#b45309">
          <Image source={logoSource} style={styles.logo} />
          <ThemedText style={styles.title} lightColor="black" darkColor="white">
            Meal Mingle: Recipe Sharing
          </ThemedText>
        </ThemedView>
      </View>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].text,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          tabBarInactiveTintColor: Colors[colorScheme ?? "light"].icon,
        }}
      >
        <Tabs.Screen
          name="(mainRecipe)"
          options={{
            title: "Recipes",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "fast-food" : "fast-food-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add-recipe"
          options={{
            title: "Add Recipe",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "add-circle" : "add-circle-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "12%",
  },
  nav: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    marginBottom: 20,
    marginEnd: 10,
  },
});
