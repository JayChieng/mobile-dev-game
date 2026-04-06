import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ onStart }) => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        
        {/* NEW TOP SECTION */}
        <View style={styles.titleContainer}>
          <Text style={styles.superTitle}>PHYSICS</Text>
          <Text style={styles.subTitle}>IMPACT</Text>
          <View style={styles.accentLine} />
        </View>

        {/* BOTTOM CONTENT (KEPT FROM ORIGINAL) */}
        <View style={styles.bottomContent}>
          <View style={styles.contentSection}>
            <Text style={styles.sectionHeader}>Developed By:</Text>
            <Text style={styles.creatorName}>Thi Bich Tien Bui</Text>
            <Text style={styles.creatorName}>Leonardo Naas Mohamed Tawfik</Text>
            <Text style={styles.creatorName}>Chieng Ngoc Cuong</Text>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.sectionHeader}>Instructions:</Text>
            <Text style={styles.instructionText}>
              Drag the paddle ( ← → ) to bounce the ball.{"\n"}
              Break all the blocks to win!
            </Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Text style={styles.startButtonText}>START GAME</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F0FDFA', // Soft Mint Background
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 60,
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  superTitle: {
    fontSize: 56,
    fontWeight: '900',
    color: '#0D9488', // Deep Teal
    letterSpacing: 4,
  },
  subTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#0F172A', // Navy Slate
    letterSpacing: 10,
    marginTop: -10,
  },
  accentLine: {
    width: 80,
    height: 4,
    backgroundColor: '#14B8A6',
    marginTop: 15,
    borderRadius: 2,
  },
  bottomContent: {
    width: '100%',
    alignItems: 'center',
  },
  contentSection: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  creatorName: {
    fontSize: 18,
    color: '#0F172A',
    marginVertical: 2,
    fontWeight: '500',
  },
  instructionText: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#0F172A', // High contrast button
    paddingVertical: 18,
    width: width * 0.75,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    marginTop: 10,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default WelcomeScreen;