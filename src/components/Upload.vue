<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase';

export default {
  name: 'Upload',
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  props: ['addSong'],
  methods: {
    upload($event) {
      this.is_dragover = false;
      // In the event that we used native upload (button) the dataTransfer
      // object will not be present.
      // Converts and object array into an actual array
      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

      files.forEach((file) => {
        // validate individual files
        if (file.type !== 'audio/mpeg') {
          console.log('Rejected: Bad file type');
          return;
        }

        // If user is offline
        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400',
          });
          console.log('Offline upload not supported');
          return;
        }

        // We need to tell firebase where to upload the file, we only have
        // access to one bucket, to get it's ref number, we do this.
        const storageRef = storage.ref(); // 'music-c7c39.appspot.com',
        // We also need to create a directory to upload to.
        const songsRef = storageRef.child(`songs/${file.name}`); // 'music-c7c39.appspot.com/songs/example.mp3'
        const task = songsRef.put(file);

        // The push functions returns the length of uploads array, subtract 1 to get index of item
        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            variant: `bg-blue-400`,
            icon: 'fas fa-spinner fa-spin', // font awesome pack
            text: '',
          }) - 1;

        // The upload task emits multiple events based on its status

        task.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].current_progress = progress;
          },
          // On upload error
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400';
            this.uploads[uploadIndex].icon = 'fas fa-times';
            this.uploads[uploadIndex].text_class = 'text-red-400';
            console.log(error);
          },
          // On successful upload
          () => {
            // Store data about user who uploaded the files
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              // Because we will allow the user to change song names
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0,
            };

            return Promise.resolve(task.snapshot.ref.getDownloadURL())
              .then((url) => {
                song.url = url;
                // We don't need to use a custom id for the db item
                return songsCollection.add(song);
              })
              .then((songRef) => {
                return songRef.get();
              })
              .then((snapshot) => {
                this.addSong(snapshot);
                this.uploads[uploadIndex].variant = 'bg-green-400';
                this.uploads[uploadIndex].icon = 'fas fa-check';
                this.uploads[uploadIndex].text_class = 'text-green-400';
              });
          }
        );
      });

      console.log(files);
    },
    // cancelUploads() {
    //   this.uploads.forEach((upload) => {
    //     upload.task.cancel();
    //   });
    // },
  },
  beforeUnmount() {
    // As the user navigates away from the component,
    // Cancel all uploads
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  },
};
</script>
