import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { LaunchType, RootStackParamList } from '../../Navigation';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { gql, useQuery } from '@apollo/client'
import AppLoading from 'expo-app-loading';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';

const LAUNCHES_QUERY = gql`
  query Launches {
    launchesPast(limit: 10) {
      mission_name
      launch_date_local
      launch_site {
        site_name_long
      }
      links {
        article_link
        flickr_images
      }
      rocket {
        rocket_name
      }
    }
  }
`;

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const Home = ({ navigation }: Props) => {
  const { data, loading } = useQuery(LAUNCHES_QUERY)

  if (loading) {
    return <AppLoading />
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Latest Launches</Text>
      <FlatList
        data={data.launchesPast}
        renderItem={({ item }: { item: LaunchType }) => (
          <View>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.push('Launch', { launch: item })}
            >
              <Image
                source={{ uri: item.links.flickr_images[0] }}
                style={styles.cardImage}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.missionTitle}>{item.mission_name}</Text>
                <Text style={styles.missionDate}>{moment(item.launch_date_local).startOf('day').fromNow()}</Text>
              </View>
              <View style={styles.linkContainer}>
                <Icon style={styles.navigationIcon} name="chevron-right" />
              </View>
            </TouchableOpacity>
          </View>

        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: 'bold', paddingVertical: 15 },
  card: { 
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset:{
      width: 0,
      height: 1,
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
      elevation: 1
    },
  },
  cardImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    marginRight: 15
  },
  infoContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center'
  },
  missionTitle: {
    fontWeight: 'bold',
    fontSize: 16
  },
  missionDate: {
    color: '#999',
    fontSize: 12
  },
  linkContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  navigationIcon: {
    fontSize: 20,
    paddingHorizontal: 10
  }
})

export default Home;