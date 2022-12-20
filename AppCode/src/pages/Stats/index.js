import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View,StyleSheet,SafeAreaView,Dimensions,ScrollView,ActivityIndicator,TouchableOpacity,BackHandler } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';


var widthscreen = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

function LeaderBoard() {
  const [loading, setLoading] = useState(true);
  const [leader,setleader]= useState({})

  


  useEffect(() => {
    const fetchData =  async () => {
      fetch('http://192.168.15.33:80/leader')
          .then((res) => res.json())
          .then((data) => {
            setleader(data)
          })
          .catch((err) => {
               Alert.alert("Attention!",'Failed to query the data')
              console.log(err);
          })
          .finally(() => {
              setLoading(false);
          });
     }

     fetchData()

  }, [])

  if (loading) {
    
    return (
    <LinearGradient colors={['#121212', '#141414', '#131313']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.safeAreaView}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <ActivityIndicator size="small" color="white" /> 
      </View>
    </LinearGradient>)
    
  }else{

    return (
      <LinearGradient colors={['#121212', '#141414', '#131313']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.safeAreaView}> 
        <SafeAreaView style={styles.View}>
            <View style={styles.containerHeader}>
              <Animatable.View delay={300} animation="fadeInLeft">
                  <Text style={styles.title}>All TIME (Caldeira)</Text>
              </Animatable.View>
            </View>
          <ScrollView style={styles.scroolview} contentContainerStyle={{paddingBottom: 200}}>
            <View style={{ justifyContent: 'center', alignItems: 'center',margin:15 }}>
            {leader.map((item,index) =>
              <View  style={[{width: index == 0 ? '100%' : '90%',margin:10,},styles.shadowview2]} key={index}>
                <LinearGradient colors={['#000000', '#020202', '#080808', '#141414', '#1C1C1C', '#232323']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cardleader}>
                    <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', margin: 8}}>
                      <View style={[{ justifyContent: 'center',alignContent:'center',padding:10}]}>
                       {index > 2 ? <View style={styles.viewleaderpos}><Text style={styles.viewmatchestext}>{index + 1}</Text></View> : index == 0 ? <Text style={styles.headertitlesleaderwordICON}><IconF name="trophy" size={30} color="#dba11a" /></Text> : index == 1 ? <Text style={styles.headertitlesleaderwordICON}><IconF name="trophy" size={30} color="#c0c0c0" /></Text> : index == 2 ? <Text style={styles.headertitlesleaderwordICON}><IconF name="trophy" size={30} color="#be7f42" /></Text> : <View ></View>} 
                      </View>                   
                    </View>
                    <View  style={{ marginLeft:1, marginRight:1,borderWidth:1,borderRightWidth:0,borderLeftWidth:0,}}>
                      <View  style={[{ display: 'flex', justifyContent: 'center',alignContent:'center',padding:10}]}>
                        {index == 0 ? 
                          <View style={{ display: 'flex', justifyContent: 'center',alignContent:'center', flexDirection: 'row', margin: 8}}>
                            <Text style={styles.headertitlesleaderword}>First In The World !</Text>
                          </View> : ''
                        }
                        <View style={{ display: 'flex', justifyContent: 'center',alignContent:'center', flexDirection: 'row'}}>
                          <View style={styles.viewleadertitle2}><Text style={styles.headertitlesleader}>{item.map}</Text></View>
                          <View style={styles.viewleadertitle2}><Text style={styles.headertitlesleader}>{item.mode.split('_')[1]}</Text></View>
                          <View style={styles.viewleadertitle2}><Text style={styles.headertitlesleader}>QUADS</Text></View>
                        </View>
                      </View>
                    </View>
                    <View style={{ display: 'flex',flexDirection: 'row',alignContent:'center', margin: 8,Width:'100%' }}>
                          <View style={styles.flexinfoleader}>
                              <ScrollView horizontal={true} style={{maxWidth:'100%'}} >
                                <View style={styles.cardleaderdata}>
                                  {item.usernames.map((itemnames,index) => 
                                    <View
                                    style={[{ backgroundColor: '#202020' }, styles.cardleaderdatauser]}
                                    key={index}
                                    >
                                    <View style={styles.viewmatchestitle}><Text numberOfLines={1}  style={styles.viewmatchestextinfoleader}>{itemnames}</Text></View>
                                  </View>
                                  )}
                                </View>
                              </ScrollView>
                            </View>
                      
                            <View style={styles.flexinfoleader}>
                              <View style={{margin:10}}>
                                  <View style={[styles.cardleaderdatakills,{borderWidth:index == 0 ? 2 : 1,borderColor:index == 0 ? '#f0ae04' : index == 1 ? '#c4c4c4' : index == 2 ? '#be7f42' :  '#4c4c4c'}]} >
                                    <View style={styles.viewleadertitle}><Text style={styles.viewleadertextinfo}>Kills</Text></View>
                                    <View style={styles.viewleadertitle}><Text style={styles.viewmatchestextinfoleader}>{item.kills}</Text></View>
                                  </View>
                              </View> 
                          </View>
                    </View>
                </LinearGradient>
              </View>
            )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );

  }
}

function MatchesScreen({route}) {
  const matches = route.params.matches;
  var jsonmatches = JSON.parse(matches)
  if(jsonmatches.matches !== 'null' && jsonmatches.count !== 0){
      var arrmatches = [];
      Object.keys(jsonmatches.matches).forEach(function(key) {
        arrmatches.push(jsonmatches.matches[key]);
      });

      arrmatches.sort(function(x, y){
        return x.start_time - y.start_time;
      })


      

      var d = new Date(0);
      return (
        <LinearGradient colors={['#121212', '#141414', '#131313']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.safeAreaView}>
          <SafeAreaView style={styles.View}>
              <View style={styles.containerHeader}>
                <Animatable.View delay={300} animation="fadeInLeft" style={{justifyContent:'center',alignItems:'center',backgroundColor:'trasparent'}}>
                  <Text style={styles.title} delay={300} animation="fadeInUp">LAST 20 MATСHES</Text>
                  <Text style={[{fontSize:15,paddingTop:10,color:'white'}]} delay={300} animation="fadeInUp">{route.params.name}</Text>
                </Animatable.View>
              </View>
              <ScrollView style={styles.scroolview} contentContainerStyle={{paddingBottom: 180}}>
                <View style={{justifyContent: 'center', alignItems: 'center',margin:25 }}>
                  {arrmatches.reverse().map((item,index) =>
                  <View key={index} style={{justifyContent: 'center', alignItems: 'center'}}><View style={styles.shadowview2} >
                      <LinearGradient colors={['#000000', '#020202', '#080808', '#141414', '#1C1C1C', '#232323']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cardmatches}>
                        <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', margin: 8 }}>
                          <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestext}>{item.mod_loc.en}</Text></View>
                          <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestext}>{new Date(item.start_time * 1000).toLocaleString('pt-bR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</Text></View>
                        </View>
                        <View style={styles.cardmatchesmain}>
                          <View style={styles.viewmatchesdata}>
                            <View
                              style={[{ backgroundColor: item.place <= 1 ? '#2061c9' : '#202020' }, styles.cardmatchesdata]}
                            >
                              <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestextinfo}>{item.place}</Text></View>
                              <View style={styles.viewmatchestitle2}><Text style={styles.viewmatchestext}>Place</Text></View>
                            </View>
                            <View
                              style={[{ backgroundColor: '#202020', borderWidth: item.calc.team_kills >= 50 ? 1 : 0, borderColor: item.calc.team_kills >= 50 ? '#2061c9' : '#202020' }, styles.cardmatchesdata]}
                            >
                              <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestextinfo}>{item.calc.team_kills}</Text></View>
                              <View style={styles.viewmatchestitle2}><Text style={styles.viewmatchestext}>Team Kills</Text></View>
                            </View>
                            <View
                              style={[{ backgroundColor: '#202020' }, styles.cardmatchesdata]}
                            >
                              <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestextinfo}>{item.calc.lobby_kd}</Text></View>
                              <View style={styles.viewmatchestitle2}><Text style={styles.viewmatchestext}>Lobby KD</Text></View>
                            </View>
                            <View

                              style={[{ backgroundColor: '#202020', borderWidth: item.calc.kd_team >= 3 ? 1 : 0, borderColor: item.calc.kd_team >= 3 ? '#2061c9' : '#202020' }, styles.cardmatchesdata]}
                            >
                              <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestextinfo}>{item.calc.kd_team}</Text></View>
                              <View style={styles.viewmatchestitle2}><Text style={styles.viewmatchestext}>Team KD</Text></View>
                            </View>
                          </View>
                          <View style={styles.viewmatchesdata}>
                            <View style={styles.cardmatchesdata2}>
                              <View style={{ display: 'flex', margin: 8 }}>
                                <View style={styles.viewmatchestitle2}><Text style={styles.viewmatchestext}>kills</Text></View>
                                <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestextinfo}>{item.kills}</Text></View>
                              </View>
                              <View style={{ display: 'flex', margin: 8 }}>
                                <View style={styles.viewmatchestitle2}><Text style={styles.viewmatchestext}>Gulag</Text></View>
                                <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestextinfo}>{item.gulag_death}</Text></View>
                              </View>
                              <View style={{ display: 'flex', margin: 8 }}>
                                <View style={styles.viewmatchestitle2}><Text style={styles.viewmatchestext}>Headshots</Text></View>
                                <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestextinfo}>{(item.headshots * 100 / item.kills).toFixed(0) + '%'}</Text></View>
                              </View>
                              <View style={{ display: 'flex', margin: 8 }}>
                                <View style={styles.viewmatchestitle2}><Text style={styles.viewmatchestext}>Deaths</Text></View>
                                <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestextinfo}>{item.deaths}</Text></View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </LinearGradient>
                    </View><View><View style={{ backgroundColor: '#080808', padding: 10,maxWidth: 10 }}></View></View></View>
                  )}
                </View>
              </ScrollView>
          </SafeAreaView>
        </LinearGradient>
  );
 }else{

  return (
    <LinearGradient colors={['#000000', '#020202', '#080808', '#141414', '#1C1C1C', '#232323']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.safeAreaView}>
      
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',margin:15 }}>
            <View  style={{ padding:20 }} >
              <Text  style={{color:'white'}}>Nenhuma informação encontrada !</Text>
            </View>
        </View>
    </LinearGradient>


  )

 }
}

function Homeuser({route}) {
  const responseJson = route.params.responseJson;
  var json = JSON.parse(responseJson)
  const [leader,setleader]= useState(false)
  var profile =route.params.profile ;
  var acc =route.params.acc ;
  var game =route.params.game ;

  if(profile == '' ||  profile == 'null' || profile == null){
    var cacheprofile  =''
  }else{
    var profileparse = JSON.parse(JSON.parse(route.params.profile));
    var cacheprofile = profileparse.name
  }

  useEffect(() => {
      if(profile == 1 || cacheprofile == route.params.name){setleader(true)}
  }, [profile])


  var arr = [];
  Object.keys(json).forEach(function(key) {
    arr.push(json[key]);
  });

  async function SetUser(){
    try {
     if(!leader){
      const User = {
        game: game,
        acc: acc,
        name : route.params.name
      };
      await AsyncStorage.setItem('@storage_profile', JSON.stringify(User))
      setleader(true)
      alert('Profile was saved')
     }else{
      setleader(false)
      await AsyncStorage.removeItem('@storage_profile')
      alert('Profile was removed')
     }
    } catch (e) {
      alert('ERROR')
    }
  }


  return (
    <LinearGradient colors={['#121212', '#141414', '#131313']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.View2}>
    <SafeAreaView style={styles.View}>
          <View style={styles.containerHeader}>
              <Animatable.View delay={300} animation="fadeInLeft" style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'trasparent'}}>
                <TouchableOpacity style={{paddingRight:10}} onPress={ () => SetUser(route.params.name)} >
                  {leader ? 
                  <IconF name="star" size={25} color="#e6e600" /> : <IconF name="star-o" size={25} color="#e6e600" />}
                </TouchableOpacity>
                <Text style={styles.title} delay={300} animation="fadeInUp">{route.params.name}</Text>
              </Animatable.View>
          </View>
          <ScrollView contentContainerStyle={{paddingBottom: 60, alignItems: 'center',justifyContent:'center'}} style={styles.scroolviewHome}>
              {arr.reverse().map((item,index) =>
                    <View style={styles.shadowview} key={index}>
                        <LinearGradient colors={['#000000', '#020202', '#080808', '#141414', '#1C1C1C', '#232323']} start={{ x: -1, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cardinfos}> 
                          <View style={{ alignItems: 'center', margin: 10 }}>
                              <Text style={styles.viewmatchestext}>{item.name}</Text>
                          </View>
                          <View style={styles.cardmatchesmain}>
                                <View style={styles.viewinfosdata}>
                                  <View
                                    style={[{ backgroundColor: '#202020', borderWidth: item.wins > 300 && item.wins <= 1000 ? 2 : item.wins >= 1000 ? 3 : 0, borderColor: item.wins > 300 && item.wins <= 1000 ? '#9ac5db' : item.wins >= 1000 ? '#2061c9' : '#202020' }, styles.cardinfosdata]}
                                  >
                                    <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestextinfo}>{item.wins}</Text></View>
                                    <View style={styles.viewmatchestitle2}><Text style={styles.viewmatchestext}>Wins</Text></View>
                                  </View>
                                  <View
                                    style={[{ backgroundColor: '#202020' , borderWidth: item.kdRatio.toFixed(2) > 1.00 && item.kdRatio.toFixed(2) <= 2.00 ? 2 : item.kdRatio.toFixed(2) > 2.0 ?  3: 0 , borderColor: item.kdRatio.toFixed(2) > 1.00 && item.kdRatio.toFixed(2) <= 2.00 ? '#9ac5db' : item.kdRatio.toFixed(2) > 2.0 ?  '#2061c9': '#202020' }, styles.cardinfosdata]}
                                  >
                                    <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestextinfo}>{item.kdRatio.toFixed(2)}</Text></View>
                                    <View style={styles.viewmatchestitle2}><Text style={styles.viewmatchestext}>KD</Text></View>
                                  </View>
                                  <View
                                    style={[{ backgroundColor: '#202020' , borderWidth: item.kills > 500 && item.kills <= 1500 ? 2 : item.kills > 1500 ? 3 : 0 ,borderColor:item.kills > 500 && item.kills <= 1500 ? '#9ac5db' : item.kills > 1500 ? '#2061c9' : '#202020' }, styles.cardinfosdata]}
                                  >
                                    <View style={styles.viewmatchestitle}><Text style={styles.viewmatchestextinfo}>{item.kills.toLocaleString('en-US')}</Text></View>
                                    <View style={styles.viewmatchestitle2}><Text style={styles.viewmatchestext}>Kills</Text></View>
                                  </View>
                                </View>
                          </View>
                        </LinearGradient> 
                    </View>
              )}
          </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}


const Tab = createBottomTabNavigator();

const SecondPage = ({route}) => {
  const responseJson = route.params.responseJson;
  const matches = route.params.matches;
  const name = route.params.name;
  const profile = route.params.profile;
  const acc = route.params.acc;
  const game = route.params.game;

  const [fontsLoaded] = useFonts({
    'Montserrat': require('../../assets/fonts/Montserrat-Light.ttf'),
  });
  

  return (
      <Tab.Navigator initialRouteName="Home" screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopColor: 'transparent' ,
          borderTopLeftRadius:21, 
          borderTopRightRadius:21,
          backgroundColor:"#000000",
          opacity:0.95,
          position:'absolute',
          bottom: 0,
          padding:10,
          width: widthscreen,
          zIndex: 8          
         }
      }}>
        <Tab.Screen name="LeaderBoard" component={LeaderBoard} initialParams={{name:name}} options={{
          tabBarIcon :({size,color})=> (
           <Icon
            name="podium"
            size={size}
            color={color}
           />

          )
          }} />
        <Tab.Screen name="Home" component={Homeuser} initialParams={{responseJson: responseJson,name:name,profile:profile,acc:acc,game:game}} options={{
          tabBarLabel:'',
          tabBarIcon :({size,color})=> (
           <View style={styles.container}>
            <IconF
              name="user-o"
              size={size}
              color={color}
              style={{marginBottom : 18}}
            />
           </View>

          ),
          tabBarLabel: ({ tintColor, focused }) =>
                    focused ? ( <Text style={{color:'white',fontSize:10,marginBottom : 10}}>Stats</Text>) :
                        (<Text style={{ fontWeight: 'normal',fontSize:10,color:'#b2b2b2',marginBottom : 10 }} >Stats</Text>),
          }}/>


        <Tab.Screen name="Recent matches" component={MatchesScreen} initialParams={{matches: matches,name:name}} options={{
          tabBarIcon :({size,color})=> (
           <Icon
            name="timeline-text"
            size={size}
            color={color}
           />

          )
          }}/>

          
      </Tab.Navigator>
  );
}
export default SecondPage;

const styles = StyleSheet.create({

  View:{
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    paddingTop: Platform.OS === 'android' ? 30 : 0
  },
  View2:{
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    
  },
  containerHeaderstars:{
    marginTop:'10%',
    marginBottom:10,
    backgroundColor: 'transparent',
    padding: 8,
    alignItems:'center',
    justifyContent:'center',
    display:'flex',
    flexDirection:'row'
  },
  containerHeader:{
    width:'100%',
    margin:10,
    borderRadius:15,
    backgroundColor: 'transparent',
    alignItems:'center',
    justifyContent:'center' ,
    opacity:0.9
  },
  containerHeadermatches:{
    marginTop:'10%',
    marginBottom:5,
    backgroundColor: 'transparent',
    alignItems:'center',
    justifyContent:'center' 
  },
  title:{
    color:'#fff',
    fontSize:17,
    fontWeight:'bold'
  } ,
  flexinfoleader: {display: 'flex',alignContent:'center',justifyContent:'center' , margin: 8,maxWidth:'50%',width:'50%' },
  headertitles :{ fontSize: 15, fontWeight: '600',marginBottom:20,color:'white'},
  headertitlesleaderword :{ fontSize:18, fontWeight: 'bold',color:'white',alignContent:'center',justifyContent:'center'},
  headertitlesleaderwordICON :{ alignContent:'center',justifyContent:'center',paddingRight:10},
  headertitlesleader :{ fontSize: 15, fontWeight: '600',color:'white'},
  titles : { margin: 10, color: '#ffffff', textTransform: 'uppercase',fontWeight: '600' },
  cardcontent :{display:'flex',justifyContent:'center',alignItems : 'center' , paddingTop : 8, paddingBottom : 8,alignSelf : 'center'},
  cardcontentkd :{display:'flex',justifyContent:'center',alignItems : 'center' , paddingTop : 12, paddingBottom : 8,alignSelf : 'center'},
  safeAreaView: {
    flex: 1,
    width: widthscreen,
    backgroundColor:'#ededed',
  },
  scroolview: {
    width: '100%',
  },
  scroolviewHome: {
    width:'100%',
  },
  container1: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    margin: 10
  },
  card1: {
    width: widthscreen / 4  ,
    backgroundColor: 'white',
    borderRadius : 20,
    height:100,
    margin:1
  },
  card2: {
    width: widthscreen / 3  ,
    backgroundColor: 'white',
    borderRadius : 20,
    margin:10
  },

  viewmatchesdata:{
    width: '100%',
    display : 'flex',
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    margin:10,
  },
  viewleaderdata:{
    width: '100%',
    display : 'flex',
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    margin:10,
  },
  viewinfosdata:{
    display : 'flex',
    flexDirection : 'row',
    justifyContent:'center',
    alignItems:'center'
  },
  cardmatchesmain:{
    display : 'flex',
    flexDirection : 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardmatchesdata2:{
    width: '100%',
    display : 'flex',
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  cardleaderdata:{
    maxWidth: widthscreen,
    display : 'flex',
    flexDirection : 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  viewleaderpos:{
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding:10,
    borderRadius:5,
    backgroundColor:'#282a2e'
  },
  viewmatchestitle:{
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding:10,
  },

  viewleadertitle2:{
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding:10,
    margin:5,
    borderWidth:1,
    borderColor:'#4c4c4c',
  },

  viewleadertitle:{
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding:5
  },
  viewmatchestitle2:{
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    lineHeight:'12px',
    opacity:0.5,
    fontWeight:'700'
  },
  viewmatchestext:{
    color:'white',
    fontSize: 12,
    fontWeight:'600',
    textShadowColor: 'rgb(255 255 255 / 70%)',
    textShadowOffset: {height: 2},
    textShadowRadius: 10
  },
  viewmatchestextinfo:{
    color:'white',
    fontSize: 18,
    fontWeight:'600',
    textShadowColor: 'rgb(255 255 255 / 70%)',
    textShadowOffset: {height: 2},
    textShadowRadius: 10
  },
  viewleadertextinfo :{
    color:'white',
    fontSize: 18,
    fontWeight:'700',
    textShadowColor: 'rgb(255 255 255 / 70%)',
    textShadowOffset: {height: 2},
    textShadowRadius: 10
  },
  viewmatchestextinfoleader:{
    color:'white',
    fontSize: 16,
    fontWeight:'600',
    textShadowColor: 'rgb(255 255 255 / 70%)',
    textShadowOffset: {height: 2},
    textShadowRadius: 10
  }
  ,
  cardmatches: {
    display : 'flex',
    marginLeft:10,
    marginRight:10,
    color:'withe',
    borderRadius : 15,
    padding:5
  },
  cardleader: {
    display : 'flex',
    color:'withe',
    borderRadius : 10,
    Width : '100%'
  },
  cardinfoscard: {
    color:'withe',
    shadowColor: "#000",
    shadowOffset:{
    width: 0,
    height: 10,
    },
    shadowOpacity: 0.27,
    shadowRadius: 10,
    elevation: 15,
    borderRadius : 20,
    maxWidth : widthscreen
  },
  cardinfos: {
    display : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    margin:10,
    padding:10,
    color:'withe',
    borderRadius : 10,
    maxWidth : widthscreen,
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
  shadowview2:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation:20,
  },
  cardinfosdata: {
    width:100,
    borderRadius : 10,
    margin:10,
    padding:8,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8.5,
    elevation: 13,
  },
  cardmatchesdata: {
    width:85,
    borderRadius : 10,
    margin:5,
    padding:5,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8.5,
    elevation: 13,
  },
  cardleaderdatauser: {
    borderRadius : 10,
    margin:5,
    padding:2
  },
  cardleaderdatael: {
    borderRadius : 10,
    padding:5
  },

  cardleaderdatakills: {
    height: 100,
    width: 100,
    borderRadius : 50,
    padding:20,
    justifyContent:'center',
    alignItems:'center',
    borderColor:'red'
  },
  Card:{
    width:'30%',
    height:100,
    backgroundColor : 'white',
  },
  container:{
    width:70,
    height:70,
    backgroundColor:'black',
    justifyContent:'center',
    alignItems:'center',
    borderRadius : 50,
    borderColor :'#4287f5',
    borderWidth:4,
  }

})

