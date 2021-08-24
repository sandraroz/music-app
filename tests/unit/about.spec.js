import { shallowMount } from '@vue/test-utils';
import About from '@/views/About.vue';

describe('About.vue', () => {
  test('Renders inner text', () => {
    // Mount the component under test
    const wrapper = shallowMount(About);

    // the wrapper object represents our component
    expect(wrapper.text()).toContain('about');
  });
});
