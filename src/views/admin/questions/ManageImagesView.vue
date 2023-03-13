<template>
  <ConfirmDialog />
  <div class="mb-4">
    <h1 class="text-2xl font-bold uppercase mb-2 text-center md:text-left">
      Manage images of questions id
      <span class="lowercase text-green-500">{{ route.query.pretty_id }}</span>
    </h1>
  </div>
  <div class="p-4 space-y-8 pb-4">
    <div class="bg-white shadow p-8">
      <p class="text-xl text-bold text-center mb-4">All uploaded images</p>
      <Skeleton v-if="questionsStore.loading" class="mb-2 !h-72"></Skeleton>
      <PrimeGalleria
        v-if="!questionsStore.loading && questionsStore.images.length > 0"
        container-class="m-auto"
        :value="questionsStore.images"
        :num-visible="5"
        container-style="max-width: 640px"
      >
        <template #item="slotProps">
          <img
            :src="slotProps.item.original_url"
            :alt="slotProps.item.alt"
            style="width: 100%"
          />
        </template>
        <template #thumbnail="slotProps">
          <img :src="slotProps.item.original_url" :alt="slotProps.item.alt" />
        </template>
      </PrimeGalleria>
      <p
        v-if="!questionsStore.loading && questionsStore.images.length === 0"
        class="text-center text-blue-600"
      >
        0 images has been uploaded
      </p>
    </div>
    <div class="bg-white shadow p-8">
      <p class="text-xl font-bold mb-4">Upload image</p>
      <FileUpload
        name="images[]"
        :url="getImageUploadRoute()"
        :multiple="true"
        accept="image/*"
        :max-file-size="5000000"
        :with-credentials="true"
        mode="advanced"
        @before-send="beforeSend"
        @upload="onUploadCompleted"
      >
        <template #empty>
          <p>Drag and drop files to here to upload.</p>
        </template>
      </FileUpload>
    </div>
    <div class="bg-white shadow p-8">
      <p class="text-xl font-bold mb-4">Change order</p>
      <Skeleton v-if="questionsStore.loading" class="mb-2 !h-72"></Skeleton>
      <div v-if="!questionsStore.loading && questionsStore.images.length > 0">
        <OrderList
          v-model="questionsStore.images"
          v-model:selection="selectedImages"
          list-style="height:auto"
          data-key="id"
        >
          <template #header> List of Products </template>

          <template #item="slotProps">
            <div class="flex flex-wrap justify-between">
              <div class="">
                <img
                  class="w-8 h-8"
                  :src="slotProps.item.original_url"
                  :alt="slotProps.item.name"
                />
              </div>
              <div class="">
                <p>{{ slotProps.item.file_name }}</p>
                <p>
                  {{
                    moment(slotProps.item.created_at).format(
                      "ddd, MMM D, yyyy, h:mm a"
                    )
                  }}
                </p>
              </div>
            </div>
          </template>
        </OrderList>
        <div class="mt-4 flex justify-center space-x-4">
          <PrimeButton
            :label="
              questionsStore.status === 'changing'
                ? 'Changing order'
                : 'Change order'
            "
            :loading="questionsStore.status === 'changing'"
            @click="changeOrder"
          />
          <PrimeButton
            v-if="selectedImages.length > 0"
            :label="
              questionsStore.status === 'removing' ? 'Removing' : 'Remove'
            "
            class="p-button-danger"
            :loading="questionsStore.status === 'removing'"
            @click="removeAll"
          />
        </div>
      </div>
      <p
        v-if="!questionsStore.loading && questionsStore.images.length === 0"
        class="text-center text-blue-600"
      >
        0 images has been uploaded
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";

import { useRoute } from "vue-router";

import { useQuestionsStore } from "@/stores/questions";

import ConfirmDialog from "primevue/confirmdialog";
import PrimeGalleria from "primevue/galleria";
import PrimeButton from "primevue/button";
import Skeleton from "primevue/skeleton";
import FileUpload from "primevue/fileupload";
import OrderList from "primevue/orderlist";
import { useConfirm } from "primevue/useconfirm";

import { get_route_to_upload_images as imageUploadRoute } from "@/api/routes/questions";

import { getCookie } from "@/helpers";

import moment from "moment/moment";

export default {
  components: {
    ConfirmDialog,
    FileUpload,
    OrderList,
    PrimeGalleria,
    PrimeButton,
    Skeleton,
  },
  setup() {
    const route = useRoute();

    const confirm = useConfirm();

    const questionsStore = useQuestionsStore();

    const selectedImages = ref([]);

    onMounted(() => {
      questionsStore.getImages(route.params.id);
    });

    watch(
      () => questionsStore.status,
      (newStatus) => {
        if (newStatus === "removed") {
          questionsStore.getImages(route.params.id);
          selectedImages.value = [];
        }
      }
    );

    function getImageUploadRoute() {
      return imageUploadRoute(route.params.id);
    }

    function beforeSend(request) {
      request.xhr.setRequestHeader("Accept", "application/json");
      request.xhr.setRequestHeader("X-XSRF-TOKEN", getCookie("XSRF-TOKEN"));
    }

    function prepareDataToChangeOrder() {
      let order = {};
      questionsStore.images.forEach((image, index) => {
        order[image["id"]] = index + 1;
      });

      return order;
    }

    function getIdsToDelete() {
      let ids = [];
      selectedImages.value.forEach((image) => {
        ids.push(image["id"]);
      });

      return ids;
    }

    function changeOrder() {
      questionsStore.chageOrderOfImages({
        order: prepareDataToChangeOrder(),
      });
    }

    function onUploadCompleted() {
      questionsStore.getImages(route.params.id);
    }

    function removeAll() {
      confirm.require({
        message: "This will remove all selected images ?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        acceptClass: "p-button-danger",

        accept: () => {
          questionsStore.removeImages({ ids: getIdsToDelete() });
        },
        reject: () => {},
      });
    }

    return {
      questionsStore,
      route,
      selectedImages,
      getImageUploadRoute,
      beforeSend,
      changeOrder,
      removeAll,
      onUploadCompleted,
      moment,
    };
  },
};
</script>
