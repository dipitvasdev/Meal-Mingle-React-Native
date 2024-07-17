import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ColorSchemeName,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

type RecipeProps = {
  id: string;
  title: string;
  difficultyLevel: "easy" | "medium" | "hard";
  ingredients: string[];
  instructions: string[];
  image: string | null | undefined;
  timeToCook: number;
};

function cleanString(input: string): string[] {
  let lines = input.split("\n");
  lines = lines.map((line) => line.trim().replace(/^\d+\.\s*/, ""));
  lines = lines.filter((line) => line.length > 0);
  return lines;
}

export default function EditRecipe() {
  const colorScheme = useColorScheme();
  const { recipe } = useLocalSearchParams();
  let recipeData: RecipeProps | null = null;
  if (typeof recipe === "string") {
    try {
      recipeData = JSON.parse(recipe);
    } catch (error) {
      console.error("Failed to parse recipe data", error);
    }
  }
  console.log(recipeData);
  const [title, setTitle] = useState(recipeData ? recipeData.title : "");
  const [ingredients, setIngredients] = useState(
    recipeData ? recipeData.ingredients.join("\n") : ""
  );
  const [instruction, setInstruction] = useState(
    recipeData ? recipeData.instructions.join("\n") : ""
  );
  const [timeToCook, setTimeToCook] = useState(
    recipeData ? recipeData.timeToCook.toString() : ""
  );
  const [difficultyLevel, setDifficultyLevel] = useState(
    recipeData ? recipeData?.difficultyLevel : "easy"
  );
  const [image, setImage] = useState<string | null | undefined>(
    recipeData ? recipeData?.image : null
  );
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
  ]);

  const [open, setOpen] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "You need to grant camera roll permissions to add images."
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    if (
      !title ||
      !ingredients ||
      !instruction ||
      !timeToCook ||
      !difficultyLevel
    ) {
      Alert.alert("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const handleNumberChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setTimeToCook(numericValue);
  };
  const handleSubmit = async () => {
    setLoading(true);
    const cleanedIngredients = cleanString(ingredients);
    const cleanedInstructions = cleanString(instruction);
    const updatedRecipe = {
      id: recipeData?.id || "",
      title: title,
      difficultyLevel: difficultyLevel,
      ingredients: cleanedIngredients,
      instructions: cleanedInstructions,
      image: image,
      timeToCook: parseInt(timeToCook),
    };

    try {
      const storedRecipes = await AsyncStorage.getItem("recipes");
      const recipes: RecipeProps[] = storedRecipes
        ? JSON.parse(storedRecipes)
        : [];
      const recipeIndex = recipes.findIndex((r) => r.id === recipeData?.id);
      if (recipeIndex !== -1) {
        recipes[recipeIndex] = updatedRecipe;
      } else {
        recipes.push(updatedRecipe);
      }
      await AsyncStorage.setItem("recipes", JSON.stringify(recipes));
      setLoading(false);
      Alert.alert("Recipe updated successfully!");
      router.push("(mainRecipe)");
    } catch (error: any) {
      Alert.alert("Error", `Failed to update recipe: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(colorScheme);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText lightColor="black" darkColor="white" style={styles.title}>
        Add a recipe
      </ThemedText>

      {!loading ? (
        <>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={pickImage}
            accessibilityLabel="Add Image"
            activeOpacity={0.5}
          >
            <TabBarIcon
              name="camera"
              color={colorScheme == "dark" ? "white" : "black"}
              style={styles.imageIcon}
            />
            <Text style={styles.buttonText}>Add Image</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.image} />}

          <TextInput
            style={styles.input}
            placeholder="Title"
            autoCapitalize="words"
            autoCorrect={true}
            inputMode="text"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#737373"
          />

          <TextInput
            style={styles.bigInput}
            placeholder="Ingredients"
            autoCapitalize="words"
            multiline={true}
            numberOfLines={10}
            autoCorrect={true}
            value={ingredients}
            onChangeText={setIngredients}
            textAlignVertical="top"
            placeholderTextColor="#737373"
          />

          <ThemedText style={styles.alertText}>
            Please add each ingredient in different lines
          </ThemedText>

          <TextInput
            style={styles.bigInput}
            placeholder="Instruction/Steps"
            autoCapitalize="words"
            inputMode="text"
            multiline={true}
            numberOfLines={10}
            autoCorrect={true}
            value={instruction}
            onChangeText={setInstruction}
            placeholderTextColor="#737373"
          />

          <ThemedText style={styles.alertText}>
            Please add each step in a different line
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Time Taken(in minutes)"
            autoCapitalize="none"
            autoCorrect={true}
            value={timeToCook}
            onChangeText={handleNumberChange}
            placeholderTextColor="#737373"
            keyboardType="numeric"
          />

          <View style={styles.gap}>
            <DropDownPicker
              open={open}
              value={difficultyLevel}
              items={items}
              setOpen={setOpen}
              setValue={setDifficultyLevel}
              setItems={setItems}
              placeholder="Select the difficulty level"
              dropDownContainerStyle={styles.dropDownContainer}
              zIndexInverse={1000}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            accessibilityLabel="Edit recipe to meal mingle"
            activeOpacity={0.5}
          >
            <Text style={styles.buttonText}>Edit Recipe</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <ThemedText lightColor="black" darkColor="white" style={styles.title}>
            Adding...
          </ThemedText>
        </>
      )}
    </ScrollView>
  );
}
const getStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
    },
    container: {
      justifyContent: "center",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 30,
      textAlign: "center",
    },
    input: {
      fontSize: 18,
      borderWidth: 1,
      marginTop: 10,
      marginBottom: 20,
      borderRadius: 100,
      borderColor: Colors[colorScheme ?? "light"].text,
      padding: 16,
      color: Colors[colorScheme ?? "light"].text,
    },

    bigInput: {
      fontSize: 18,
      borderWidth: 1,
      marginTop: 10,
      marginBottom: 20,
      height: 150,
      borderRadius: 20,
      textAlignVertical: "top",
      borderColor: Colors[colorScheme ?? "light"].text,
      padding: 16,
      color: Colors[colorScheme ?? "light"].text,
    },

    button: {
      backgroundColor: colorScheme === "dark" ? "#166534" : "#86efac",
      borderRadius: 100,
      padding: 16,
      marginTop: 30,
      marginBottom: 10,
      justifyContent: "center",
      zIndex: -1,
      alignItems: "center",
    },
    imageButton: {
      backgroundColor: colorScheme === "dark" ? "#166534" : "#86efac",
      borderRadius: 100,
      padding: 16,
      marginBottom: 10,
      justifyContent: "center",
      zIndex: -1,
      flexDirection: "row",
      gap: 20,
      alignItems: "center",
    },

    buttonText: {
      fontSize: 18,
      textTransform: "uppercase",
      letterSpacing: 1,
      color: colorScheme === "dark" ? "white" : "black",
    },
    alertText: {
      color: colorScheme === "dark" ? "white" : "black",
      opacity: 0.6,
      marginBottom: 30,
      marginLeft: 10,
    },
    loginText: {
      color: Colors[colorScheme ?? "light"].text,
      marginTop: 20,
      marginBottom: 30,
      textAlign: "center",
    },
    loginTextLink: {
      color: Colors[colorScheme ?? "light"].text,
      fontWeight: "bold",
      textDecorationLine: "underline",
    },

    dropDownContainer: {
      backgroundColor: "white",
      color: colorScheme === "dark" ? "white" : "black",
    },

    dropdown: {
      backgroundColor: "white",
    },

    gap: {
      marginTop: 10,
      marginBottom: 20,
    },
    image: {
      width: 200,
      height: 200,
      alignSelf: "center",
    },
    imageIcon: {},
  });
