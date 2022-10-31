import { mount, createLocalVue } from '@vue/test-utils';
import QueryForm from '../../src/components/QueryForm.vue';
const localVue = createLocalVue();
import Vuex from 'vuex';
localVue.use(Vuex);

describe('QueryForm.vue', () => {
  let store;
  beforeEach(() => {
    store = new Vuex.Store({
      actions: {
        toggleQueryForm: jest.fn(),
        setFormType: jest.fn(),
      },
      mutations: {
        setFormType(state, isQuerying) {
          state.isQuerying = isQuerying;
        },
        toggleQueryForm(state, form) {
          state.form = form;
        },
      },
      getters: {
        isQuerying: () => false,
        formSelection: () => null,
      },
      actions: {
        toggleQueryForm: jest.fn(),
        setFormType: jest.fn(),
      },
    });
  });

  it('Asserts that it is a Vue instance', () => {
    const wrapper = mount(QueryForm, {
      localVue,
      store,
    });

    wrapper.vm.options = [
      { type: 'split', header: 'String to sentences' },
      { type: 'embeddings', header: 'Compute sentence embeddings' },
      { type: 'semantic', header: 'Semantic search' },
    ];
    wrapper.vm.semanticView = {
      score: 'Score',
      sentence: 'The most similar sentence to the query',
    };
    wrapper.vm.text = null;
    wrapper.vm.query = null;
    wrapper.vm.isLoading = false;
    wrapper.vm.response = null;
    wrapper.vm.hasError = null;
    expect(wrapper.isVueInstance).toBeTruthy();
  });

  it('Asserts that the header exists', () => {
    const wrapper = mount(QueryForm, {
      localVue,
      store,
    });

    wrapper.vm.options = [
      { type: 'split', header: 'String to sentences' },
      { type: 'embeddings', header: 'Compute sentence embeddings' },
      { type: 'semantic', header: 'Semantic search' },
    ];
    wrapper.vm.semanticView = {
      score: 'Score',
      sentence: 'The most similar sentence to the query',
    };
    wrapper.vm.text = null;
    wrapper.vm.query = null;
    wrapper.vm.isLoading = false;
    wrapper.vm.response = null;
    wrapper.vm.hasError = null;

    const selection = wrapper.find('.selection');

    expect(selection.isVueInstance).toBeTruthy();
  });

  it('Asserts that instance matches the snapshot', () => {
    const wrapper = mount(QueryForm, {
      localVue,
      store,
    });

    wrapper.vm.options = [
      { type: 'split', header: 'String to sentences' },
      { type: 'embeddings', header: 'Compute sentence embeddings' },
      { type: 'semantic', header: 'Semantic search' },
    ];
    wrapper.vm.semanticView = {
      score: 'Score',
      sentence: 'The most similar sentence to the query',
    };
    wrapper.vm.text = null;
    wrapper.vm.query = null;
    wrapper.vm.isLoading = false;
    wrapper.vm.response = null;
    wrapper.vm.hasError = null;

    expect(wrapper.element).toMatchSnapshot();
  });

  it('Asserts that the correct header is selected', () => {
    const wrapper = mount(QueryForm, {
      localVue,
      store,
    });

    wrapper.vm.options = [
      { type: 'split', header: 'String to sentences' },
      { type: 'embeddings', header: 'Compute sentence embeddings' },
      { type: 'semantic', header: 'Semantic search' },
    ];
    wrapper.vm.semanticView = {
      score: 'Score',
      sentence: 'The most similar sentence to the query',
    };
    wrapper.vm.text = null;
    wrapper.vm.query = null;
    wrapper.vm.isLoading = false;
    wrapper.vm.response = null;
    wrapper.vm.hasError = null;

    const selection = wrapper.find('#page-header');

    store.commit('setFormType', true);
    store.commit('toggleQueryForm', 'split');

    expect(selection.text()).toContain('String to sentences');
  });
});
