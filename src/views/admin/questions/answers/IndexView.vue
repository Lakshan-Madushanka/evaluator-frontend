<template>
  <div class="shadow-lg bg-white p-4 pb-8">
    <div class="flex flex-wrap items-center justify-center sm:justify-between">
      <h1 class="text-2xl font-bold uppercase mb-2">
        Manage answers of question
        <span class="text-green-400 mr-1">{{ route.params.id }}</span>
        <span class="text-sm lowercase">(id)</span>
      </h1>
      <PrimeButton icon="pi pi-spinner" @click="reset" />
    </div>

    <div class="mt-8">
      <Skeleton
        v-if="questionsAnswersStore.loading"
        class="mb-2 !w-full !h-72"
      ></Skeleton>

      <div v-else id="answersList" ref="answersListElm" class="shadow">
        <div
          class="flex justify-between px-4 items-center w-full py-8 bg-gray-100 border-y-2 border-neutral-200"
        >
          <div class="text-lg font-bold">
            <p>
              List of Answers ({{ data.answers.length }} /
              {{ route.query.total_answers }})
            </p>
          </div>
        </div>

        <TransitionGroup name="list" tag="ul" class="h-[25rem] overflow-y-auto">
          <li
            v-for="(answer, index) of data.answers"
            :key="answer.id"
            :class="{ 'bg-blue-200': isAnswerSelected(answer) }"
            @click="selectAnswer($event, answer)"
          >
            <div
              class="flex justify-between border-b-2 border-neutral-200 p-4 hover:cursor-pointer"
            >
              <div class="flex w-[75%]">
                <span class="mr-2">{{ index + 1 }}).</span>
                <p v-html="answer.attributes.text"></p>
              </div>
              <div class="space-y-1">
                <p>
                  ID
                  <Tag severity="secondary">{{
                    answer.attributes.pretty_id
                  }}</Tag>
                </p>
                <p>
                  Images count
                  <Tag severity="secondary">{{
                    answer.attributes.images_count
                  }}</Tag>
                </p>
                <div class="cursor-pointer">
                  <label
                    class="mr-2"
                    :for="`answer_${answer.attributes.pretty_id}`"
                    >Correct Answer</label
                  >
                  <Checkbox
                    v-model="answer.attributes.correct_answer"
                    :input-id="`answer_${answer.attributes.pretty_id}`"
                    binary
                  />
                </div>
              </div>
            </div>
          </li>
        </TransitionGroup>
      </div>

      <div class="mt-8 flex justify-center flex-wrap items-start space-x-2">
        <PrimeButton
          :label="
            questionsAnswersStore.status === 'syncing' ? 'Syncing' : 'Sync All'
          "
          icon="pi pi-history"
          class="!mb-2 p-button-warning"
          :loading="questionsAnswersStore.status === 'syncing'"
          @click="syncAnswers"
        />
        <span v-if="data.answers.length > 0" class="p-buttonset mb-2 space-x-2">
          <PrimeButton
            label="Select All"
            icon="pi pi-clone"
            @click="selectAllAnswers"
          />
          <PrimeButton
            label="Deselect All"
            icon="pi pi-times"
            @click="deselectAllAnswers"
          />
        </span>
        <PrimeButton
          v-if="selectedAnswers.length > 0"
          icon="pi pi-trash"
          label="Remove Selected"
          class="p-button-warning"
          @click="removeSelectedAnswers"
        />
      </div>
    </div>

    <div class="mt-8">
      <p class="text-xl font-bold mb-4">Find Answer</p>
      <div class="flex items-start">
        <div class="w-1/2">
          <InputText
            v-model="questionId"
            class="w-full"
            placeholder="Answer Id"
            @keyup.enter="searchAnswer"
          />
          <p
            v-if="questionId === '' && queestionIdSearchButtonClicked"
            class="text-sm m-2 text-red-500"
          >
            Answer id is required
            {{ questionsAnswersStore.errors.questionId }}
          </p>
          <p
            v-if="questionsAnswersStore.errors.questionId"
            class="text-sm m-2 text-red-500"
          >
            {{ questionsAnswersStore.errors.questionId }}
          </p>
        </div>

        <PrimeButton
          :label="
            questionsAnswersStore.status === 'searching'
              ? 'Searching'
              : 'Search'
          "
          icon="pi pi-search"
          icon-pos="right"
          :loading="questionsAnswersStore.status === 'searching'"
          @click="searchAnswer"
        />
      </div>
    </div>

    <div v-if="questionsAnswersStore.answer" class="my-8">
      <Card>
        <template #title>
          <div class="flex justify-between items-center">
            <div><p class="!text-lg">Results</p></div>
            <div>
              <i
                v-if="!canAddToList()"
                v-tooltip.left="{ value: addToListError }"
                class="pi pi-info-circle mr-4 !text-2xl text-yellow-500"
              />
              <PrimeButton
                class="p-button-sm"
                label="Add"
                :disabled="!canAddToList()"
                @click="addToList"
              />
            </div>
          </div>
        </template>
        <template #content>
          <div class="flex justify-between">
            <div class="flex w-[75%]">
              <p v-html="questionsAnswersStore.answer.attributes.text"></p>
            </div>
            <div>
              <p>
                ID:
                {{ questionsAnswersStore.answer.attributes.pretty_id }}
              </p>

              <p>
                Images count:
                {{ questionsAnswersStore.answer.attributes.images_count }}
              </p>
            </div>
          </div>
        </template>
        <template #footer> </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from "vue";

import { useRoute } from "vue-router";

import { useQuestionsAnswersStore } from "@/stores/questions/answers";

import Card from "primevue/card";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import PrimeButton from "primevue/button";
import Skeleton from "primevue/skeleton";
import Tag from "primevue/tag";

export default {
  components: {
    Card,
    Checkbox,
    PrimeButton,
    Skeleton,
    InputText,
    Tag,
  },
  setup() {
    const route = useRoute();

    const questionsAnswersStore = useQuestionsAnswersStore();

    const data = reactive({
      answers: [],
    });
    const selectedAnswers = ref([]);
    const questionId = ref("");
    const queestionIdSearchButtonClicked = ref(false);
    const addToListError = ref("");

    onMounted(() => {
      getData();
    });

    watch(
      () => questionsAnswersStore.answers,
      (newAnswers) => {
        data.answers = JSON.parse(JSON.stringify(newAnswers));
      }
    );

    function getData() {
      questionsAnswersStore.getAll(route.params.id);
    }

    function removeSelectedAnswers() {
      let selectedAnswersLength = selectedAnswers.value.length;
      let answers = JSON.parse(JSON.stringify(data.answers));

      for (
        let selectedAnswer = 0;
        selectedAnswer < selectedAnswersLength;
        selectedAnswer++
      ) {
        for (let answer = 0; answer < answers.length; answer++) {
          if (selectedAnswers.value[selectedAnswer].id === answers[answer].id) {
            answers.splice(answer, 1);
            break;
          }
        }
      }

      data.answers = answers;
      selectedAnswers.value = [];
    }

    function searchAnswer() {
      queestionIdSearchButtonClicked.value = true;
      if (questionId.value === "") {
        return;
      }

      questionsAnswersStore.checkAnswersExists(questionId.value);
    }

    function canAddToList() {
      const answer = questionsAnswersStore.answer;

      if (data.answers.length === parseInt(route.query.total_answers)) {
        addToListError.value = "No of allowed total answers exceeded";
        return false;
      }

      if (checkAnswerExists(answer)) {
        addToListError.value = "Answer already exists";

        return false;
      }
      return true;
    }

    function checkAnswerExists(answer) {
      for (const a of data.answers) {
        if (a.id === answer.id) {
          return true;
        }
      }

      return false;
    }

    function addToList() {
      const answer = questionsAnswersStore.answer;
      answer.attributes.correct_answer = false;
      data.answers.unshift(answer);
    }

    function getListAnswersCount() {
      let count = 0;

      data.answers.forEach((question) => {
        if (question.show) {
          count++;
        }
      });

      return count;
    }

    function selectAnswer(event, question) {
      const length = selectedAnswers.value.length;
      for (let $i = 0; $i < length; $i++) {
        if (selectedAnswers.value[$i].id === question.id) {
          selectedAnswers.value.splice($i, 1);
          return;
        }
      }
      selectedAnswers.value.push(question);
    }

    function deselectAllAnswers() {
      selectedAnswers.value = [];
    }

    function selectAllAnswers() {
      selectedAnswers.value = data.answers;
    }

    function reset() {
      selectedAnswers.value = [];
      questionId.value = "";
      queestionIdSearchButtonClicked.value = false;
      getData();
    }

    function isAnswerSelected(question) {
      const length = selectedAnswers.value.length;
      for (let $i = 0; $i < length; $i++) {
        if (selectedAnswers.value[$i].id === question.id) {
          return true;
        }
      }

      return false;
    }

    function prepareAnswersToSync() {
      let answers = [];

      data.answers.forEach((answer) => {
        let tmpAnswer = {};
        tmpAnswer.id = answer.id;
        tmpAnswer.correct = answer.attributes.correct_answer;

        answers.push(tmpAnswer);
      });

      return answers;
    }

    function syncAnswers() {
      questionsAnswersStore.syncAnswers(route.params.id, {
        answers: prepareAnswersToSync(),
      });
    }

    return {
      data,
      selectedAnswers,
      addToListError,
      route,
      questionsAnswersStore,
      removeSelectedAnswers,
      reset,
      questionId,
      searchAnswer,
      queestionIdSearchButtonClicked,
      addToList,
      canAddToList,
      getListAnswersCount,
      selectAnswer,
      isAnswerSelected,
      selectAllAnswers,
      deselectAllAnswers,
      syncAnswers,
    };
  },
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
