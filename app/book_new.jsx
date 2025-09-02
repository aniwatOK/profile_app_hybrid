import { View, Text, StyleSheet, FlatList, Button } from "react-native";

const BookNew = () => {
  const handleCreate = async () => {
    var bookData = {
      title: "string",
      author: "string",
      description: "string",
      genre: "string",
      year: 2024,
      price: 0,
      available: true,
    };
    //TODO post bookData to API
  };
  return (
    <View>
      <Text>Create a New Book</Text>
      {/* TODO: Add form inputs for book details */}
    </View>
  );
};
export default BookNew;
const style = StyleSheet.create({});
