import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '@/components/SongItem.vue';

describe('SongItem.vue', () => {
  test('Renders song.display_name', () => {
    const song = {
      display_name: 'test',
    };

    // Mount the component under test
    const wrapper = shallowMount(SongItem, {
      // Passing props to component under test
      propsData: {
        song,
      },
      // passing components that are stubbed
      global: {
        components: {
          'router-link': RouterLinkStub, // stub
        },
      },
    });

    const compositionAuthor = wrapper.find('.text-gray-500');

    // the wrapper object represents our component
    expect(compositionAuthor.text()).toBe(song.display_name);
  });

  test('Renders song.docID in id attribute', () => {
    const song = {
      docID: 'abc',
    };

    // Mount the component under test
    const wrapper = shallowMount(SongItem, {
      // Passing props to component under test
      propsData: {
        song,
      },
      // passing components that are stubbed
      global: {
        components: {
          'router-link': RouterLinkStub, // stub
        },
      },
    });

    // the wrapper object represents our component
    // expect(wrapper.attributes().id).toBe(`song-id-${song.docID}`);

    expect(wrapper.classes()).toContain(`song-id-${song.docID}`);
  });
});
