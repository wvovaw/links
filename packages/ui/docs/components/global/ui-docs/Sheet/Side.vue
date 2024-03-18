<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UISheet } from "~ui/Sheet";
import { UIButton } from "~ui/Button";

const side = ref<"right" | "top" | "left" | "bottom">("right");
</script>

<template>
  <PreviewFrame>
    <UISheet.Root>
      <UISheet.Trigger as-child>
        <UIButton @click="side = 'top'">
          Top
        </UIButton>
      </UISheet.Trigger>
      <UISheet.Trigger as-child>
        <UIButton @click="side = 'right'">
          Right
        </UIButton>
      </UISheet.Trigger>
      <UISheet.Trigger as-child>
        <UIButton @click="side = 'left'">
          Left
        </UIButton>
      </UISheet.Trigger>
      <UISheet.Trigger as-child>
        <UIButton @click="side = 'bottom'">
          Bottom
        </UIButton>
      </UISheet.Trigger>
      <UISheet.Content :side="side">
        <UISheet.Header>
          <UISheet.Title>Sheet title</UISheet.Title>
          <UISheet.Subtitle>Sheet subtitle</UISheet.Subtitle>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad, ducimus deleniti mollitia sunt nisi esse quaerat ullam provident aspernatur vitae doloremque, dicta aliquid voluptates, nobis eius harum voluptatem magnam saepe eos autem. Alias incidunt aspernatur a, debitis perspiciatis similique explicabo. Ea quo quaerat fuga quibusdam, amet perspiciatis repellendus dolore placeat labore tempore atque consequatur ipsum commodi vero accusantium voluptatum explicabo, nesciunt vel recusandae voluptatem iste! Illum voluptates, obcaecati sed veritatis delectus alias amet id qui reprehenderit velit vitae, dolores quasi. Amet excepturi eius hic illo iure eos sequi, at voluptate nostrum quisquam! Minus commodi quos dolor architecto culpa recusandae sint sed dolorum ea. Deleniti laudantium aliquam officiis praesentium animi corporis nostrum totam amet quidem alias saepe voluptatem expedita quibusdam mollitia reiciendis, excepturi nihil natus.
          <UISheet.Footer>
            <UIButton>Footer button</UIButton>
          </UISheet.Footer>
        </UISheet.Header>
      </UISheet.Content>
    </UISheet.Root>
  </PreviewFrame>
</template>
