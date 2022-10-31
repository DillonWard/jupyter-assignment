import axios from 'axios';

export default {
  splitString(input_text) {
    return axios.get('/split-text', { params: { input_text } });
  },
  sentenceEmbeddings(input_text) {
    return axios.get('/sentence-embeddings', { params: { input_text } });
  },

  semanticSearch(input_text, user_query) {
    return axios.get('/semantic-search', {
      params: { input_text, user_query },
    });
  },
};
