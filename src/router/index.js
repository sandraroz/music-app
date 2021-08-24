import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const Home = () => import('@/views/Home.vue');
const About = () => import('@/views/About.vue');
const Manage = () =>
  import(/* webpackChunkName: "groupedChunk" */ '@/views/Manage.vue');
const Song = () =>
  import(/* webpackChunkName: "groupedChunk" */ '@/views/Song.vue');

// Array of paths a user can access
const routes = [
  {
    name: 'home', // named property
    path: '/', // path that shows up after the example.com
    component: Home, // name of the imported component
  },
  {
    name: 'about',
    path: '/about',
    component: About,
  },
  {
    name: 'manage',
    // alias: '/manage',
    path: '/manage-music',
    meta: {
      requiresAuth: true,
    },
    component: Manage,
    beforeEnter: (to, from, next) => {
      console.log('Manage Route Guard');
      next();
    },
  },
  {
    path: '/manage',
    redirect: { name: 'manage' },
  },
  { name: 'song', path: '/song/:id', component: Song },
  {
    // If no records found, this is checked last.
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

// Plugin argument that must be registered with the app
const router = createRouter({
  // let's you interact with the browser history without having to refresh the page
  // must define the BASE_URL in vue cli, the default is just `/`
  // the hash part prevents the page from reloading on page changes
  // adds a /#/ value to the address bar
  history: createWebHistory(process.env.BASE_URL),
  routes,

  // applies class name to currently navigated links,
  // tailwind css is applied to class names
  // therefore we can change the color
  // to prevent this add this
  // exact-active-class="no-active" to the router-link tag
  linkExactActiveClass: 'text-yellow-500',
});

// Perform this before calling any route in the app.
// To: Where we are going
// From: Where we want to go
// Next: A function that must be called to load the component
router.beforeEach((to, from, next) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.state.auth.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
});

export default router;
