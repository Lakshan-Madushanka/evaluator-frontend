<template>
  <PrimeDialog
    v-model:visible="displayComponent"
    modal
    header="Header"
    class="w-full md:w-2/3 2xl:w-2/5 m-2"
    @hide="hide"
  >
    <template #header>
      <div class="flex items-center">
        <p class="text-xl font-bold mr-4">
          Attach a questionnaire to user
          <span class="italic text-green-500">{{ props.userId }}</span> (id)
        </p>
      </div>
    </template>

    <div
      class="mb-8 mt-4 flex flex-col items-center sm:flex-row sm:items-start pt-4"
    >
      <div class="w-[60%] mb-2 sm:mb-0">
        <span class="p-input-icon-left p-input-icon-right w-full">
          <span>
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText
                id="questionnaire_id"
                v-model="questionnaireId"
                :class="[
                  'w-full disabled:!text-[var(--p-primary-color)]',

                  {
                    '!font-bold': usersQuestionnairesStore.availableId,
                  },
                ]"
                placeholder="Questionnaire id"
                type="search"
                autofocus
                :disabled="usersQuestionnairesStore.availableId ? true : false"
                @keyup.enter="attachOrSearch"
                @keydown="onQuestionnaireIdTextInputKeyDown"
                @paste="onPasteQquestionnaireIdTextInput"
              />
            </IconField>
          </span>
        </span>
        <p
          v-if="questionnaireId === '' && searchButtonClicked"
          class="text-red-500 text-sm mt-2"
        >
          Questionnaire id is required
        </p>
        <p
          v-if="usersQuestionnairesStore.errors.questionnaireId"
          class="text-red-500 text-sm mt-2"
        >
          {{ usersQuestionnairesStore.errors.questionnaireId }}
        </p>
      </div>
      <PrimeButton
        v-if="!usersQuestionnairesStore.availableId"
        :label="
          usersQuestionnairesStore.status === 'searching'
            ? 'Searching'
            : 'Search'
        "
        :loading="usersQuestionnairesStore.status === 'searching'"
        @click="search"
      />
      <div v-else>
        <PrimeButton
          class="!mr-2"
          :label="
            usersQuestionnairesStore.status === 'attaching'
              ? 'Attaching'
              : 'Attach'
          "
          :loading="usersQuestionnairesStore.status === 'attaching'"
          @click="attach"
        />

        <PrimeButton
          class="p-button-warning"
          label="Cancel"
          @click="clearState"
        />
      </div>
    </div>
  </PrimeDialog>
</template>

<script>
import { ref, watch, onMounted } from "vue";

import { useUsersQuestionnairesStore } from "@/stores/users/questionnaires";

import PrimeButton from "primevue/button";
import PrimeDialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";

export default {
  components: { PrimeDialog, InputText, PrimeButton, IconField, InputIcon },
  props: {
    display: { type: Boolean, default: false },
    userId: { type: String, default: null },
  },
  emits: ["hide"],

  setup(props, { emit }) {
    const usersQuestionnairesStore = useUsersQuestionnairesStore();

    const displayComponent = ref(false);
    const questionnaireId = ref("");
    const searchButtonClicked = ref(false);

    onMounted(() => clearState());

    watch(
      () => usersQuestionnairesStore.status,
      (newStatus) => {
        if (newStatus === "attached") {
          clearState();
        }
      }
    );

    watch(
      () => props.display,
      (newValue) => {
        displayComponent.value = newValue;
      }
    );

    function clearState() {
      usersQuestionnairesStore.clearState();
      questionnaireId.value = "";
      searchButtonClicked.value = "";
    }

    function hide() {
      clearState();

      displayComponent.value = false;
      emit("hide", displayComponent.value);
    }

    function onPasteQquestionnaireIdTextInput(event) {
      event.preventDefault();
      let id = event.clipboardData.getData("text");
      id = id.replace(/\s/g, "");
      id = id.replace(/\//g, "");
      id = id.replace(/\\/g, "");

      questionnaireId.value = id;
    }

    function onQuestionnaireIdTextInputKeyDown(event) {
      const key = event.key;
      if (key === "/" || key === " " || key === "\\") {
        event.preventDefault();
      }
      if (usersQuestionnairesStore.errors.questionnaireId) {
        usersQuestionnairesStore.errors.questionnaireId = "";
      }
    }

    function attachOrSearch() {
      if (usersQuestionnairesStore.availableId) {
        attach();
      } else {
        search();
      }
    }

    function search() {
      searchButtonClicked.value = true;
      if (questionnaireId.value !== "") {
        usersQuestionnairesStore.checkAvalability(questionnaireId.value);
      }
    }
    function attach() {
      usersQuestionnairesStore.attach(props.userId);
    }

    return {
      props,
      displayComponent,
      hide,
      search,
      attach,
      attachOrSearch,
      onQuestionnaireIdTextInputKeyDown,
      onPasteQquestionnaireIdTextInput,
      clearState,
      questionnaireId,
      searchButtonClicked,
      usersQuestionnairesStore,
    };
  },
};
</script>
