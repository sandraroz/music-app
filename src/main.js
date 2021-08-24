import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/tailwind.css';
// import css file with styles not covered by tailwind
import './assets/main.css';
import VeeValidatePlugin from './includes/validation';
import { auth } from './includes/firebase';
import Icon from './directives/icons';
import i18n from './includes/i18n';
import './registerServiceWorker';
import GlobalComponents from './includes/_global';
import ProgressBar from './includes/progress-bar';
import 'nprogress/nprogress.css';

ProgressBar(router);

let app;
// to make sure our app is loaded after firebase is ready, wait for the event
// we also need to prevent this event from resetting our app once it initialized
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    // Used for translation
    app.use(i18n);

    // Part of vuex, this is a data store/container
    // Injects methods used to communicate with state
    app.use(store);

    // Part of vue router
    app.use(router);

    // The form validation custom plugin
    app.use(VeeValidatePlugin);

    //
    app.use(GlobalComponents);

    // register custom directives
    app.directive('icon', Icon);

    app.mount('#app');
  }
});
