import { ThemedText } from "@/components/ThemedText";
import React from "react";
import {
  ColorSchemeName,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

type RecipeProps = {
  title: string;
  difficultyLevel: "easy" | "medium" | "hard";
  ingredients: string[];
  instructions: string[];
  image_url: string | undefined;
  timeToCook: number;
};

const difficultyColors = {
  easy: "#a8e6cf",
  medium: "#ffd3b6",
  hard: "#ff8b94",
};

const { width: screenWidth } = Dimensions.get("window");

export default function Recipe({
  title,
  difficultyLevel,
  ingredients,
  instructions,
  image_url,
  timeToCook,
}: RecipeProps) {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  console.log(title);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText
          lightColor="black"
          darkColor="white"
          style={styles.timeText}
        >
          {timeToCook} min
        </ThemedText>
        <ThemedText lightColor="black" darkColor="white" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText
          lightColor="black"
          darkColor="white"
          style={styles.difficultyText}
        >
          {difficultyLevel.toUpperCase()}
        </ThemedText>
      </View>

      <View style={styles.body}>
        {image_url ? (
          <Image source={{ uri: image_url }} style={styles.image} />
        ) : null}
        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <ScrollView style={styles.listContainer} nestedScrollEnabled>
            {ingredients.map((instruction, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>{instruction}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const getStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 20,
      marginBottom: 10,
      backgroundColor: "white",
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: colorScheme === "dark" ? 0 : 0.3,
      shadowRadius: 10,
      elevation: 2,
    },
    header: {
      padding: 10,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      flex: 0.1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: colorScheme === "dark" ? "#b45309" : "#fbbf24",
    },
    title: {
      fontSize: screenWidth * 0.05,
      fontWeight: "bold",
      flex: 0.4,
      textAlign: "center",
      color: colorScheme === "dark" ? "white" : "black",
    },
    timeText: {
      fontSize: 16,
      flexDirection: "row",
      flex: 0.3,
      textAlign: "center",
      color: colorScheme === "dark" ? "white" : "black",
      fontWeight: "bold",
    },
    difficultyText: {
      fontSize: 16,
      flex: 0.3,
      marginEnd: 10,
      textAlign: "center",
      fontWeight: "bold",
    },
    user: {
      fontSize: 16,
      flex: 0.3,
      textAlign: "center",
      color: colorScheme === "dark" ? "white" : "black",
      fontWeight: "bold",
    },
    body: {
      flexDirection: "row",
    },
    image: {
      width: 130,
      height: 130,
      borderRadius: 10,
      margin: 10,
      marginBottom: 15,
    },
    ingredientsContainer: {
      flex: 1,
      justifyContent: "center",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },
    listContainer: {
      maxHeight: 130,
    },
    listItem: {
      fontSize: 14,
      flexDirection: "row",
      marginVertical: 2,
      color: colorScheme === "dark" ? "white" : "black",
    },
    listItemText: {
      marginLeft: 5,
    },
  });
