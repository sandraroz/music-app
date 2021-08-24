import { cloneDeep } from 'lodash';
import { createStore } from 'vuex';
import auth from '@/store/modules/auth';
import player from '@/store/modules/player';

jest.mock('@/includes/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: () => Promise.resolve(),
  },
}));

describe('VUex Store', () => {
  test('toggleAuth mutation sets userLoggedIn to tru', () => {
    // fresh instance of the store with only auth module
    const clonedAuth = cloneDeep(auth);

    const store = createStore({
      modules: { auth: clonedAuth },
    });

    expect(store.state.auth.userLoggedIn).not.toBe(true);

    store.commit('toggleAuth');

    expect(store.state.auth.userLoggedIn).toBe(true);
  });

  test('login actions gets userLoggedIn to true', () => {
    // for async functions, announce how many assertions are made in this test
    expect.assertions(2);

    const clonedAuth = cloneDeep(auth);

    // fresh instance of the store with only auth module
    const store = createStore({
      modules: { auth: clonedAuth },
    });

    expect(store.state.auth.userLoggedIn).toBe(false);

    return Promise.resolve(
      store.dispatch('login', { email: '', password: '' })
    ).then(() => {
      expect(store.state.auth.userLoggedIn).toBe(true);
    });
  });

  test('playing returns true if audio is playing', () => {
    const state = {
      // state object with function playing must be mocked
      sound: {
        playing: () => true,
      },
    };

    const result = player.getters.playing(state);

    expect(result).toEqual(true);
  });
});
