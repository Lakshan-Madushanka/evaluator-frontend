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
              <PrimeButton icon="pi pi-refresh" class="!w-12" />
            </div>
          </template>
          <Column field="no" header="No">
            <template #body="slotProps"> {{ slotProps.index + 1 }}</template>
          </Column>
          <Column field="id" header="Id">
            <template #body="slotProps"> {{ slotProps.data.id }}</template>
          </Column>
          <Column field="name" header="Name">
            <template #body="slotProps">
              {{ slotProps.data.attributes.name }}</template
            >
          </Column>
          <Column field="email" header="Email">
            <template #body="slotProps">
              {{ slotProps.data.attributes.email }}</template
            >
          </Column>
          <Column field="role">
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
                {{ slotProps.data.attributes.role }}
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
              v-if="usersStore.users"
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
import { onMounted, reactive, watch } from "vue";
import Paginator from "@/components/PaginatorComponent.vue";

import { useUsersStore } from "@/stores/users";

import moment from "moment/moment";

import AdminTableLayout from "@/views/layouts/AdminTableLayout.vue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import PrimeButton from "primevue/button";
import Tag from "primevue/tag";

import SortComponent from "@/components/SortComponent.vue";

export default {
  components: {
    AdminTableLayout,
    PrimeButton,
    DataTable,
    Column,
    Tag,
    Paginator,
    SortComponent,
  },
  setup() {
    onMounted(() => {
      usersStore.getAll({
        query: { pagination: { number: 1, size: 10 } },
      });
    });

    const usersStore = useUsersStore();

    const query = reactive({ sort: {}, pagination: { number: 1, size: 10 } });

    watch(query, (newQuery) => {
      console.log("query changed", query);
      usersStore.getAll({ query: newQuery });
    });

    function onPage(event) {
      query.pagination.number = event.page + 1;
      query.pagination.size = event.rows;
      console.log("event", event);
    }

    return { usersStore, onPage, moment, query };
  },
};
</script>
