// Libraries, plugins, components
import { Store } from 'vuex';
import store from '@/common/store/RootStore';
import Badge from '@/common/components/Badge.vue';

// Helpers
import { mount, VueWrapper } from '@vue/test-utils';
import { pause, play } from '@/test-support/MockImplementations';
window.HTMLMediaElement.prototype.pause = pause;
window.HTMLMediaElement.prototype.play = play;

// Item under test
import {
  Instruction,
  InstructionElement,
  InstructionRootState,
} from '@/common/directives/InstructionDirective';

const spyAddAudioListeners = jest.spyOn(
  Instruction.prototype,
  'addAudioListeners',
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: VueWrapper<any>;
let instruction: Instruction;
const audioPath = 'http://just.a.test/audio.mp3';

beforeEach(() => {
  // Setup
  store.dispatch('resetState');
  spyAddAudioListeners.mockClear();

  wrapper = mount(
    {
      template: `<button />`,
    },
    {
      global: {
        plugins: [store],
      },
    },
  );

  instruction = new Instruction(
    wrapper.vm.$el as InstructionElement,
    audioPath,
    wrapper.vm,
    Badge,
    store as Store<InstructionRootState>,
  );

  // Replicates the "bind"-function
  if (wrapper.vm.$store.state.instructionStore.isInstructionMode) {
    instruction.addEventListener();
    instruction.addInstructionStyle();
  }
});

afterEach(() => {
  // Replicates the "unbind"-function
  instruction.unsubscribe();
  instruction.removeEventListener();
  instruction.delist();
});

describe('class Instruction', () => {
  it('constructor: functional', () => {
    expect(instruction).toBeInstanceOf(Instruction);
    expect(instruction).toHaveProperty('audioElement');
    expect(instruction).toHaveProperty('vm');
  });

  it('constructor: instance added to instruction collection', () => {
    expect(Instruction.AudioCollection.length).toBe(1);
  });

  it('addEventListener: adds event listeners', () => {
    const spy = jest.spyOn(wrapper.vm.$el, 'addEventListener');
    expect(spy).toHaveBeenCalledTimes(0);
    store.dispatch('instructionStore/toggleInstructionMode');
    expect(spy).toHaveBeenCalledTimes(1);
    instruction.addEventListener();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('addAudioListeners: adds event listeners', () => {
    const spyAudioAddEventListener = jest.spyOn(
      HTMLAudioElement.prototype,
      'addEventListener',
    );
    expect(spyAddAudioListeners).toHaveBeenCalledTimes(1);
    spyAudioAddEventListener.mockClear();
    instruction.addAudioListeners();
    expect(spyAddAudioListeners).toHaveBeenCalledTimes(2);
    expect(spyAudioAddEventListener).toHaveBeenCalledTimes(3);
  });

  it('removeEventListener: removes event listeners', () => {
    const spyAdd = jest.spyOn(wrapper.vm.$el, 'addEventListener');
    const spyRemove = jest.spyOn(wrapper.vm.$el, 'removeEventListener');
    expect(spyAdd).toHaveBeenCalledTimes(0);
    expect(spyRemove).toHaveBeenCalledTimes(0);
    instruction.addEventListener();
    expect(spyAdd).toHaveBeenCalledTimes(1);
    expect(spyRemove).toHaveBeenCalledTimes(0);
    instruction.removeEventListener();
    expect(spyAdd).toHaveBeenCalledTimes(1);
    expect(spyRemove).toHaveBeenCalledTimes(1);
  });

  it('addInstructionStyle: adds styling to the element', () => {
    // Setup pre-state
    const el = wrapper.vm.$el as HTMLButtonElement;
    const elToRemove: Element[] = [];
    for (let i = 0; i < el.children.length; i += 1) {
      if (el.children[i].tagName === 'DIV') {
        elToRemove.push(el.children[i]);
      }
    }
    elToRemove.forEach((element) => {
      element.remove();
    });
    expect(el.childElementCount).toBe(1); // 1 audio, 0 animations

    // Apply function
    instruction.addInstructionStyle();

    // Assert post-state
    expect(el.classList).toContain('pop-through');
    expect(el.childElementCount).toBe(2); // 1 badge, 1 audio, 0 animations
    expect(el.children[0].tagName).toBe('SPAN');
    expect(el.children[1].tagName).toBe('AUDIO');
  });

  it('removeInstructionStyle: removes/restores styling to the element', () => {
    // Setup pre-state
    instruction.addInstructionStyle();
    const el = wrapper.vm.$el as HTMLButtonElement;
    expect(el.classList).toContain('pop-through');
    expect(el.childElementCount).toBe(2); // 1 badge, 1 audio, 0 animations

    // Apply function
    instruction.removeInstructionStyle();

    // Assert post-state
    expect(el.classList).not.toContain('pop-through');
    expect(el.childElementCount).toBe(1); // 1 audio, 0 animations
    expect(el.children[0].tagName).toBe('AUDIO'); // audio is 1rst elm
  });

  it('playInstruction: plays attached audio', () => {
    // Setup and assert pre-state
    const parentEl = wrapper.vm.$el;
    expect(parentEl.children[0].tagName).toBe('AUDIO');
    expect(parentEl.childElementCount).toBe(1); // 1 audio, 0 animations
    const el = parentEl.children[0] as HTMLAudioElement;
    expect(el.tagName).toBe('AUDIO');
    expect(el.src).toBe(audioPath);

    const spy = jest.spyOn(el, 'play');
    expect(spy).toHaveBeenCalledTimes(0);

    // Apply function
    instruction.playInstruction();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe: calls unsubscribe function from store', () => {
    // Setup and assert pre-state
    // A side-effect of the store's toggleInstructionMode value changing to false
    // is that pauseRegisteredInstructionAudio() is called.
    // After unsubscribing,
    // pauseRegisteredInstructionAudio() should no longer be called
    // when toggleInstructionMode turns false.
    const spy = jest.spyOn(Instruction, 'pauseRegisteredInstructionAudio');

    // Assert invocating pauseRegisteredInstructionAudio()
    expect(spy).toHaveBeenCalledTimes(0);
    store.dispatch('instructionStore/toggleInstructionMode');
    store.dispatch('instructionStore/toggleInstructionMode');
    expect(spy).toHaveBeenCalledTimes(1);

    // Apply function
    instruction.unsubscribe();

    // Assert NO LONGER invocating pauseRegisteredInstructionAudio()
    store.dispatch('instructionStore/toggleInstructionMode');
    store.dispatch('instructionStore/toggleInstructionMode');
    expect(spy).toHaveBeenCalledTimes(1); // Still 1
  });

  it('delist: current instance is removed from Instruction.Collection', () => {
    const el = Object.values(wrapper.vm.$el.children).find((elm) => {
      return (elm as Element).tagName === 'AUDIO';
    }) as HTMLAudioElement;
    const count = Instruction.AudioCollection.length;
    expect(Instruction.AudioCollection.includes(el)).toBe(true);

    instruction.delist();

    expect(Instruction.AudioCollection.length).toBe(count - 1);
    expect(Instruction.AudioCollection.includes(el)).toBe(false);
  });
});
