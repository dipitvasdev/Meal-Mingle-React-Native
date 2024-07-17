import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ColorSchemeName,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type RecipeProps = {
  id: string;
  title: string;
  difficultyLevel: "easy" | "medium" | "hard";
  ingredients: string[];
  instructions: string[];
  image: string | undefined;
  timeToCook: number;
};

const difficultyColors = {
  easy: "#a8e6cf",
  medium: "#ffd3b6",
  hard: "#ff8b94",
};

const { width: screenWidth } = Dimensions.get("window");

export default function SingleRecipe() {
  const { recipe } = useLocalSearchParams();
  const colorScheme = useColorScheme();

  let recipeData: RecipeProps | null = null;

  if (typeof recipe === "string") {
    try {
      recipeData = JSON.parse(recipe);
    } catch (error) {
      console.error("Failed to parse recipe data", error);
    }
  }
  console.log(recipeData);

  if (!recipeData) {
    return (
      <View>
        <Text>Failed to load recipe data.</Text>
      </View>
    );
  }
  const styles = getStyles(colorScheme, recipeData);

  const handleEdit = (recipe: RecipeProps) => {
    console.log(recipe);
    router.push({
      pathname: "edit-recipe",
      params: { recipe: JSON.stringify(recipe) },
    });
  };

  const handleDelete = async (recipeId: string) => {
    try {
      const storedRecipes = await AsyncStorage.getItem("recipes");
      let recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      recipes = recipes.filter((recipe: RecipeProps) => recipe.id !== recipeId);
      await AsyncStorage.setItem("recipes", JSON.stringify(recipes));

      Alert.alert("Success", "Recipe deleted successfully!");
      router.push("(mainRecipe)"); // Navigate back to the recipes list
    } catch (error) {
      console.error("Failed to delete recipe", error);
      Alert.alert("Error", "Failed to delete recipe.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText
          lightColor="black"
          darkColor="white"
          style={styles.timeText}
        >
          {recipeData.timeToCook} min
        </ThemedText>
        <ThemedText lightColor="black" darkColor="white" style={styles.title}>
          {recipeData.title}
        </ThemedText>
        <ThemedText
          lightColor="black"
          darkColor="white"
          style={styles.difficultyText}
        >
          {recipeData.difficultyLevel.toUpperCase()}
        </ThemedText>
      </View>

      <View style={styles.body}>
        {recipeData.image ? (
          <Image source={{ uri: recipeData.image }} style={styles.image} />
        ) : null}
        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <ScrollView
            contentContainerStyle={styles.listContainer}
            nestedScrollEnabled
          >
            {recipeData.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>{ingredient}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.body2}>
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionInsTitle}>Instructions</Text>
          <ScrollView contentContainerStyle={styles.listInsContainer}>
            {recipeData.instructions.map((instruction, index) => (
              <View key={index} style={styles.listInsItem}>
                <Text style={styles.listItemText}>{instruction}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.end}>
          <TouchableOpacity
            onPress={() => handleDelete(recipeData.id)}
            style={styles.button}
            accessibilityLabel="Delete"
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleEdit(recipeData)}
            style={styles.buttonEdit}
            accessibilityLabel="Edit"
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const getStyles = (colorScheme: ColorSchemeName, recipeData: RecipeProps) =>
  StyleSheet.create({
    container: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 20,
      backgroundColor: "white",
      borderRadius: 20,
      flex: 0.9,
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
      fontSize: screenWidth * 0.06,
      fontWeight: "bold",
      flex: 2,
      textAlign: "center",
      color: colorScheme === "dark" ? "white" : "black",
    },
    timeText: {
      fontSize: 16,
      flex: 0.5,
      marginStart: 10,
      flexDirection: "row",
      textAlign: "center",
      color: colorScheme === "dark" ? "white" : "black",
      fontWeight: "bold",
    },
    difficultyText: {
      fontSize: 16,
      flex: 0.5,
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
    body2: {
      flex: 1,
      flexDirection: "column",
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
    instructionsContainer: {
      flex: 0.9,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      justifyContent: "center",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },
    sectionInsTitle: {
      fontSize: 16,
      width: "100%",
      fontWeight: "bold",
      textAlign: "center",
      alignSelf: "center",
    },
    listContainer: {
      maxHeight: 130,
    },
    listInsContainer: {
      flexGrow: 1,
      padding: 20,
      height: 500,
    },
    listItem: {
      fontSize: 14,
      flexDirection: "row",
      marginVertical: 2,
      color: colorScheme === "dark" ? "white" : "black",
    },
    listInsItem: {
      fontSize: 14,
      flexDirection: "column",
      marginBottom: 20,
      color: colorScheme === "dark" ? "white" : "black",
    },
    listItemText: {
      marginLeft: 5,
    },
    errorText: {
      fontSize: 16,
      color: "red",
      textAlign: "center",
      marginTop: 20,
    },
    button: {
      backgroundColor: colorScheme === "dark" ? "#b91c1c" : "#fca5a5",
      borderBottomLeftRadius: 20,
      padding: 10,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonEdit: {
      backgroundColor: colorScheme === "dark" ? "#166534" : "#86efac",
      borderBottomRightRadius: 20,
      padding: 10,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    buttonText: {
      fontSize: 20,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: colorScheme === "dark" ? "white" : "black",
    },

    end: {
      flex: 0.1,
      flexDirection: "row",
    },
  });
