import { View, Text, FlatList } from "react-native";
import React from "react";
import NavBarGeneral from "../../../components/general/navBar";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatListItem from "../../../components/chat/list/item";
import { useSelector } from "react-redux";

const ChatScreen = () => {
  const chats = useSelector((state) => state.chat.list);

  const renderItem = ({ item }) => {
    return <ChatListItem chat={item} />;
  };
  return (
    <SafeAreaView>
      <NavBarGeneral
        leftButton={{ display: fals }}
        title='Messages'
      />
      <FlatList
        data={chats}
        removeClippedSubviews
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;
