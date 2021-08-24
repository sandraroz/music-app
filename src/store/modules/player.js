import { Howl } from 'howler';
import helper from '@/includes/helper';

export default {
  state: {
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },
  mutations: {
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url], // location of audio file
        html5: true, // audio api library loaded
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${(100 * state.sound.seek()) /
        state.sound.duration()}%`;
    },
  },
  actions: {
    newSong({ commit, state, dispatch }, payload) {
      // Removes the instance when we start playing the song multiple times
      // This is to avoid memory leaks
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }

      commit('newSong', payload);
      state.sound.play();

      state.sound.on('play', () => {
        // similar to set interval function
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    toggleAudio({ state }) {
      console.log('audio toggle');
      // if the function exists, howl was initialized
      if (!state.sound.playing) {
        return;
      }

      // checks if audio is already playing
      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ commit, state, dispatch }) {
      // recursive function that changes the seek/duration times
      commit('updatePosition');

      // Recursion if song is playing
      if (state.sound.playing) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;
      }

      // only move ball if a song is playing
      // click is registered relative to the document,
      // the timeline is in the middle of the document, we need
      // to subtract the distance between doc and timeline object
      const { x, width } = payload.currentTarget.getBoundingClientRect();
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;
      // update position
      state.sound.seek(seconds);

      // Listens for the event when audio changed position and starts playing again
      state.sound.once('seek', () => {
        dispatch('progress');
      });
    },
  },
};
