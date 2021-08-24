import { auth, usersCollection } from '@/includes/firebase';

export default {
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  actions: {
    initLogin({ commit }) {
      // retrieve current auth status
      const user = auth.currentUser;
      // check if logged in
      if (user) {
        // Set logged in variable
        commit('toggleAuth');
      }
    },
    register({ commit }, payload) {
      let userCred;
      return Promise.resolve(
        auth.createUserWithEmailAndPassword(payload.email, payload.password)
      )
        .then((result) => {
          userCred = result;
          // Using doc with a custom id will create a user with the same id as firebase
          return usersCollection.doc(userCred.user.uid).set({
            name: payload.name,
            email: payload.email,
            age: payload.age,
            birthday: payload.birthday,
            country: payload.country,
          });
        })
        .then(() => {
          return userCred.user.updateProfile({ displayName: payload.name });
        })
        .then(() => {
          // ctx has been destructured to only use the commit function
          // mutation changes only present with actions
          commit('toggleAuth');
        });
    },
    login({ commit }, payload) {
      return Promise.resolve(
        auth.signInWithEmailAndPassword(payload.email, payload.password)
      ).then(() => {
        commit('toggleAuth');
      });
    },
    signOut({ commit }) {
      return Promise.resolve(auth.signOut()).then(() => {
        commit('toggleAuth');

        // redirect in action without importing router
        // better to leave it in component
        // if (payload.route.meta.requiresAuth) {
        //   // Only redirect if we are on a page that should be hidden
        //   payload.router.push({ name: 'home' }); // promise
        // }
      });
    },
  },
};
