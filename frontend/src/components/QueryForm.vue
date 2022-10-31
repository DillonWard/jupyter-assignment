<template>
  <div>
    <div class="container selection">
      <div v-show="!isQuerying" class="row">
        <div
          v-for="(option, index) in options"
          :key="index"
          v-on:click="toggleForm(true, option.type)"
          class="col-md-4 col-sm-6 col-xl-4 my-3"
        >
          <div class="card d-block h-100 box-shadow-hover pointer">
            <div
              class="pt-3 h-75p align-items-center d-flex justify-content-center"
            ></div>
            <div class="card-body p-4">
              <h3 class="h4">
                <strong id="page-header">{{ option.header }}.</strong>
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isQuerying">
        <div class="row">
          <div :style="{ cursor: 'pointer' }" v-on:click="toggleForm(false)">
            <p>
              <i id="arrow" class="bi bi-arrow-left" aria-hidden="true"></i>
              <strong class="h4">{{
                options.filter((item) => item.type === formSelection)[0].header
              }}</strong>
            </p>
          </div>
        </div>
        <form @submit.prevent="submit({ text, query }, formSelection)">
          <div
            v-show="hasError !== null"
            :class="!hasError ? 'alert alert-success' : 'alert alert-danger'"
            role="alert"
          >
            {{
              hasError ? 'Your request failed.' : 'Your request was successful!'
            }}
          </div>

          <div class="form-group">
            <label class="float-left">String to query</label>
            <textarea
              v-model="text"
              required
              class="form-control"
              rows="3"
            ></textarea>
          </div>
          <div v-if="formSelection === 'semantic'" class="form-group">
            <label class="float-left">Sentence to query</label>
            <input class="form-control" v-model="query" required />
          </div>
          <button
            class="btn btn-primary btn-lg btn-block"
            type="submit"
            :disabled="isLoading"
          >
            <span
              v-if="isLoading"
              class="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
            {{ isLoading ? 'Loading...' : 'Submit' }}
          </button>
        </form>
      </div>
    </div>
    <div v-if="response !== null" class="container px-4">
      <div v-if="formSelection === 'split'" class="row gx-5">
        <div class="col">
          <div class="p-3 border">{{ response }}</div>
        </div>
        <div class="col">
          <div class="p-3 border">
            <p v-for="(sentence, index) in response" :key="index">
              {{ index }} : {{ sentence }}
            </p>
          </div>
        </div>
      </div>
      <div v-else-if="formSelection === 'embeddings'">
        <pre> {{ response }} </pre>
      </div>
      <div v-else>
        <div v-for="(item, index) in response" :key="index">
          <p class="h1">{{ semanticView[index] }}: {{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/API';
export default {
  name: 'QueryForm',
  data() {
    return {
      options: [
        { type: 'split', header: 'String to sentences' },
        { type: 'embeddings', header: 'Compute sentence embeddings' },
        { type: 'semantic', header: 'Semantic search' },
      ],
      semanticView: {
        score: 'Score',
        sentence: 'The most similar sentence to the query',
      },
      text: null,
      query: null,
      isLoading: false,
      response: null,
      hasError: null,
    };
  },
  methods: {
    toggleForm(control, option) {
      if (!control) {
        this.$store.dispatch('toggleQueryForm', control);
        this.text = null;
        this.query = null;
        this.isLoading = false;
        this.response = null;
        this.hasError = null;
      } else {
        this.$store.dispatch('toggleQueryForm', control);
        this.$store.dispatch('setFormType', option);
      }
    },
    submit(text, formType) {
      this.isLoading = true;
      if (formType == 'split') {
        this.splitString(text.text);
      } else if (formType == 'embeddings') {
        this.sentenceEmbeddings(text.text);
      } else {
        this.semanticSearch(text.text, text.query);
      }
      setTimeout(() => {
        this.hasError = null;
      }, 5000);
    },

    semanticSearch(text, query) {
      api
        .semanticSearch(text, query)
        .then((res) => {
          this.isLoading = false;
          this.response = res.data;
          this.hasError = false;
        })
        .catch(() => {
          this.isLoading = false;
          this.hasError = true;
        });
    },

    sentenceEmbeddings(text) {
      api
        .sentenceEmbeddings(text)
        .then((res) => {
          this.isLoading = false;
          this.hasError = false;
          this.response = res.data;
        })
        .catch(() => {
          this.isLoading = false;
          this.hasError = true;
        });
    },

    splitString(text) {
      api
        .splitString(text)
        .then((res) => {
          this.isLoading = false;
          this.response = res.data;
          this.hasError = false;
        })
        .catch(() => {
          this.isLoading = false;
          this.hasError = true;
        });
    },
  },
  computed: {
    isQuerying: function () {
      return this.$store.getters.getIsQuerying;
    },
    formSelection: function () {
      return this.$store.getters.getFormState;
    },
  },
};
</script>

<style scoped>
.return {
  vertical-align: baseline;
}
#arrow {
  font-size: 30px;
  padding-right: 15px;
}
.box-shadow-hover:hover {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}

.pointer {
  cursor: pointer;
}

pre {
  max-height: 40vh;
}

img {
  width: auto;
  max-height: 100px;
}

.selection {
  margin-top: 25px;
  font-size: 21px;
  text-align: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  -webkit-animation: fadein 2s;
  -moz-animation: fadein 2s;
  -ms-animation: fadein 2s;
  -o-animation: fadein 2s;
  animation: fadein 2s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-moz-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-ms-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Opera < 12.1 */
@-o-keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
