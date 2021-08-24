<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          id="play-button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none"
          @click.prevent="toggleSong"
        >
          <i
            class="fas"
            :class="{ 'fa-play': !playing, 'fa-pause': playing }"
          ></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(1, 'currency') }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{
            $tc('song.comment_count', song.comment_count, {
              count: song.comment_count,
            })
          }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-5 mb-4"
            v-if="show_alert"
            :class="alert_variant"
          >
            {{ alert_msg }}
          </div>
          <vee-form v-if="userLoggedIn" @submit="addComment">
            <vee-field
              name="comment"
              type="textarea"
              rules="required|min:3"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />

            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="in_submission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="(comment, index) in sortedComments"
        :key="index"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { songsCollection, auth, commentsCollection } from '@/includes/firebase';

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      comments: [],
      show_alert: false,
      in_submission: false,
      alert_variant: 'bg-blue-500',
      alert_msg: 'Your comment is being submitted.',
      sort: '1',
    };
  },
  computed: {
    ...mapState({
      userLoggedIn: (state) => state.player.userLoggedIn,
    }),
    ...mapGetters(['playing']),
    sortedComments() {
      // computed properties cannot change data
      // bypass this by calling the slice method which returns
      // a new array
      return this.comments.slice().sort((a, b) => {
        // sort = 1 latest to oldest - descending
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        // sort = 2 oldest to latest - ascending
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  methods: {
    ...mapActions(['newSong', 'toggleAudio']),
    addComment(values, { resetForm }) {
      this.show_alert = true;
      this.in_submission = true;
      this.alert_variant = 'bg-blue-500';
      this.alert_msg = 'Your comment is being submitted.';
      console.log(values);

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(), // firebase can't store date objects
        sid: this.$route.params.id, // links comment to a song
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid, // precaution in case name changes
      };

      return Promise.resolve(commentsCollection.add(comment))
        .then(() => {
          this.show_alert = true;
          this.in_submission = false;
          this.alert_variant = 'bg-green-500';
          this.alert_msg = 'Comment Added!';

          // safer to increment the long way because of white space issues
          this.song.comment_count += 1;
          return songsCollection
            .doc(this.$route.params.id)
            .update({ comment_count: this.song.comment_count });
        })
        .then(() => {
          this.getComments();
          resetForm();
        })
        .catch((err) => {
          console.log(err);
          this.show_alert = true;
          this.in_submission = false;
          this.alert_variant = 'bg-red-500';
          this.alert_msg = 'Something went wrong, please try again later.';
        });
    },
    getComments() {
      return Promise.resolve(
        commentsCollection.where('sid', '==', this.$route.params.id).get()
      ).then((snapshots) => {
        snapshots.forEach((doc) => {
          this.comments.push({
            docID: doc.id,
            ...doc.data(),
          });
        });
      });
    },
    toggleSong() {
      if (!this.playing) {
        this.newSong(this.song);
      } else {
        this.toggleAudio();
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    return Promise.resolve(songsCollection.doc(to.params.id).get()).then(
      (docSnapshot) => {
        next((vm) => {
          // if the song has been deleted, firebase will not throw an error
          // instead check if it snapshot exists, and redirect home if not.
          if (!docSnapshot.exists) {
            vm.$router.push({ name: 'home' });
            return Promise.resolve();
          }
          // eslint-disable-next-line no-param-reassign
          vm.song = docSnapshot.data();

          const { sort } = vm.$route.query;
          // eslint-disable-next-line no-param-reassign
          vm.sort = sort === '1' || sort === '2' ? sort : '1';

          return vm.getComments();
        });
      }
    );
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) return;
      this.$router.push({
        query: { sort: newVal },
      });
    },
  },
};
</script>
