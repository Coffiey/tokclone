import { View, Text, Image } from "react-native";
import React from "react";
import styles from "./styles";
import { useUser } from "../../../../hooks/useUser";

const CommentItem = ({ item }) => {
  const user = useUser(item.creator).data;
  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{ uri: user.photoURL }}
      />
      <View style={styles.containerText}>
        <Text style={styles.displayName}>{user.displayName}</Text>
        <Text>{item.comment}</Text>
      </View>
    </View>
  );
};

export default CommentItem;
