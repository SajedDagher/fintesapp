import { Platform } from 'react-native';
import AppleHealthKit from 'react-native-health';
import GoogleFit from 'react-native-google-fit';

const PERMS = AppleHealthKit.Constants.Permissions;

export const initHealthKit = async () => {
  try {
    if (Platform.OS === 'ios') {
      const options = {
        permissions: {
          read: [PERMS.Steps],
          write: []
        }
      };
      
      return new Promise((resolve, reject) => {
        AppleHealthKit.initHealthKit(options, (err) => {
          if (err) {
            console.log('Error initializing HealthKit: ', err);
            reject(err);
          } else {
            resolve(true);
          }
        });
      });
    } else if (Platform.OS === 'android') {
      await GoogleFit.checkIsAuthorized();
      if (!GoogleFit.isAuthorized) {
        const options = {
          scopes: [
            'https://www.googleapis.com/auth/fitness.activity.read',
          ],
        };
        const authResult = await GoogleFit.authorize(options);
        return authResult.success;
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('HealthKit/GoogleFit init error:', error);
    return false;
  }
};

export const getTodaySteps = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (Platform.OS === 'ios') {
      return new Promise((resolve) => {
        AppleHealthKit.getStepCount(
          { startDate: today.toISOString(), endDate: tomorrow.toISOString() },
          (err, results) => {
            if (err) {
              console.log('Error getting steps: ', err);
              resolve(0);
            } else {
              resolve(results.value || 0);
            }
          }
        );
      });
    } else if (Platform.OS === 'android') {
      const opt = {
        startDate: today.toISOString(),
        endDate: tomorrow.toISOString(),
        bucketUnit: 'DAY',
        bucketInterval: 1,
      };
      const res = await GoogleFit.getDailyStepCountSamples(opt);
      if (res.length > 0 && res[0].steps.length > 0) {
        return res[0].steps[0].value;
      }
      return 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting steps:', error);
    return 0;
  }
};

export const startStepTracking = (callback) => {
  if (Platform.OS === 'ios') {
    AppleHealthKit.initStepCountObserver({}, () => {
      getTodaySteps().then(steps => callback(steps));
    });
  } else if (Platform.OS === 'android') {
    GoogleFit.startRecording((callback) => {
      if (callback.recording) {
        getTodaySteps().then(steps => callback(steps));
      }
    });
  }
};