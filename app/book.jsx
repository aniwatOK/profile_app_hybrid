import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
const Book = () => {
  const [data, setData] = useState([]);
  // function to fetch book data

  useEffect(() => {
    console.log("Book component mounted");

    try {
      fetch("http://10.0.15.34:3000/api/books?page=1&limit=10")
        .then((response) => response.json())
        .then((data) => {
          console.log("Book data fetched successfully:", data.books);
          setData(data.books);
        })
        .catch((error) => {
          console.error("Error fetching book data:", error);
        });
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  }, []);
  return (
    <View style={style.container}>
      <Link href={"/book_new"}>
        <Text>Create New Book</Text>
      </Link>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={(item) => {
          return (
            <View key={item.item._id}>
              <TouchableOpacity
                onPress={() => {
                  //go to book_detail
                  router.push(`/book_detail?id=${item.item._id}`);
                }}
              >
                <View>
                  <Text style={style.title}>{item.item.title}</Text>
                  <Text style={style.text}>{item.item.author}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      ></FlatList>
    </View>
  );
};
export default Book;
const style = StyleSheet.create({
  container: {
    marginVertical: 14,
    marginHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    marginTop: 10,
  },
  text: {},
});
