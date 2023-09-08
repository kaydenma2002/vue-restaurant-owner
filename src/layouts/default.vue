<script setup>
import { useSkins } from "@core/composable/useSkins";
import { useThemeConfig } from "@core/composable/useThemeConfig";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
// @layouts plugin
import { AppContentLayoutNav } from "@layouts/enums";
import { useRouter } from "vue-router";
import echo from "../plugins/echo";

const DefaultLayoutWithHorizontalNav = defineAsyncComponent(() =>
  import("./components/DefaultLayoutWithHorizontalNav.vue")
);
const DefaultLayoutWithVerticalNav = defineAsyncComponent(() =>
  import("./components/DefaultLayoutWithVerticalNav.vue")
);
const { width: windowWidth } = useWindowSize();
const { appContentLayoutNav, switchToVerticalNavOnLtOverlayNavBreakpoint } =
  useThemeConfig();

// Remove below composable usage if you are not using horizontal nav layout in your app
switchToVerticalNavOnLtOverlayNavBreakpoint(windowWidth);

const { layoutAttrs, injectSkinClasses } = useSkins();
const router = useRouter();

injectSkinClasses();

echo.channel("order-create").listen("OrderCreated", (data) => {
  if (
    data.order.restaurant.user_id ===
    JSON.parse(localStorage.getItem("userData")).id
  ) {
    toast.success(
      `New Order was placed successfully by ${data.order.user.name} at ${data.order.restaurant.name}`,
      {
        onClick: () =>
          router.push({
            name: "apps-order-view-id",
            params: { id: data.order.id },
          }),
        dangerouslyHTMLString: true, // can override the global option
      }
    );
  }
});
</script>

<template>
  <template v-if="appContentLayoutNav === AppContentLayoutNav.Vertical">
    <DefaultLayoutWithVerticalNav v-bind="layoutAttrs" />
  </template>
  <template v-else>
    <DefaultLayoutWithHorizontalNav v-bind="layoutAttrs" />
  </template>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
