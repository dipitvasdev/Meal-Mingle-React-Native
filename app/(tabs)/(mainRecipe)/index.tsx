import { ThemedText } from "@/components/ThemedText";
import {
  ColorSchemeName,
  FlatList,
  Image,
  LogBox,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import Recipe from "@/app/recipe";
import AsyncStorage from "@react-native-async-storage/async-storage";
type RecipeType = {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  image: string;
  timeToCook: number;
  difficultyLevel: "easy" | "medium" | "hard";
  created_at: string;
};

export default function RecipeIndex() {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const storedRecipes = await AsyncStorage.getItem("recipes");
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      console.log(recipes);
      setRecipes(recipes);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      const initialFetch = async () => {
        setRecipes([]); // Clear previous recipes
        await fetchRecipes();
      };
      initialFetch();
    }, [])
  );
  const handleRecipePress = (recipe: RecipeType) => {
    console.log(recipe);
    router.push({
      pathname: "single-recipe",
      params: { recipe: JSON.stringify(recipe) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleRecipePress(item)}
          >
            <Recipe
              title={item.title}
              difficultyLevel={item.difficultyLevel}
              ingredients={item.ingredients}
              instructions={item.instructions}
              image_url={item.image}
              timeToCook={item.timeToCook}
            />
          </TouchableOpacity>
        )}
        refreshing={loading}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <ThemedText lightColor="black" darkColor="white">
            ADD YOUR FIRST RECIPE FROM MENU BELOW
          </ThemedText>
        }
      ></FlatList>
    </SafeAreaView>
  );
}
const getStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    button: {
      backgroundColor: colorScheme === "dark" ? "#166534" : "#86efac",
      padding: 16,
      justifyContent: "center",
      alignItems: "center",
    },

    buttonText: {
      fontSize: 18,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: colorScheme === "dark" ? "white" : "black",
    },
  });
