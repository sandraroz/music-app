import { shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';
import SongItem from '@/components/SongItem.vue';

// Since firebase thinks we are offline due to enabling
// persistence, we need to mock the import of firebase
// inside the home file, path has to match import path
jest.mock('@/includes/firebase', () => {});

describe('Home View', () => {
  test('renders list of songs', () => {
    // Create 3 empty objects
    const songs = [{}, {}, {}];

    // Mock the method that makes a request
    Home.methods.getSongs = () => false;

    const component = shallowMount(Home, {
      data() {
        return { songs };
      },
      global: {
        // place to mock global functions
        mocks: {
          $t: (message) => message,
        },
      },
    });

    const items = component.findAllComponents(SongItem);

    expect(items).toHaveLength(songs.length);

    // Check order of songs matches
    items.forEach((wrapper, i) => {
      expect(wrapper.props().song).toStrictEqual(songs[i]);
    });
  });
});
