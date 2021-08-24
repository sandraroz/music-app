<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_msg }}
      </div>
      <vee-form
        :validation-schema="schema"
        @submit="edit"
        :initial-values="song"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            type="text"
            name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>

        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>

        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="showForm = false"
          :disabled="in_submission"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from '@/includes/firebase';

export default {
  name: 'CompositionItem',
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required|min:3|max:100',
        genre: 'alpha_spaces|min:3|max:100',
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_msg: 'Please wait! Updating song info.',
    };
  },
  props: {
    song: { type: Object, required: true },
    updateSong: { type: Function, required: true },
    index: { type: Number, required: true },
    removeSong: { type: Function, required: true },
    updateUnsavedFlag: { type: Function },
  },
  emits: ['song-update'],
  methods: {
    edit(values) {
      console.log(values);
      // form in submission
      this.show_alert = true;
      this.in_submission = true;
      this.variant = 'bg-blue-500';
      this.alert_msg = 'Please wait! Updating song info.';

      return Promise.resolve(
        songsCollection.doc(this.song.docID).update(values)
      )
        .then(() => {
          this.updateSong(this.index, values);
          this.updateUnsavedFlag(false);

          console.log('update success');
          this.in_submission = false;
          this.alert_variant = 'bg-green-500';
          this.alert_msg = 'Sucess!';
        })
        .catch((err) => {
          this.show_alert = true;
          this.in_submission = false;
          this.variant = 'bg-red-500';
          this.alert_msg = 'Something went wrong. Try again later.';

          console.log(err);
        });
    },
    deleteSong() {
      // Delete from storage and from database
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.original_name}`);

      return Promise.resolve(songRef.delete())
        .then(() => {
          return songsCollection.doc(this.song.docID).delete();
        })
        .then(() => {
          this.removeSong(this.index);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
