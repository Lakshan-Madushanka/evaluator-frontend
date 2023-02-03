<template>
  <ConfirmDialog></ConfirmDialog>

  <AdminTableLayout>
    <template #table>
      <div>
        <DataTable
          :value="categoriesStore.categories && categoriesStore.categories.data"
          responsive-layout="scroll"
          :loading="categoriesStore.loading"
          striped-rows
          data-key="id"
          filter-display="row"
        >
          <template #empty>
            <p
              v-if="!categoriesStore.loading"
              class="p-4 text-center text-2xl bg-blue-200"
            >
              No records found.
            </p>
          </template>

          <template #header>
            <div class="flex justify-between items-center text-2xl uppercase">
              <div class="flex">
                <p class="mr-2">Categories</p>
                <i
                  class="pi pi-eye text-blue-600 hover:cursor-pointer"
                  style="font-size: 2rem"
                  @click="toggleColumnsMenu"
                ></i>
                <MenuComponent
                  ref="columnsMenuRef"
                  :model="columns"
                  :popup="true"
                >
                  <template #item="slotProps">
                    <div class="flex items-center p-2 hover:cursor-pointer">
                      <i
                        :class="
                          columnVisibility[
                            snake(
                              lowercaseFirstLetter(slotProps['item']['label'])
                            )
                          ]
                            ? 'pi pi-eye'
                            : 'pi pi-eye-slash'
                        "
                        class="mr-2"
                      ></i>
                      <p>{{ slotProps.item.label }}</p>
                    </div>
                  </template>
                </MenuComponent>
              </div>

              <div class="flex">
                <i
                  class="pi pi-align-justify hover:cursor-pointer lg:!hidden"
                  @click="toggleActionsMenu"
                ></i>
                <MenuComponent
                  ref="actionsMenuRef"
                  :model="actions"
                  :popup="true"
                />

                <div class="hidden lg:flex">
                  <PrimeButton
                    icon="pi pi-refresh"
                    icon-pos="right"
                    class="!w-12 !py-1 !mr-4"
                    @click="reset"
                  />
                  <PrimeButton
                    icon="pi pi-filter"
                    class="!mr-4 !py-1"
                    icon-pos="right"
                    label="Apply Filters"
                    :disabled="Object.keys(filters).length === 0"
                    @click="applyFilters"
                  />
                  <PrimeButton
                    icon="pi pi-plus"
                    label="New Category"
                    class="!py-1 !mr-4"
                    icon-pos="right"
                    @click="
                      () => router.push({ name: 'admin.categories.create' })
                    "
                  />
                </div>
              </div>
            </div>
          </template>

          <Column field="no" header="No">
            <template #body="slotProps"> {{ slotProps.index + 1 }}</template>
          </Column>
          <Column field="id" header="Id" :hidden="!columnVisibility.id">
            <template #body="slotProps"> {{ slotProps.data.id }}</template>
          </Column>
          <Column
            field="name"
            :show-filter-menu="false"
            :hidden="!columnVisibility.name"
          >
            <template #header>
              <div class="flex justify-between items-center w-full">
                <p>Name</p>
                <SortComponent @direction-change="query.sort.name = $event" />
              </div>
            </template>
            <template #filter>
              <span class="p-input-icon-right">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters.name"
                  type="text"
                  placeholder="Search"
                  @keyup.enter="applyFilters"
                />
              </span>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.attributes.name }}</template
            >
          </Column>

          <Column
            field="created_at"
            header="Created at"
            :hidden="!columnVisibility.created_at"
          >
            <template #body="slotProps">
              {{
                moment(slotProps.data.attributes.created_at).format(
                  "ddd, MMM D, yyyy, h:mm a"
                )
              }}</template
            >
          </Column>

          <Column
            field="Actions"
            header="Actions"
            :hidden="!columnVisibility.actions"
          >
            <template #body="slotProps">
              <span class="p-buttonset">
                <PrimeButton
                  class="p-button-sm"
                  icon="pi pi-file-edit"
                  title="Edit"
                  @click="
                    () =>
                      router.push({
                        name: 'admin.categories.edit',
                        params: { id: slotProps.data.id },
                      })
                  "
                />
                <PrimeButton
                  class="p-button-danger p-button-sm"
                  icon="pi pi-trash "
                  title="Delete"
                  @click="deleteCategory(slotProps.data.id)"
                />
              </span>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </AdminTableLayout>
</template>

<script>
import { onMounted, ref, reactive, watch } from "vue";

import { useCategoriesStore } from "@/stores/categories/index";
import { useAuthStore } from "@/stores/auth";

import { useRouter } from "vue-router";

import moment from "moment/moment";

import AdminTableLayout from "@/views/layouts/AdminTableLayout.vue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import PrimeButton from "primevue/button";
import MenuComponent from "primevue/menu";
import InputText from "primevue/inputtext";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";

import SortComponent from "@/components/SortComponent.vue";

import { lowercaseFirstLetter, snake } from "@/helpers";

export default {
  components: {
    AdminTableLayout,
    PrimeButton,
    DataTable,
    Column,
    SortComponent,
    InputText,
    MenuComponent,
    ConfirmDialog,
  },
  setup() {
    const confirm = useConfirm();

    const categoriesStore = useCategoriesStore();
    const authStore = useAuthStore();

    const router = useRouter();

    const query = reactive({
      sort: {},
      pagination: { number: 1, size: 10 },
    });

    const columnsMenuRef = ref();
    const columnVisibility = reactive({
      id: true,
      name: true,
      created_at: true,
      actions: true,
    });
    const columns = ref([
      {
        label: "Id",
        command: () => {
          columnVisibility.id = !columnVisibility.id;
        },
      },
      {
        label: "Name",
        command: () => {
          columnVisibility.name = !columnVisibility.name;
        },
      },
      {
        label: "Created at",
        command: () => {
          columnVisibility.created_at = !columnVisibility.created_at;
        },
      },
      {
        label: "Actions",
        command: () => {
          columnVisibility.actions = !columnVisibility.actions;
        },
      },
    ]);

    const filters = ref({});
    const showPaginator = ref(true);

    const actionsMenuRef = ref();
    const actions = ref([
      {
        label: "Refresh",
        icon: "pi pi-refresh",
        command: () => reset(),
      },
      {
        label: "Apply Filters",
        icon: "pi pi-filter",
        command: () => applyFilters(),
      },
      {
        label: "New Category",
        icon: "pi pi-plus",
        command: () => router.push({ name: "admin.categories.create" }),
      },
    ]);

    onMounted(() => {
      categoriesStore.getAll({
        query: { pagination: { number: 1, size: 10 } },
      });
    });

    watch(categoriesStore, (newUsersStore) => {
      if (newUsersStore.status === "deleted") {
        categoriesStore.getAll({ query: { ...query, filters: filters.value } });
      }
    });

    watch(query, (newQuery) => {
      categoriesStore.getAll({
        query: { ...newQuery, filters: filters.value },
      });
    });

    function applyFilters() {
      showPaginator.value = false; // Reset the pagination

      categoriesStore.getAll({ query: { filters: filters.value, ...query } });
    }

    function reset() {
      //Reset filters
      filters.value = {};

      //Reset sort
      query.sort = {};

      categoriesStore.getAll({
        query: {},
      });
    }

    function toggleActionsMenu(event) {
      actionsMenuRef.value.toggle(event);
    }

    function toggleColumnsMenu(event) {
      columnsMenuRef.value.toggle(event);
    }

    function deleteCategory(id) {
      confirm.require({
        message:
          "Do you want to delete this record? [This action cannot be undone !]",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        iconClass: "bg-red-500",
        acceptClass: "p-button-danger",
        acceptLabel: "Yes Delete",
        accept: () => {
          categoriesStore.deleteCategory(id);
        },
        reject: () => {},
      });
    }

    return {
      categoriesStore,
      moment,
      query,
      filters,
      applyFilters,
      showPaginator,
      reset,
      deleteCategory,
      columns,
      columnsMenuRef,
      toggleColumnsMenu,
      columnVisibility,
      lowercaseFirstLetter,
      snake,
      authStore,
      router,
      actions,
      actionsMenuRef,
      toggleActionsMenu,
    };
  },
};
</script>
