<script setup>
import { onMounted } from "vue";

import { avatarText, kFormatter } from "@core/utils/formatters";
const props = defineProps({
  claimData: {
    type: Object,
    required: true,
  },
});

const standardPlan = {
  plan: "Standard",
  price: 99,
  benefits: ["10 Items", "Up to 10GB storage", "Basic Support"],
};
const resolveClaimStatusVariant = (stat) => {
  const statLowerCase = stat;
  if (statLowerCase === "Pending") return "warning";
  if (statLowerCase === "Active") return "success";
  if (statLowerCase === "Deactive") return "secondary";

  return "primary";
};
const resolveClaimStatusText = (stat) => {
  if (stat === "Pending") return "Pending";
  if (stat === "Active") return "Active";
  if (stat === "Deactive") return "Deactive";

  return "";
};
const isClaimInfoEditDialogVisible = ref(false);
const isUpgradePlanDialogVisible = ref(false);

const resolveClaimRoleVariant = (role) => {
  if (role === "subscriber")
    return {
      color: "primary",
      icon: "mdi-account-outline",
    };
  if (role === "author")
    return {
      color: "warning",
      icon: "mdi-cog-outline",
    };
  if (role === "maintainer")
    return {
      color: "success",
      icon: "mdi-database-outline",
    };
  if (role === "editor")
    return {
      color: "info",
      icon: "mdi-pencil-outline",
    };
  if (role === "admin")
    return {
      color: "error",
      icon: "mdi-dns-outline",
    };

  return {
    color: "primary",
    icon: "mdi-account-outline",
  };
};
</script>

<template>
  <VRow>
    <!-- SECTION Claim Details -->
    <VCol cols="12">
      <VCard v-if="props.claimData">
        
        

        <!-- 👉 Details -->
        <VCardText>
          <h6 class="text-h6">Details</h6>

          <VDivider class="my-4" />

          <!-- 👉 Claim Details list -->
          <VList class="card-list">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-sm font-weight-medium">
                  Item:
                  <span class="text-body-2">
                    {{ props.claimData?.title }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-sm font-weight-medium">
                  Restaurant:
                  <span class="text-body-2">{{
                    props.claimData?.restaurant?.name
                  }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            

            <VListItem>
              <VListItemTitle>
                <h6 class="text-sm font-weight-medium">
                  Category:
                  <span class="text-capitalize text-body-2">{{
                    props.claimData?.category
                  }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-sm font-weight-medium">
                  Price:
                  <span class="text-body-2">
                    ${{ props.claimData?.price }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            
          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center gap-4">
          <VBtn variant="elevated" @click="isClaimInfoEditDialogVisible = true">
            Edit
          </VBtn>
          <VBtn variant="outlined" color="error"> Deactivate </VBtn>
        </VCardText>
      </VCard>
      
    </VCol>
    <!-- !SECTION -->

    <!-- SECTION Current Plan -->
    <VCol cols="12">
      <VCard flat class="current-plan">
        <VCardText class="d-flex">
          <!-- 👉 Standard Chip -->
          <VChip label color="primary" density="comfortable"> Standard </VChip>

          <VSpacer />

          <!-- 👉 Current Price  -->
          <div class="d-flex align-center">
            <sup class="text-primary text-sm font-weight-regular">$</sup>
            <h3 class="text-h3 text-primary font-weight-regular">99</h3>
            <sub class="mt-3"
              ><h6 class="text-sm font-weight-regular">/ month</h6></sub
            >
          </div>
        </VCardText>

        <VCardText>
          <!-- 👉 Price Benefits -->
          <VList class="card-list">
            <VListItem v-for="benefit in standardPlan.benefits" :key="benefit">
              <VIcon
                size="10"
                color="#E0E0E0"
                class="me-2"
                icon="mdi-checkbox-blank-circle"
              />
              <span>{{ benefit }}</span>
            </VListItem>
          </VList>

          <!-- 👉 Days -->
          <div class="my-6">
            <div class="d-flex mt-3 mb-2">
              <h6 class="text-sm font-weight-medium">Days</h6>
              <VSpacer />
              <h6 class="text-sm font-weight-medium">26 of 30 Days</h6>
            </div>

            <!-- 👉 Progress -->
            <VProgressLinear
              rounded
              :model-value="86"
              height="8"
              color="primary"
            />

            <p class="text-xs mt-2">4 days remaining</p>
          </div>

          <!-- 👉 Upgrade Plan -->
          <VBtn block @click="isUpgradePlanDialogVisible = true">
            Upgrade Plan
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>

  <!-- 👉 Edit claim info dialog -->
  <ClaimInfoEditDialog
    @claimUpdateInfo="$emit('claimUpdateInfo', true)"
    v-model:isDialogVisible="isClaimInfoEditDialogVisible"
    :claim-data="props.claimData"
  />

  <!-- 👉 Upgrade plan dialog -->
  <ClaimUpgradePlanDialog
    v-model:isDialogVisible="isUpgradePlanDialogVisible"
  />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.current-plan {
  border: 2px solid rgb(var(--v-theme-primary));
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
