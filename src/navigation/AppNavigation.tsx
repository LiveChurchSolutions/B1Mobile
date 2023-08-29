import * as React from 'react';
import {Text, Linking, Platform} from 'react-native'
import { Dimensions,PixelRatio, } from 'react-native';
import { NavigationContainer, getStateFromPath } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SplashScreen from '../screens/SplashScreen';
import { WebsiteScreen } from '../screens/WebsiteScreen';
import { CustomDrawer } from '../components';
import { ChurchSearch } from '../screens/ChurchSearch';
import { LoginScreen } from '../screens/LoginScreen';
import { HouseholdScreen } from '../screens/checkin/HouseholdScreen';
import { GroupsScreen } from '../screens/checkin/GroupsScreen';
import CheckinCompleteScreen from '../screens/checkin/CheckinCompleteScreen';
import { ServiceScreen } from '../screens/checkin/ServiceScreen';
import { MembersSearch } from '../screens/MembersSearch';
import { MemberDetailScreen } from '../screens/MemberDetailScreen';
import DonationScreen from '../screens/DonationScreen';
import { globalStyles,UserHelper } from '../helpers';
import { RegisterScreen } from '../screens/RegisterScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { VotdScreen } from '../screens/VotdScreen';
import { SearchUserScreen } from '../screens/SearchUserScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import MyGroups from '../screens/MyGroups';
import GroupDetails from '../screens/GroupDetails';

const AppNav = createStackNavigator();
const AuthNav = createStackNavigator();
const Drawer = createDrawerNavigator();

const linking={
  prefixes:[`https://*.b1.church/member`],
  config:{
    screens:{
      MainStack:{
        screens:{
          Donation:{
            path: 'donation' 
          },
          VotdScreen :{
            path:'votd'
          },
          ServiceScreen: {
            path: 'checkin',
          },
          MembersSearch:{
            path:'directory'
          },
          MyGroups:{
            path:'groups'
          },
          LessonsScreen:{
            path:'lessons'
          }
        },

      }
    }
  }
  
}
const MainStack = () => {

  const [dimension, setDimension] = React.useState(Dimensions.get('screen'));
  

  React.useEffect(() => {
      const navigateToInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL()
      console.log("initial url ---->", initialUrl)
      if (initialUrl) {
      await Linking.openURL(initialUrl)
      }
    }
    navigateToInitialUrl()
  }, [])

  const wd = (number: string) => {
    let givenWidth = typeof number === "number" ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((dimension.width * givenWidth) / 100);
  };
  const hd = (number: string) => {
    let givenWidth = typeof number === "number" ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((dimension.height * givenWidth) / 100);
  };

  React.useEffect(() => {
    Dimensions.addEventListener('change', () => {
      const dim = Dimensions.get('screen')
      setDimension(dim);
    })
  }, [dimension])
 //Note:  By not combining the Website screen users can toggle between them without their current page on each tab being lost

  return (
    <Drawer.Navigator initialRouteName={'WebsiteScreen'} drawerType={'slide'} drawerStyle={[globalStyles.drawerStyle,{width:wd('60%'),height:hd('100%')}]} drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen name={'Dashboard'} component={DashboardScreen} />
      <Drawer.Screen name={'BibleScreen'} component={WebsiteScreen} />
      <Drawer.Screen name={'VotdScreen'} component={VotdScreen}  />
      <Drawer.Screen name={'LessonsScreen'} component={WebsiteScreen} />
      <Drawer.Screen name={'StreamScreen'} component={WebsiteScreen} />
      <Drawer.Screen name={'WebsiteScreen'} component={WebsiteScreen} />
      <Drawer.Screen name={'PageScreen'} component={WebsiteScreen} />
      <Drawer.Screen name={'ChurchSearch'} component={ChurchSearch} />
      <Drawer.Screen name={'SearchMessageUser'} component={SearchUserScreen} />
      <Drawer.Screen name={'MembersSearch'} component={MembersSearch} />
      <Drawer.Screen name={'MemberDetailScreen'} component={MemberDetailScreen} />
      <Drawer.Screen name={'ServiceScreen'} component={ServiceScreen} />
      <Drawer.Screen name={'HouseholdScreen'} component={HouseholdScreen} />
      <Drawer.Screen name={'GroupsScreen'} component={GroupsScreen} />
      <Drawer.Screen name={'CheckinCompleteScreen'} component={CheckinCompleteScreen} />
      <Drawer.Screen name={'DonationScreen'} component={DonationScreen} />
      <Drawer.Screen name={'MyGroups'} component={MyGroups} />
      <Drawer.Screen name={'GroupDetails'} component={GroupDetails} />
    </Drawer.Navigator>
  );
}

const AuthStack = () => {
  return (
    <AuthNav.Navigator headerMode="none" initialRouteName={'LoginScreen'}>
      <AuthNav.Screen name={'LoginScreen'} component={LoginScreen} />
      <AuthNav.Screen name={'RegisterScreen'} component={RegisterScreen} />
    </AuthNav.Navigator>
  );
}

const AppNavigation = (props: {}) => {
  return (
    <NavigationContainer linking={linking}>
      <AppNav.Navigator headerMode="none"  initialRouteName='SplashScreen' >
        <AppNav.Screen name="SplashScreen" component={SplashScreen} />
        <AppNav.Screen name="AuthStack" component={AuthStack} />
        <AppNav.Screen name="MainStack" component={MainStack} />
        <AppNav.Screen name={'MessagesScreen'} component={MessagesScreen} />
      </AppNav.Navigator>
    </NavigationContainer>
  );
};

export default (AppNavigation);