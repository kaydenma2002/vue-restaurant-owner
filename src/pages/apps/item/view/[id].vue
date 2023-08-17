<script setup>
import { useItemListStore } from "@/views/apps/item/useItemListStore";
import ClaimBioPanel from "@/views/apps/item/view/ClaimBioPanel.vue";

const itemListStore = useItemListStore();
const route = useRoute();
const claimData = ref();
const userTab = ref(null);



itemListStore.fetchItem(Number(route.params.id)).then((response) => {
  claimData.value = response.data;
});
</script>

<template>
  <VRow v-if="claimData">
    <VCol cols="12" md="12" lg="12">
      <ClaimBioPanel :claim-data="claimData" />
    </VCol>

    
  </VRow>
</template>
