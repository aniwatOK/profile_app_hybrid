import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";

const BookDetail = () => {
  const [book, setBook] = useState(null);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://10.0.15.34:3000/api/books/${id}`);
        const data = await response.json();
        setBook(data.book);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBook();
  }, [id]);

  const handleUpdate = async () => {
    try {
      //TODO create textbox inputs for each field and update the state
      var updateData = {
        title: "Web Development",
        author: "John Doe",
        description: "A comprehensive guide to web development.",
        genre: "Technology",
        year: 2025,
        price: 500,
        available: true,
      };
      const response = await fetch(`http://10.0.15.34:3000/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      if (response.ok) {
        console.log("Book updated successfully");
      } else {
        console.error("Error updating book");
      }
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleDelete = async () => {
    //TODO show confirmation dialog
    // If confirmed, proceed with deletion
    try {
      const response = await fetch(`http://10.0.15.34:3000/api/books/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Book deleted successfully");
      } else {
        console.error("Error deleting book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const confirmaDelete = () => {
    // TODO Show confirmation dialog
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: handleDelete },
      ]
    );
  };

  return (
    <View>
      <Text>Book Detail for ID: {id}</Text>
      <Text>Title: {book?.title}</Text>
      <Text>Author: {book?.author}</Text>
      <Text>Description: {book?.description}</Text>
      <Button title="Save" onPress={handleUpdate} />
      <Button title="Delete" onPress={confirmaDelete} />
    </View>
  );
};
export default BookDetail;
const style = StyleSheet.create({
  container: {
    marginVertical: 14,
    marginHorizontal: 20,
    alignItems: "center",
  },
});
