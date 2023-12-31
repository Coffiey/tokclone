import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import React, { useState, useEffect, useMemo } from "react";
import countryList from "react-select-country-list";
import styles from "./styles";
import { getLikeById, updateLike } from "../../../../services/post";
import { useDispatch, useSelector } from "react-redux";
import { throttle } from "throttle-debounce";
import { openCommentModel } from "../../../../redux/actions/model";
import { useNavigation } from "@react-navigation/native";
import CountryPicker from "./countryPicker";

export default function PostSingleOverlay({
  user,
  post,
  mute,
  setMute,
  setCountrySwitch,
}) {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const optionsData = useMemo(() => countryList().getLabels(), []);
  const options = [
    ...optionsData.slice(-7),
    ...optionsData,
    ...optionsData.slice(0, 7),
  ];
  const [displayCountries, setDisplayCountries] = useState(false);
  const [currentLikeState, setCurrentLikeState] = useState({
    state: false,
    counter: post.likesCount,
  });

  useEffect(() => {
    getLikeById(post.id, currentUser.uid).then((res) => {
      setCurrentLikeState({
        ...currentLikeState,
        state: res,
      });
    });
  }, []);

  const handleDisplayCountries = () => {
    setCountrySwitch(displayCountries);
    setDisplayCountries(!displayCountries);
  };

  const handleUpdateLike = useMemo(
    () =>
      throttle(2000, (currentLikeStateInst) => {
        setCurrentLikeState({
          state: !currentLikeStateInst.state,
          counter:
            currentLikeStateInst.counter +
            (currentLikeStateInst.state ? -1 : 1),
        });
        updateLike(post.id, currentUser.uid, currentLikeStateInst.state);
      }),
    []
  );

  return (
    <View style={styles.container}>
      {user && (
        <>
          <View style={styles.leftContainer}>
            <TouchableOpacity style={styles.leftAction}>
              <Feather
                color={"black"}
                size={18}
                name='map'
                onPress={handleDisplayCountries}
              />
            </TouchableOpacity>
            {displayCountries && (
              <CountryPicker
                options={options}
                handleDisplayCountries={handleDisplayCountries}
              />
            )}
            <TouchableOpacity
              style={[styles.leftAction, styles.Volume]}
              onPress={() => setMute(!mute)}
            >
              <Ionicons
                color={"black"}
                size={20}
                name={mute ? "volume-mute" : "volume-off-sharp"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.leftReport}>
              <Entypo
                color={"white"}
                size={30}
                name='dots-three-horizontal'
              />
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>JPY</Text>
              <Text style={styles.priceNumber}>2000</Text>
            </View>
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("profileOther", {
                    initaUserId: user.uid,
                  })
                }
              >
                <Image
                  source={{ uri: user.photoURL }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <View>
                <View style={styles.userContainer}>
                  <Text style={styles.displayName}>{user.displayName}</Text>
                  <Text style={styles.userContact}>
                    Contact{" "}
                    {
                      <Feather
                        color={"white"}
                        size={12}
                        name='phone'
                      />
                    }
                  </Text>
                </View>
                <Text style={styles.description}>{post.description}</Text>
              </View>
            </View>
          </View>
          <View style={styles.rightContainer}>
            <TouchableOpacity
              style={styles.action}
              onPress={() => dispatch(openCommentModel(true, post))}
            >
              <Ionicons
                color={"white"}
                size={30}
                name='arrow-redo-outline'
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.action}
              onPress={() => dispatch(openCommentModel(true, post))}
            >
              <Ionicons
                color={"white"}
                size={25}
                name='chatbox-outline'
              />
              <Text style={styles.actionButtonText}>{post.commentsCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.action}
              onPress={() => handleUpdateLike(currentLikeState)}
            >
              <Ionicons
                color={currentLikeState.state ? "red" : "white"}
                size={25}
                name={currentLikeState.state ? "heart" : "heart-outline"}
              />
              <Text style={styles.actionButtonText}>
                {currentLikeState.counter}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
