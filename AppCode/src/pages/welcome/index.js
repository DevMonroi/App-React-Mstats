import {
  View, 
  Text,
  StyleSheet,
Image,
TouchableOpacity,
TextInput, Pressable ,Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Extrapolate,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../componentes/RootNavigation';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync()

const getData = async () => {
  try {
    const cache = await AsyncStorage.getItem('@storage_profile')
    if(cache == '' || cache == 'null' || cache == null ){
      var Usuario=''
      var Usuario=''
      var game=''
      var acc=''
    }else{
      var profileparse =JSON.parse(cache);
      var Usuario=profileparse.name
      var game=profileparse.game
      var acc =profileparse.acc
    }

    let _data = {
      user: Usuario,
      acc: acc,
      game:game
    }

    var check = false

    if(Usuario !== '' && Usuario !== null){
      var check = false
      if(/^[a-zA-Z0-9]+[#]+[0-9]{0,61}/.test(Usuario) && acc == 1 || acc ==2){
        check = true
      }else if(acc ==3 || acc ==4) {
        check = true
      }else{
        check = false
      }

      if(check){
          return new Promise((resolve, reject) => {
            fetch("http://192.168.15.33:80/",{
              method: "POST",
              body: JSON.stringify(_data),
              headers: {"Content-type": "application/json; charset=UTF-8"}
            }).then(response => response.json())
            .then((responseJson) => {
                var resp = responseJson
                if (resp.res == '0'){
                  resolve("")
                  Alert.alert("Atenção",'User not found!')
                }else if(resp.game == '0'){
                  Alert.alert("Atenção",'Jogo fora do ar')
                  SplashScreen.hideAsync();
                  RootNavigation.navigate('Home'); 
                }else{
                    fetch("http://192.168.15.33:80/match",{
                      method: "POST",
                      body: JSON.stringify(_data),
                      headers: {"Content-type": "application/json; charset=UTF-8"}
                    }).then(response => response.json())
                    .then((responsematches) => {
                        resolve("api ok")
                        SplashScreen.hideAsync();
                        RootNavigation.navigate('StatsPage', { name: Usuario , responseJson:JSON.stringify(responseJson) , matches:JSON.stringify(responsematches),profile:JSON.stringify(cache),acc: acc ,game : game}); 
                    })
                    .catch((error) => {
                      console.error('Error:', error);
                      Alert.alert("Error",'#2 Data query failure !')
                    });
                }
            })
            .catch((error) => {
              console.error('Error:', error);
              Alert.alert("Error",'Data query failure !')
            });
            
          })
      }else{       
      }
    }else{

      setTimeout(async () => {
        SplashScreen.hideAsync();
      }, 3000);

    }
  } catch(e) {
    alert(e)
  }
}

getData();



const Pulse = ({ delay = 0, repeat }) => {
  const animation = useSharedValue(0);
  useEffect(() => {
    animation.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 2000,
          easing: Easing.linear,
        }),
        repeat ? -1 : 1,
        false
      )
    );
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      animation.value,
      [0, 1],
      [0.6, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity: opacity,
      transform: [{ scale: animation.value }],
    };
  });
  return <Animated.View style={[styles.circle, animatedStyles]} />;
};

export default function Welcome() {
  const navigation = useNavigation();
  const [pulse, setPulse] = useState([1]);

  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
      <Pressable
          style={styles.innerCircle}
          onPress={() => {
            setPulse((prev) => [...prev, Math.random()]);
          }}>
          <Animatable.Image delay={3500} animation="flipInY"
            style={styles.innerCircle}
            source={require('../../assets/M.png')}
            resizeMode="contain"
          />
        </Pressable>
        {pulse.map((item, index) => (
          <Pulse key={index} repeat={index === 0} />
        ))}

      </View>
      <Animatable.View delay={3500} animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Mz Stats</Text>
        <Text style={styles.text}>Check your progress & Compare to your friends </Text>
        <View style={styles.containerForm2}>
         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'black',
    padding: 8,
  },
  circle: {
    width: 300,
    borderRadius: 150,
    height: 300,
    position: 'absolute',
    borderColor: '#fff',
    borderWidth: 4,
    backgroundColor: '#fff',
  },
  innerCircle: {
    width: '100%',
    borderRadius: 40,
    height: 150,
    zIndex: 100,
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  containerLogo:{
    flex:2,
    backgroundColor:"black",
    justifyContent:"center",
    alignItems:"center"
  },
  containerForm:{
    backgroundColor : '#fff',
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    paddingStart:'5%',
    paddingEnd:'5%',
    justifyContent:"center",
    alignItems:"center",
    paddingBottom:20
  },
  containerForm2:{
    justifyContent:"center",
    alignItems:"center",
    width:'100%'
  },
  title:{
    fontSize: 28,
    fontWeight:'bold',
    marginTop:28,
    marginBottom:12,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
  },
  text:{
    fontSize:18,
    color:'a1a1a1',
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
  },
  button:{
    margin:20,
    paddin:20,
    backgroundColor:'#787878',
    borderRadius:50,
    paddingVertical:10,
    width:'60%',
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
    border: 1
  },
  buttonText:{
    fontSize:18,
    color:'#f7f7f7'
  }
})