<template>
  <AdminTableLayout>
    <template #table>
      <div>
        <DataTable
          :value="usersStore.users && usersStore.users.data"
          responsive-layout="scroll"
          :loading="usersStore.loading"
          striped-rows
          data-key="id"
          filter-display="row"
        >
          <template #empty>
            <p
              v-if="!usersStore.loading"
              class="p-4 text-center text-2xl bg-blue-200"
            >
              No records found.
            </p>
          </template>

          <template #header>
            <div class="flex justify-between items-center text-2xl uppercase">
              <p>Users</p>
              <div>
                <PrimeButton
                  icon="pi pi-filter"
                  class="!mr-4 !py-1"
                  icon-pos="right"
                  label="Apply Filters"
                  :disabled="Object.keys(filters).length === 0"
                  @click="applyFilters"
                />
                <PrimeButton
                  icon="pi pi-refresh"
                  icon-pos="right"
                  class="!w-12 !py-1"
                  @click="reset"
                />
              </div>
            </div>
          </template>
          <Column field="no" header="No">
            <template #body="slotProps"> {{ slotProps.index + 1 }}</template>
          </Column>
          <Column field="id" header="Id">
            <template #body="slotProps"> {{ slotProps.data.id }}</template>
          </Column>
          <Column field="name" header="Name" :show-filter-menu="false">
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
          <Column field="email" header="Email" :show-filter-menu="false">
            <template #filter>
              <span class="p-input-icon-right">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters.email"
                  type="text"
                  placeholder="Search"
                  @keyup.enter="applyFilters"
                />
              </span>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.attributes.email }}</template
            >
          </Column>
          <Column field="role" :show-filter-menu="false">
            <template #filter
              ><Dropdown
                v-model="filters.role"
                :options="roles"
                option-label="name"
              />
            </template>
            <template #header>
              <div class="flex justify-between w-full items-center">
                <p>Role</p>
                <SortComponent @direction-change="query.sort.role = $event" />
              </div>
            </template>
            <template #body="slotProps">
              <Tag
                :class="{
                  '!bg-blue-800':
                    slotProps.data.attributes.role === 'SUPER_ADMIN',
                  '!bg-blue-600': slotProps.data.attributes.role === 'ADMIN',
                  '!bg-blue-400': slotProps.data.attributes.role === 'REGULAR',
                }"
              >
                {{ ROLES[slotProps.data.attributes.role]["name"] }}
              </Tag>
            </template>
          </Column>
          <Column field="created_at">
            <template #header>
              <div class="flex justify-between items-center w-full">
                <p>Created at</p>
                <SortComponent
                  @direction-change="query.sort.created_at = $event"
                />
              </div>
            </template>
            <template #body="slotProps">
              {{
                moment(slotProps.data.attributes.created_at).format(
                  "ddd, MMM D, yyyy, h:mm a"
                )
              }}</template
            >
          </Column>

          <template #footer>
            <Paginator
              v-if="usersStore.users && showPaginator"
              :rows="usersStore.users && usersStore.users.meta.per_page"
              :total-records="usersStore.users && usersStore.users.meta.total"
              @page="onPage"
            >
            </Paginator>
            <p
              class="hidden sm:flex p-2 relative bottom-[-20px] w-full justify-center lg:justify-end"
            >
              {{ usersStore.users ? usersStore.users.meta.total : 0 }} records
              found.
            </p>
          </template>
        </DataTable>
      </div>
    </template>
  </AdminTableLayout>
</template>

<script>
import { onMounted, ref, reactive, watch } from "vue";
import Paginator from "@/components/PaginatorComponent.vue";

import { useUsersStore } from "@/stores/users";

import moment from "moment/moment";

import AdminTableLayout from "@/views/layouts/AdminTableLayout.vue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import PrimeButton from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";

import SortComponent from "@/components/SortComponent.vue";

import { ROLES } from "@/constants";

export default {
  components: {
    AdminTableLayout,
    PrimeButton,
    DataTable,
    Column,
    Tag,
    Paginator,
    SortComponent,
    InputText,
    Dropdown,
  },
  setup() {
    onMounted(() => {
      usersStore.getAll({
        query: { pagination: { number: 1, size: 10 } },
      });
    });

    const usersStore = useUsersStore();

    const query = reactive({
      sort: {},
      pagination: { number: 1, size: 10 },
    });
    const filters = ref({ role: { name: "All", value: "" } });
    const showPaginator = ref(true);

    const roles = [
      { name: "All", value: "" },
      { name: "Super Admin", value: "SUPER_ADMIN" },
      { name: "Admin", value: "ADMIN" },
      { name: "Regular", value: "REGULAR" },
    ];

    watch(query, (newQuery) => {
      usersStore.getAll({ query: { ...newQuery, filters: filters.value } });
    });

    // We need to reset show paginator if it is disabled
    watch(
      () => usersStore.loading,
      (loading) => {
        if (!loading) {
          showPaginator.value = true;
        }
      }
    );

    function onPage(event) {
      query.pagination.number = event.page + 1;
      query.pagination.size = event.rows;
    }

    function applyFilters() {
      showPaginator.value = false; // Reset the pagination

      usersStore.getAll({ query: { filters: filters.value, ...query } });
    }

    function reset() {
      //Reset pagnator
      showPaginator.value = false;
      query.pagination = { number: 1, size: 10 };

      //Reser filters
      filters.value = { role: { name: "All", value: "" } };

      //Reser sort
      query.sort = {};

      usersStore.getAll({
        query: { pagination: { number: 1, size: 10 } },
      });
    }

    return {
      usersStore,
      onPage,
      moment,
      query,
      filters,
      applyFilters,
      roles,
      showPaginator,
      reset,
      ROLES,
    };
  },
};
</script>
