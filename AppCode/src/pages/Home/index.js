import {
  View, 
  Text,
  StyleSheet,
  ButtonGroup,
Image,
TouchableOpacity,
TextInput, Pressable,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard,Alert ,BackHandler,SafeAreaView,ScrollView   } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Animatable from 'react-native-animatable';
import RadioButtonRN from 'radio-buttons-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonSpinner from 'react-native-button-spinner';
import Icon from 'react-native-vector-icons/AntDesign';
import IconF from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      res: {},
      example: 1,
      game: 1,
      Usuario:'',
      text:'',
      showAlert: false,
      profilecache:''
    };

    let { profilecache } = this.state;
    const getData = async () => {
      var valor = await AsyncStorage.getItem('@storage_profile') 
      valor = JSON.parse(valor)
      if(valor !== '' &&  valor !== 'null' && valor !== null){
        this.setState({ profilecache : JSON.stringify(valor) })
      }
    }
    getData().then((storageuser) => {})

    this._redergames = this._redergames.bind(this);
    this._renderRadioBtn = this._renderRadioBtn.bind(this);
    this.awaitSendRequest = this.awaitSendRequest.bind(this);
    this.RequestSaveProfile = this.RequestSaveProfile.bind(this);
    
}

componentDidMount() {
  this._unsubscribe = this.props.navigation.addListener('focus', () => {
    const getData = async () => {
      var valor = await AsyncStorage.getItem('@storage_profile') 
      valor = JSON.parse(valor)
      if(valor !== '' &&  valor !== 'null' && valor !== null){
        this.setState({ profilecache : JSON.stringify(valor) })
      }else{
        this.setState({ profilecache : '' })
      }
    }
    getData().then((storageuser) => {})

  });
}

componentWillUnmount() {
  this._unsubscribe();
}


RequestSaveProfile() {
  let { profilecache} = this.state;
  var json = JSON.parse(profilecache)
  var Usuario = json.name
  var acc = json.acc
  var game = json.game

  let _data = {
    user: Usuario,
    acc: acc,
    game: game
  }
    var check =false
    if(Usuario.trim() != ''){

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
                    resolve("")
                    Alert.alert("Atenção",'Game off the air')
                  }else{
                      fetch("http://192.168.15.33/match",{
                        method: "POST",
                        body: JSON.stringify(_data),
                        headers: {"Content-type": "application/json; charset=UTF-8"}
                      }).then(response => response.json())
                      .then((responsematches) => {
                          resolve("api ok")
                          this.props.navigation.navigate('StatsPage',{ name: Usuario , responseJson:JSON.stringify(responseJson) , matches:JSON.stringify(responsematches),profile:JSON.stringify(profilecache),acc: acc ,game : game},)   
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
       Alert.alert("Attention",'User with incorrect format!')
     }
    }else{
      Alert.alert("Attention",'Empty user !')
    }
 
}


awaitSendRequest() {
  let { Usuario,example,game,profilecache } = this.state;
  let _data = {
    user: Usuario,
    acc: example,
    game: game
  }
  

   const getData = async () => {
      var valor = await AsyncStorage.getItem('@storage_profile') 
      return valor
    }

    if(Usuario.trim() != ''){
       var check = false
      if(/^[a-zA-Z0-9]+[#]+[0-9]{0,61}/.test(Usuario) && example == 1 || example ==2){
        check = true
      }else if(example ==3 || example ==4) {
        check = true
      }else{
        check = false
      }

      if(check){
        return new Promise((resolve, reject) => {
          getData().then((storageuser) => {
              fetch("http://192.168.15.33:80/",{
                method: "POST",
                body: JSON.stringify(_data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
              }).then(response => response.json())
              .then((responseJson) => {
                  var resp = responseJson
                  if (resp.res == '0'){
                     resolve("")
                    Alert.alert("Atenção",'User not found!!')
                  }else if(resp.game == '0'){
                    resolve("")
                    Alert.alert("Atenção",'Jogo fora do ar')
                  }else{
                      fetch("http://192.168.15.33:80/match",{
                        method: "POST",
                        body: JSON.stringify(_data),
                        headers: {"Content-type": "application/json; charset=UTF-8"}
                      }).then(response => response.json())
                      .then((responsematches) => {
                          resolve("api ok")
                          this.props.navigation.navigate('StatsPage',{ name: Usuario , responseJson:JSON.stringify(responseJson) , matches:JSON.stringify(responsematches),profile:JSON.stringify(storageuser),acc: example ,game : game},)   
                      })
                      .catch((error) => {
                        alert(error)
                        resolve("")
                        Alert.alert("Error",'#2 Data query failure !')
                      });
                  }
              })
              .catch((error) => {
                resolve("")
                console.error('Error:', error);
                Alert.alert("Error",'Data query failure !')
              });
              
            })
      })
    }else{
      Alert.alert("Attention",'User with incorrect format!')
    }
   }else{
     Alert.alert("Attention",'Empty user !')
   }

 
   
}


_redergames() {
  
  let { game } = this.state;
  if (game === 1) {
    return ('Warzone 1.0')
  }else if (game === 2) {
    return ('Warzone 2.0')
  }
}

_renderRadioBtn() {
  let { example } = this.state;
  if (example === 1) {
    return(
      <><View style={styles.circlebattle}>
        <Animatable.Image delay={300} animation="flipInY"
        style={styles.circlebattleimg}
        source={require('../../assets/battle.png')}
        onLoadStart={e => {
          this.bounce
        }}
        resizeMode="contain" />
        </View><Text style={styles.circletext}>BatleNet ID</Text><TextInput  style={styles.typesinput} autoCorrect={false} onChangeText={text => this.setState({Usuario : text})} placeholderTextColor="#868687"
          placeholder='type it your Battle.net Name#123456' /></>
    )
  }
  else if (example === 2) {
    return(
      <><View style={styles.circleact}><Animatable.Image delay={300} animation="flipInY"
      style={styles.circleactimg}
      source={require('../../assets/acti4.png')}
      resizeMode="contain" /></View><Text style={styles.circletext}>Activision ID</Text><TextInput style={styles.typesinput} autoCorrect={false} onChangeText={text => this.setState({Usuario : text})} placeholderTextColor="#868687"
        placeholder='type it your Activision ID Name#123456' /></>
    )
  }
  else if (example === 3) {
    return(

      <><View style={styles.circlepsn}><Animatable.Image delay={300} animation="flipInY"
      style={styles.circlepsnimg}
      source={require('../../assets/psn2.png')}
      resizeMode="contain" /></View><Text style={styles.circletext}>Playstation Network</Text><TextInput style={styles.typesinput} autoCorrect={false} onChangeText={text => this.setState({Usuario : text})} placeholderTextColor="#868687"
        placeholder='type it your Playstation Network ID' /></>
    )
  }
  else if (example === 4) {

    return(
      <><View style={styles.circlexbox}><Animatable.Image delay={300} animation="flipInY"
      style={styles.circlepsnimg}
      source={require('../../assets/xbox.png')}
      resizeMode="contain" /></View><Text style={styles.circletext}>XBOX LIVE ID</Text><TextInput style={styles.typesinput} autoCorrect={false} onChangeText={text => this.setState({Usuario : text})} placeholderTextColor="#868687"
        placeholder='type it your Xbox Live ID' /></>
    )

  }
  else if (example === 5) {
    return (
      <RadioButtonRN
        data={this.colors}
        animationTypes={['zoomIn']}
        initial={2}
        box={false}
        selectedBtn={(e) => this.setState({ res: e })}
        circleSize={16}
        icon={
          <Icon
            name="rocket"
            size={25}
            color="#a82c3a"
          />
        }
      />
    )
  }
}


  render() {
    let { example } = this.state;
    let { game } = this.state;
    let { Usuario } = this.state;
    let { text } = this.state; 
    let { profilecache } = this.state;

    

    return (
      <LinearGradient colors={['#121212', '#141414', '#131313']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.container2}>
        <SafeAreaView style={styles.container}>
         <View style={{flex: 1,alignItems:'center'}}>
            <KeyboardAwareScrollView
            contentContainerStyle={{flexGrow: 1,justifyContent:'center',alignItems:'center',}}
            extraScrollHeight={ profilecache !== '' ? 10 : -20}
            > 
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
             >
            <View  style={styles.containerForm}>
              <Text style={styles.title2}>
                  Select game
              </Text>
                <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent:'center' }}>
                      <View style={{ flexDirection: 'column' , justifyContent: 'center',alignItems:'center'}}>
                        <TouchableOpacity onPress={() => this.setState({ game: 1 })}>
                          <Animatable.Image delay={300} animation="flipInY"
                            style={[styles.typesgames, { borderColor: game === 1 ? '#fff' : 'black' }]}
                            source={require('../../assets/wz111.jpg')}
                            resizeMode="contain"  />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'column' , justifyContent: 'center',alignItems:'center'}}>
                        <TouchableOpacity onPress={() => this.setState({ game: 2 })}>
                          <Animatable.Image delay={300} animation="flipInY"
                              style={[styles.typesgames, { borderColor: game === 2 ? '#fff' : 'black' }]}
                            source={require('../../assets/wz2.jpg')}
                            resizeMode="contain" onPress={() => this.setState({ game: 2 })} />
                        </TouchableOpacity>
                      </View>
                </View>
              <Text style={styles.titlegames}>
              { this._redergames() }
              </Text>
              <Text style={styles.title2}>
                Select platform
              </Text>
              <View style={{ marginBottom: 15, flexDirection: 'row' }}>
              <ScrollView horizontal={true}>
                <View style={styles.neotypes}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={[styles.types, { backgroundColor: example === 1 ? '#141414' : 'white' }]}
                      onPress={() => this.setState({ example: 1 })}
                    >
                    <Text style={[{ color: example === 1 ? 'white' : 'black' }]}>
                      BattleNet
                    </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.neotypes}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={[styles.types, { backgroundColor: example === 2 ? '#141414' : 'white' }]}
                      onPress={() => this.setState({ example: 2 })}
                    >
                    <Text style={[{ color: example === 2 ? 'white' : 'black' }]}>
                      Activison
                    </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.neotypes}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={[styles.types, { backgroundColor: example === 3 ? '#141414' : 'white'}]}
                      onPress={() => this.setState({ example: 3 })}
                    >
                    <Text style={[{ color: example === 3 ? 'white' : 'black' }]}>
                      Playstation
                    </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.neotypes}>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.types, { backgroundColor: example === 4 ? '#141414' : 'white' }]}
                        onPress={() => this.setState({ example: 4 })}
                      >
                      <Text style={[{ color: example === 4 ? 'white' : 'black' }]}>
                        Xbox
                      </Text>
                      </TouchableOpacity>
                  </View>
              </ScrollView>
              </View>
                { this._renderRadioBtn() }
                  { profilecache !== '' ? <ButtonSpinner style={styles.profile}  onPress={this.RequestSaveProfile} >
                  <IconF name="star" size={20} color="#e6e600" /><Text style={styles.appButtonTextProfile}>{ JSON.parse(profilecache).name }</Text>
                  </ButtonSpinner>: ''}
                  <ButtonSpinner
                      onPress={this.awaitSendRequest} 
                      style={styles.appButtonContainer}
                      >
                    <Text style={styles.appButtonText} >Find</Text>
                  </ButtonSpinner>
            </View>
            </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }


  updateInputValue(evt) {
    const val = evt.target.value;
    // ...       
    this.setState({
      text: val
    });
  }


} 


const styles = StyleSheet.create({
  profile : {
    maxHeight:50,
    display:'flex',
    justifyContent:"center",
    alignItems:"center",
    flexDirection:'row',
    borderWidth:0,
    margin:5
    },
  neotypes : {margin:6},
  circle: {
    marginTop:'5%',
    width: '50%',
    borderRadius: 150,
    height: '20%',
    borderWidth: 4,
    backgroundColor: '#fff',
  },
  circlebattle: {
    backgroundColor: '#0174e0',
    marginTop:10,
    width: 100,
    borderRadius: 150,
    height: 95,
    borderColor:'#0174e0',
    borderWidth: 4,
    padding:50,
    justifyContent:"center",
    alignItems:"center",
  },
  circleact: {
    marginTop:10,
    width: 100,
    borderRadius: 150,
    height: 95,
    borderColor:'black',
    borderWidth: 4,
    padding:50,
    backgroundColor: 'black',
    justifyContent:"center",
    alignItems:"center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 13,
  },
  circlepsn: {
    marginTop:10,
    width: 100,
    borderRadius: 150,
    height: 95,
    borderColor:'black',
    borderWidth: 4,
    padding:50,
    backgroundColor: 'black',
    justifyContent:"center",
    alignItems:"center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 13,
  },
  circlexbox: {
    marginTop:10,
    width: 100,
    borderRadius: 150,
    height: 95,
    borderColor:'#107c0f',
    borderWidth: 4,
    padding:50,
    backgroundColor: '#107c0f',
    justifyContent:"center",
    alignItems:"center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 13,
  },
  circleactimg: {
    width: 90,
    height: 50
  },
  circletext:{
    color:'white',
    fontSize:18,
    fontWeight:'600',
    marginTop:'5%',
  } ,
  circlebattleimg: {
    width: 100,
    height: 50
  },
  circlepsnimg: {
    width: 100,
    height: 50
  },
  types: {
    borderWidth:1,
    borderColor:'#232323',
		padding: 10,
		borderRadius: 10,
		backgroundColor: '#fff',
    alignItems:'center',
    justifyContent:'center',
    textAlign:'center'
	},
  typesgames: {
    borderWidth: 4,
    margin:10,
    width: 100,
    height: 95,
		borderRadius: 20,
		backgroundColor: '#fff',
	},
  shadowview:{
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation:20,
  },
  typesinput: {
    width:'80%',
    marginTop:'5%',
		marginHorizontal: 5,
		borderWidth: 1,
		borderColor: '#bbb',
		padding: 10,
		borderRadius: 10,
		backgroundColor: '#fff',
    color:'black',
    textAlign:'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
	},
  container:{
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    backgroundColor: 'transparent'
  },
  container2:{
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    
  },
  containerHeader:{
    borderRadius:25,
    backgroundColor: 'transparent',
    padding: 8,
  },
  title:{
    color:'#fff',
    fontSize:20,
    fontWeight:'bold'
  } ,
  title2:{
    color:'white',
    fontSize:18,
    fontWeight:'bold',
    margin:20,
  },
  titlegames:{
    color:'white',
    fontSize:16,
    fontWeight:'600',
    marginTop:'2%',
    fontStyle: 'italic'
  } ,
  containerForm:{
    borderRadius:25,
    alignItems:"center",
    margin:10,
    backgroundColor:'#181818',
    padding:15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 13,
  },


  appButtonContainer: {
    maxHeight:50,
    borderWidth:1,
    borderColor:'#232323',
    elevation: 8,
    backgroundColor: "#020202",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 13,
  },
  appButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  appButtonTextProfile: {
    marginLeft:10,
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }

})

export default Home;