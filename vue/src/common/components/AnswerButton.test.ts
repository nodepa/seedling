// Libraries, plugins, components
import Vue from 'vue';
import Vuetify from 'vuetify';

// Helpers
import { shallowMount, Wrapper } from '@vue/test-utils';
import { animate } from '@/test_helpers/FunctionOverrides';

// Item under test
import AnswerButton from './AnswerButton.vue';

window.Element.prototype.animate = animate;

Vue.use(Vuetify);

describe('AnswerButton', () => {
  let wrapper: Wrapper<Vue>;
  let vuetify: Vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(AnswerButton, {
      vuetify,
    });
  });

  afterEach(() => {
    wrapper.destroy();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('is a Vue instance', () => {
      expect(wrapper.isVueInstance).toBeTruthy();
    });

    it('has correct defaults', () => {
      expect(wrapper.vm.$data.errorColor).toBe('');
      expect(wrapper.vm.$props.isPlaying).toBe(false);
      expect(wrapper.vm.$props.color).toBe('');
      expect(wrapper.vm.$props.disabled).toBe(false);
      expect(wrapper.vm.$props.height).toBe('100%');
      expect(wrapper.vm.$props.isBuzzing).toBe(false);
    });

    it('changes color when `isBuzzing`', async () => {
      await wrapper.setProps({ isBuzzing: true });
      expect(wrapper.vm.$data.errorColor).toBe(
        wrapper.vm.$vuetify.theme.currentTheme.error,
      );
    });

    it('animates when `isBuzzing`', async () => {
      const spyAnimate = jest.spyOn(window.Element.prototype, 'animate');
      expect(spyAnimate).toBeCalledTimes(0);
      await wrapper.setProps({ isBuzzing: true });
      expect(spyAnimate).toBeCalledTimes(1);
    });
  });
});
