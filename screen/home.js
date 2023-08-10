import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { View, StyleSheet, Text, TouchableOpacity,Image ,Dimensions} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const CACHE_KEY = 'cachedImages';
const Home = () => {
    const [data,setData]=useState([])

    
    useEffect(()=>{

        loadData()
        getStoredData()
        
        const intervalId = setInterval(loadData, 5000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);

    },[])
    const getStoredData=async()=>{
        const storedData=await AsyncStorage.getItem(CACHE_KEY)
        setData(JSON.parse(storedData))
    }
    const loadData=async()=>{
        let response=await fetch("https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s")
        let res=await response.json()
        // console.log(typeof(JSON.stringify(res.photos.photo)))
         await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(res.photos.photo));
        //  let storedImage=await AsyncStorage.getItem(CACHE_KEY)
        setData(res.photos.photo)
        
        
    }
 const renderItem=(item)=>{
    
    return(
        <Image source={{uri:item.item.url_s}} style={styles.image}  />
    )
 }
 
  return (
    <View style={{marginBottom:100}}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.navbar}> Home</Text>
        </TouchableOpacity>
      </View>
      <FlatList 
      data={data}
      renderItem={renderItem}
      numColumns={numColumns}
      columnWrapperStyle={styles.columnWrapper}
      keyExtractor={(item) => item.id}
      
      />
      

    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    fontSize: 20,
    padding: 10,
  },
  header: {
    width: "100%",
    height: 50,
    backgroundColor: "gray",
    marginTop: 50,
    // <Image source={item.url_s} style={styles.image} />

    // opacity:0.5,
  },
  image: {
    width: screenWidth / numColumns,
    height: 150, // Set a fixed height or adjust as needed
    resizeMode: 'cover',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});

export default Home;
