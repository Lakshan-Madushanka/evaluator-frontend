<template>
  <Card class="mt-16 mx-8 xl:mx-80">
    <template #title>
      <p class="text-center uppercase">
        {{ candidatesQuestionnairesStore.questionnaireInfo.name }}
      </p>
    </template>
    <template #content>
      <div class="p-4">
        <div class="mb-4">
          <p class="text-xl font-bold mb-2">Information</p>
          <ul class="w-64">
            <li class="w-full flex justify-between space-y-1">
              <p>Max time</p>
              <p>
                {{
                  candidatesQuestionnairesStore.questionnaireInfo
                    .allocated_time + 5
                }}
                Minutes
              </p>
            </li>
            <li class="w-full flex justify-between">
              <p>No of questions</p>
              <p>
                {{
                  candidatesQuestionnairesStore.questionnaireInfo
                    .no_of_questions
                }}
              </p>
            </li>
            <li class="w-full flex justify-between">
              <p>Answer type</p>
              <p>
                {{
                  candidatesQuestionnairesStore.questionnaireInfo
                    .single_answer_type
                    ? "Single"
                    : "Multiple"
                }}
              </p>
            </li>
          </ul>
        </div>
        <div>
          <p class="text-xl font-bold mb-2">Instructions</p>
          <ul class="space-y-2 list-disc list-inside">
            <li>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
            </li>
            <li>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
            </li>
            <li>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <PrimeButton
          label="Cancel"
          @click="() => router.push({ name: 'home' })"
        />
        <PrimeButton
          label="Attempt"
          @click="
            () =>
              router.push({ name: 'candidate.questionnaires.questions.show' })
          "
        />
      </div>
    </template>
  </Card>
</template>

<script>
import { useRouter } from "vue-router";

import { useCandidatesQuestionnairesStore } from "@/stores/candidates/questionnaires";

import PrimeButton from "primevue/button";
import Card from "primevue/card";

export default {
  components: { Card, PrimeButton },
  setup() {
    const router = useRouter();

    const candidatesQuestionnairesStore = useCandidatesQuestionnairesStore();

    return { router, candidatesQuestionnairesStore };
  },
};
</script>
