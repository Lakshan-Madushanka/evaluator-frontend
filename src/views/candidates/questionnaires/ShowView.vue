<template>
  <EvaluationView v-if="showEvaluation" />

  <ConfirmDialog />

  <QuestionnaireSkeleton v-if="candidatesQuestionnairesStore.loading" />
  <template v-else>
    <!-- Header -->
    <header
      class="bg-gray-400 p-4 mb-2 text-white flex flex-col items-center space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sticky top-0 z-10"
    >
      <div class="flex items-center justify-center">
        <p class="text-xl font-bold mr-2">
          {{ questionnaire?.name }}
        </p>
      </div>
      <div>
        <Countdown
          :flip-animation="true"
          countdown-size="2rem"
          :show-days="false"
          :show-labels="false"
          main-color="green"
          second-flip-color="green"
          main-flip-background-color="white"
          second-flip-background-color="white"
          :deadline="getRemainingTime()"
          @time-elapsed="onTimeElapsed"
        />
      </div>
    </header>

    <!-- Body -->
    <div
      v-if="candidatesQuestionnairesStore.questions"
      class="xl:grid grid-cols-[18%_82%]"
    >
      <!-- Left side -->
      <div class="shadow p-4 bg-white mt-4">
        <!-- Navigation map -->
        <div
          class="grid grid-cols-6 sm:grid-cols-10 xl:grid-cols-5 2xl:grid-cols-6 text-black dark:text-gray-400 text-center xl:sticky top-[6rem]"
        >
          <div
            v-for="(question, index) in candidatesQuestionnairesStore.questions"
            :key="question.id"
            :href="`#${question.id}_card`"
            class="shadow-md mr-1 mb-1 p-1 hover:cursor-pointer hover:bg-gray-200 border border-solid border-1 border-gray-300"
            :class="{
              'bg-green-200': getQuestionAnsweredStatus(question.id),
            }"
            @click="navigate(index + 1, question.id)"
          >
            {{ index + 1 }}
          </div>
        </div>
        <div class="mt-8 xl:sticky xl:top-[22rem]">
          <div class="flex justify-between items-center space-x-4 mb-2">
            <PrimeButton
              class="!w-36"
              size="small"
              icon="pi pi-send"
              icon-pos="right"
              @click="showSubmitConfirmDialog"
            >
              <div class="flex justify-between w-full px-2">
                <span>Submit</span>
                <Tag severity="success">
                  {{ noOfAnsweredQuestions }} /
                  {{ questionnaire.no_of_questions }}
                </Tag>
              </div>
            </PrimeButton>
          </div>
        </div>
      </div>

      <!-- Right side -->
      <div class="p-4 space-y-4">
        <!-- Questionnaire -->
        <Card
          v-for="(question, questionIndex) in currrentPageRecords"
          :id="`${question.id}_card`"
          :key="question.id"
        >
          <template #content>
            <div>
              <!-- Questions -->
              <div class="text-black">
                <div class="flex justify-between w-full">
                  <div class="flex w-[90%]">
                    <p class="mr-2">{{ getQuestionNo(questionIndex) }}).</p>
                    <p v-html="question.attributes.content"></p>
                  </div>
                </div>
                <!--Question images-->
                <div
                  v-if="question.relationships.images?.length > 0"
                  class="mt-4 flex flex-wrap justify-center space-y-2"
                >
                  <PrimeImage
                    v-for="questionImage in question.relationships.images"
                    :key="questionImage.id"
                    :src="questionImage.original_url"
                    :alt="questionImage.file_name"
                    preview
                  />
                </div>
              </div>

              <!-- Answers -->
              <div class="ml-8 mt-2">
                <div
                  v-for="(answer, answerIndex) in questionAnswers[question.id]"
                  :key="answer.id"
                  class="mt-4"
                >
                  <div
                    v-if="question.attributes.answers_type_single"
                    class="flex items-center"
                  >
                    <p class="mr-4">{{ answerIndex + 1 }}</p>
                    <RadioButton
                      v-model="userAnswers[question.id]"
                      :input-id="answer.id"
                      :name="answer.id"
                      :value="answer.id"
                      class="mr-2"
                    />

                    <label :for="answer.id">{{
                      answer?.attributes?.text
                    }}</label>
                  </div>

                  <div v-else class="flex items-center">
                    <p class="mr-4">{{ answerIndex + 1 }}</p>
                    <Checkbox
                      v-model="userAnswers[question.id]"
                      :input-id="answer.id"
                      :name="answer.id"
                      :value="answer.id"
                      class="mr-2"
                    />

                    <label :for="answer.id">{{
                      answer?.attributes?.text
                    }}</label>
                  </div>

                  <!-- Answer images -->
                  <div
                    v-if="answer.relationships.images?.length > 0"
                    class="mt-4 flex flex-wrap justify-center space-y-2"
                  >
                    <PrimeImage
                      v-for="answerImage in answer.relationships.images"
                      :key="answerImage.id"
                      :src="answerImage.original_url"
                      :alt="answerImage.file_name"
                      preview
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Paginator
      v-model:first="paginator.offset"
      :rows="10"
      :total-records="candidatesQuestionnairesStore?.questions?.length"
      :rows-per-page-options="[10, 20, 30]"
      @page="onPageChange"
    ></Paginator>

    <ScrollTop />
  </template>
</template>

<script>
import {
  ref,
  onMounted,
  watch,
  reactive,
  computed,
  onUnmounted,
  nextTick,
} from "vue";

import { useRoute, useRouter } from "vue-router";

import { useCandidatesQuestionnairesStore } from "@/stores/candidates/questionnaires";

import Card from "primevue/card";
import Checkbox from "primevue/checkbox";
import ConfirmDialog from "primevue/confirmdialog";
import Paginator from "primevue/paginator";
import PrimeButton from "primevue/button";
import PrimeImage from "primevue/image";
import RadioButton from "primevue/radiobutton";
import ScrollTop from "primevue/scrolltop";
import Tag from "primevue/tag";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

import QuestionnaireSkeleton from "@/components/skeletons/QuestionnaireSkeleton.vue";
import EvaluationView from "@/views/candidates/questionnaires/EvaluationView.vue";

import { findRelations, formatMinutes } from "@/helpers";

import { Countdown } from "vue3-flip-countdown";
import moment from "moment";

export default {
  components: {
    Card,
    Checkbox,
    ConfirmDialog,
    Paginator,
    PrimeButton,
    PrimeImage,
    RadioButton,
    ScrollTop,
    Tag,
    QuestionnaireSkeleton,
    EvaluationView,
    Countdown,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const toast = useToast();
    const confirm = useConfirm();

    const candidatesQuestionnairesStore = useCandidatesQuestionnairesStore();

    const includes = ["images", "onlyAnswers.images"];

    const showAnswers = ref(true);
    const showMarks = ref(true);

    let questionAnswers = reactive({});
    const userAnswers = ref({});

    let elapsedMinutes = 0;
    const warnMessageTime = 5;

    const currrentPageRecords = ref();
    const paginator = { perPage: 10, page: 1, offset: 0 };

    const showEvaluation = ref(false);

    onMounted(() => {
      getQuestionsData();
    });

    watch(
      () => candidatesQuestionnairesStore.questions,
      (newQuestions) => {
        if (newQuestions) {
          setAnwers(newQuestions);
          currrentPageRecords.value = getPaginatorRecords();
        }
      },
      { immediate: true }
    );

    function getQuestionsData() {
      candidatesQuestionnairesStore.getAll({
        query: { includes },
      });
    }

    const minutesCounter = setInterval(() => {
      if (candidatesQuestionnairesStore.loading) {
        return;
      }

      elapsedMinutes++;

      if (
        candidatesQuestionnairesStore.questionnaireInfo?.allocated_time -
          elapsedMinutes ===
        warnMessageTime
      ) {
        toast.add({
          severity: "warn",
          summary: `You have only ${warnMessageTime} minutes left`,
          detail: "Answewrs are auto submitted after the time limit reached",
          life: "10000",
        });
      }
    }, 60000);

    function getRemainingTime() {
      return moment()
        .add(
          candidatesQuestionnairesStore.questionnaireInfo?.allocated_time,
          "m"
        )
        .format("YYYY-MM-DD HH:mm:ss");
    }

    function setAnwers(newQuestions) {
      for (let question of newQuestions) {
        questionAnswers[question.id] = [];

        for (let answer of question.relationships.onlyAnswers) {
          let relatedAnswer = findRelations(
            candidatesQuestionnairesStore.meta.included,
            answer.data.id,
            answer.data.type
          );
          questionAnswers[question.id].push(relatedAnswer);
        }
      }
    }

    function onPageChange(event) {
      paginator.page = event.page + 1; // paginator start with page 0
      paginator.perPage = event.rows;

      currrentPageRecords.value = getPaginatorRecords();
    }

    function getQuestionNo(index) {
      index = parseInt(index);

      return (paginator.page - 1) * paginator.perPage + index + 1;
    }

    function getPaginatorRecords() {
      let start_index = (paginator.page - 1) * paginator.perPage;
      let end_index = start_index + paginator.perPage;

      return candidatesQuestionnairesStore.questions?.slice(
        start_index,
        end_index
      );
    }

    async function navigate(questionNo, questionId) {
      setPaginatorOnNavigation(questionNo);

      await nextTick(); // Await until finiish the update

      // Navigate to question
      let offSetTop = document.getElementById(`${questionId}_card`).offsetTop;
      window.scrollTo({ top: offSetTop - 90, behavior: "smooth" });
    }

    function setPaginatorOnNavigation(questionNo) {
      let page = Math.ceil(parseFloat(questionNo / paginator.perPage));

      paginator.page = page;
      paginator.offset = page * paginator.perPage;

      onPageChange({ page: page - 1, rows: paginator.perPage });
    }

    function getQuestionAnsweredStatus(questionId) {
      if (Array.isArray(userAnswers.value[questionId])) {
        return userAnswers.value[questionId]?.length > 0;
      }
      return !!userAnswers.value[questionId];
    }

    const noOfAnsweredQuestions = computed(() => {
      let noOfAnswers = 0;

      for (let answer in userAnswers.value) {
        if (Array.isArray(userAnswers.value[answer])) {
          if (userAnswers.value[answer].length > 0) {
            noOfAnswers++;
          }
        } else if (userAnswers.value[answer]) {
          noOfAnswers++;
        }
      }

      return noOfAnswers;
    });

    function submit() {
      showEvaluation.value = true;
      candidatesQuestionnairesStore.evaluate({ answers: getUserAnswers() });
    }

    function showSubmitConfirmDialog() {
      confirm.require({
        message: `${noOfAnsweredQuestions.value}  out of ${candidatesQuestionnairesStore.questionnaireInfo.no_of_questions} has answered !`,
        header: "Are you sure you want to submit? ",
        icon: "pi pi-info-circle",
        accept: () => {
          submit();
        },
        reject: () => {},
      });
    }

    function getUserAnswers() {
      let answers = {};

      for (let answer in userAnswers.value) {
        if (Array.isArray(userAnswers.value[answer])) {
          answers[answer] = userAnswers.value[answer];
        } else {
          answers[answer] = [userAnswers.value[answer]];
        }
      }

      if (Object.keys(answers).length === 0) {
        answers[candidatesQuestionnairesStore["questions"][0]["id"]] = [];
      }

      return answers;
    }

    function onTimeElapsed() {
      showTimeElapseToast();
      submit();
    }

    function showTimeElapseToast() {
      toast.add({
        severity: "warn",
        summary: "Time elapsed",
        detail: "Auto submitting answers ...",
        life: 5000,
      });
    }

    onUnmounted(() => {
      clearInterval(minutesCounter);
    });

    return {
      route,
      router,
      currrentPageRecords,
      candidatesQuestionnairesStore,
      questionnaire: computed(
        () => candidatesQuestionnairesStore.questionnaireInfo
      ),
      paginator,
      userAnswers,
      showAnswers,
      showMarks,
      questionAnswers,
      showEvaluation,
      findRelations,
      onPageChange,
      getQuestionNo,
      navigate,
      formatMinutes,
      getRemainingTime,
      getQuestionAnsweredStatus,
      noOfAnsweredQuestions,
      showSubmitConfirmDialog,
      submit,
      onTimeElapsed,
    };
  },
};
</script>
