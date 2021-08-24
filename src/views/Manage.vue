<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong" />
      </div>

      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t('manage.my_songs') }}</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item
              v-for="(song, i) in songs"
              :key="song.docID"
              :song="song"
              :index="i"
              :updateSong="updateSong"
              :removeSong="deleteSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import store from '@/store';
import AppUpload from '@/components/Upload.vue';
import CompositionItem from '@/components/CompositionItem.vue';
import { songsCollection, auth } from '@/includes/firebase';

export default {
  name: 'manage',
  data() {
    return { songs: [], unsavedFlag: false };
  },
  components: { AppUpload, CompositionItem },
  created() {
    // load the data before the component loads, the component
    // will not wait for the promise to end before loading the component
    return Promise.resolve(
      songsCollection.where('uid', '==', auth.currentUser.uid).get()
    ).then((snapshot) => {
      snapshot.forEach((document) => {
        this.addSong(document);
      });
    });
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    deleteSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(document) {
      const song = { ...document.data(), docID: document.id };
      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    // detect if user if filling out a form
    if (!this.unsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const leave = confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      // If false, next will not trigger
      next(leave);
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads();
  //   next();
  // },
  // beforeRouteEnter(to, from, next) {
  //   console.log('Manage beforeRouteEnter Guard');
  //   if (store.state.userLoggedIn) {
  //     // Continue as usual
  //     next();
  //   } else {
  //     // Redirect back home
  //     next({ name: 'home' });
  //   }
  // },
};
</script>
