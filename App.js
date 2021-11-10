import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { gql, useQuery } from '@apollo/client';
import RNShake from 'react-native-shake';

const GET_PLANETS = gql`
  {
    allPlanets {
      planets {
        name
        films: filmConnection {
          data: films {
            title
          }
        }
      }
    }
  }
`;

const App: () => Node = () => {
  const { loading, error, data } = useQuery(GET_PLANETS);
  const [planet, setPlanet] = useState([]);

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      const random = Math.floor(Math.random() * data.allPlanets.planets.length)
      setPlanet(data.allPlanets.planets[random])
    })
    return () => {
      subscription.remove()
    }
  }, [data])

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='large' color='#000' />
      <Text style={styles.loaderText}>Loading data...</Text>
    </View>
  );
  if (error) return <Text>`Error! ${error.message}`</Text>;
  if (planet.length === 0) {
    return (
      <View style={styles.shakeContainer}>
        <Image source={require('./shake.jpg')} />
        <Text style={styles.shakeText}>Shake your device!</Text>
      </View>

    )
  }
  return (
    <View
      style={styles.container}>
      <Text style={styles.planetName}>{planet.name}</Text>
      {planet.films ? <View style={styles.filmsContainer}>
        <Text style={styles.filmsName}>{planet.films.data.length > 0 ? planet.films.data.map((films, index, filmsData) => `${films.title}${index === (filmsData.length - 1) ? '' : ', '}`) : 'None'}</Text>
      </View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shakeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loaderText: {
    color: '#000',
    marginTop: 20
  },
  shakeText: {
    color: '#000',
    marginTop: 20,
    fontSize: 20
  },
  filmsContainer: {
    paddingHorizontal: 20,
    marginTop: 20
  },
  planetName: {
    fontSize: 60,
    color: '#000'
  },
  filmsName: {
    textAlign: 'center'
  }
});

export default App;
