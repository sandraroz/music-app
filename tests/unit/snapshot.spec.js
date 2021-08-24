import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '@/components/SongItem.vue';

describe('Snapshot SongItem.vue', () => {
  test('Renders correctly', () => {
    const song = {
      docID: 'abc',
      display_name: 'test',
      modified_name: 'test',
      comment_count: 5,
    };

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: { 'router-link': RouterLinkStub },
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
