<script setup>
import { paginationMeta } from "@/@fake-db/utils";
import { useItemListStore } from "@/views/apps/item/useItemListStore";
import { debounce } from "lodash";
import { VDataTableServer } from "vuetify/labs/VDataTable";

const itemListStore = useItemListStore();
const searchQuery = ref("");
const selectedRole = ref("");
const selectedPlan = ref("");
const selectedStatus = ref("null");
const totalPage = ref(1);
const totalItems = ref(0);
const items = ref([]);

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
});

// Headers
const headers = [
  {
    title:"ITEM",
    key: "title",
  },
  {
    title:"CATEGORY",
    key: "category",
  },
  {
    title:"PRICE",
    key: "price",
  },
  {
    title: "RESTAURANT",
    key: "restaurant_name",
  },
  {
    title: "CITY",
    key: "city",
  },
  
  {
    title: "STATE",
    key: "state",
  },
  {
    title: "ZIP CODE",
    key: "zip_code",
  },
  
  

  {
    title: "STATUS",
    key: "status",
  },
  {
    title: "ACTION",
    key: "actions",
    sortable: false,
  },
];

// 👉 Fetching items
const fetchItems = debounce(() => {
  itemListStore
    .fetchItems({
      q: searchQuery.value,
      status: selectedStatus.value,

      options: options.value,
    })
    .then((response) => {
      console.log(response);
      items.value = response.data.data;
      totalPage.value = response.data.total;
      totalItems.value = response.data.total;
      options.value.page = response.data.current_page;
    })
    .catch((error) => {
      console.error(error);
    });
}, 100);
fetchItems();

watch(
  () => options.value.itemsPerPage,
  (count) => {
    fetchItems();
  }
);

watch(
  () => options.value.page,
  (count) => {
    fetchItems();
  }
);
watch(
  () => options.value.sortBy,
  (count) => {
    fetchItems();
  }
);
watch([searchQuery, selectedStatus], () => {
  fetchItems();
});
// 👉 search filters
const roles = [
  {
    title: "Admin",
    value: "admin",
  },
  {
    title: "Author",
    value: "author",
  },
  {
    title: "Editor",
    value: "editor",
  },
  {
    title: "Maintainer",
    value: "maintainer",
  },
  {
    title: "Subscriber",
    value: "subscriber",
  },
];

const plans = [
  {
    title: "Basic",
    value: "basic",
  },
  {
    title: "Company",
    value: "company",
  },
  {
    title: "Enterprise",
    value: "enterprise",
  },
  {
    title: "Team",
    value: "team",
  },
];

const status = [
  {
    title: "All",
    value: "null",
  },
  {
    title: "Pending",
    value: "0",
  },
  {
    title: "Approve",
    value: "1",
  },
  {
    title: "Decline",
    value: "2",
  },
];

// const resolveUserRoleVariant = role => {
//   const roleLowerCase = role.toLowerCase()
//   if (roleLowerCase === 'subscriber')
//     return {
//       color: 'primary',
//       icon: 'mdi-account-outline',
//     }
//   if (roleLowerCase === 'author')
//     return {
//       color: 'warning',
//       icon: 'mdi-cog-outline',
//     }
//   if (roleLowerCase === 'maintainer')
//     return {
//       color: 'success',
//       icon: 'mdi-chart-donut',
//     }
//   if (roleLowerCase === 'editor')
//     return {
//       color: 'info',
//       icon: 'mdi-pencil-outline',
//     }
//   if (roleLowerCase === 'admin')
//     return {
//       color: 'error',
//       icon: 'mdi-laptop',
//     }

//   return {
//     color: 'primary',
//     icon: 'mdi-account-outline',
//   }
// }

const resolveUserStatusVariant = (stat) => {
  const statLowerCase = stat;
  if (statLowerCase === "0") return "warning";
  if (statLowerCase === "1") return "success";
  if (statLowerCase === "2") return "secondary";

  return "primary";
};
const resolveUserStatusText = (stat) => {
  if (stat === "0") return "Pending";
  if (stat === "1") return "Online";
  if (stat === "2") return "Offline";

  return "";
};

const addNewUser = (itemData) => {
  itemListStore.addUser(itemData);

  // refetch User
  fetchItems();
};
const approveClaim = (id) => {
  itemListStore.approveClaim(id).then((res) => {
    console.log(res);
  });

  // refetch User
  fetchItems();
};
const deleteUser = (id) => {
  itemListStore.deleteUser(id);

  // refetch User
  fetchItems();
};
</script>

<template>
  <section>
    <VCard title="Filters" class="mb-6">
      <VCardText>
        <VRow>
          <!-- 👉 Select Role -->
          <VCol cols="12" sm="4">
            <VSelect
              v-model="selectedRole"
              label="Select Role"
              :items="roles"
              clearable
              clear-icon="mdi-close"
            />
          </VCol>

          <!-- 👉 Select Plan -->
          <VCol cols="12" sm="4">
            <VSelect
              v-model="selectedPlan"
              label="Select Plan"
              :items="plans"
              clearable
              clear-icon="mdi-close"
            />
          </VCol>

          <!-- 👉 Select Status -->
          <VCol cols="12" sm="4">
            <VSelect
              v-model="selectedStatus"
              label="Select Status"
              :items="status"
              clearable
              clear-icon="mdi-close"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard>
      <VCardText class="d-flex flex-wrap gap-4">
        <!-- 👉 Export button -->
        <VBtn
          variant="outlined"
          color="secondary"
          prepend-icon="mdi-tray-arrow-up"
        >
          Export
        </VBtn>

        <VSpacer />

        <div class="app-item-search-filter d-flex align-center gap-6">
          <!-- 👉 Search  -->
          <VTextField
            v-model="searchQuery"
            placeholder="Search Owner"
            density="compact"
          />

          <!-- 👉 Add Owner button -->
        </div>
      </VCardText>

      <!-- SECTION data table -->
      <VDataTableServer
        v-model:items-per-page="options.itemsPerPage"
        v-model:page="options.page"
        :items="items"
        :items-length="totalItems"
        :headers="headers"
        show-select
        class="rounded-0"
        @update:options="options = $event"
      >
        <!-- User -->
        <template #item.restaurant_name="{ item }">
          <span class="text-sm">
            {{ item.raw?.restaurant.name }}
          </span>
        </template>

        <!-- city -->
        <template #item.city="{ item }">
          <span class="text-sm">
            {{ item.raw?.restaurant.city }}
          </span>
        </template>
        <template #item.phone="{ item }">
          <span class="text-sm">
            {{ item.raw?.restaurant.phone }}
          </span>
        </template>
        <template #item.state="{ item }">
          <span class="text-sm">
            {{ item.raw?.restaurant.state }}
          </span>
        </template>
        <template #item.zip_code="{ item }">
          <span class="text-sm">
            {{ item.raw?.restaurant.zip_code }}
          </span>
        </template>
        <template #item.status="{ item }">
          <VChip
            :color="resolveUserStatusVariant(item.raw?.status)"
            density="comfortable"
            class="text-capitalize"
          >
            {{ resolveUserStatusText(item.raw?.status) }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <VBtn icon variant="text" size="small" color="medium-emphasis">
            <VIcon size="24" icon="mdi-dots-vertical" />

            <VMenu activator="parent">
              <VList>
                <VListItem
                  :to="{
                    name: 'apps-item-view-id',
                    params: { id: item.raw?.id },
                  }"
                >
                  <template #prepend>
                    <VIcon icon="mdi-eye-outline" />
                  </template>
                  <VListItemTitle>View</VListItemTitle>
                </VListItem>

                
              </VList>
            </VMenu>
          </VBtn>
        </template>

        <!-- Pagination -->
        <template #bottom>
          <VDivider />

          <div class="d-flex justify-end gap-x-6 pa-2 flex-wrap">
            <div class="d-flex align-center gap-x-2 text-sm">
              Rows Per Page:
              <VSelect
                v-model="options.itemsPerPage"
                class="per-page-select text-high-emphasis"
                variant="plain"
                density="compact"
                :items="[10, 20, 25, 50, 100]"
              />
            </div>

            <span class="d-flex align-center text-sm me-2 text-high-emphasis">{{
              paginationMeta(options, totalItems)
            }}</span>

            <div class="d-flex gap-x-2 align-center me-2">
              <VBtn
                icon="mdi-chevron-left"
                class="flip-in-rtl"
                variant="text"
                density="comfortable"
                color="default"
                :disabled="options.page <= 1"
                @click="options.page <= 1 ? (options.page = 1) : options.page--"
              />

              <VBtn
                icon="mdi-chevron-right"
                class="flip-in-rtl"
                density="comfortable"
                variant="text"
                color="default"
                :disabled="
                  options.page >= Math.ceil(totalItems / options.itemsPerPage)
                "
                @click="
                  options.page >= Math.ceil(totalItems / options.itemsPerPage)
                    ? (options.page = Math.ceil(
                        totalItems / options.itemsPerPage
                      ))
                    : options.page++
                "
              />
            </div>
          </div>
        </template>
      </VDataTableServer>
      <!-- SECTION -->
    </VCard>

    <!-- 👉 Add New User -->
  </section>
</template>

<style lang="scss">
.app-item-search-filter {
  inline-size: 24.0625rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.item-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
