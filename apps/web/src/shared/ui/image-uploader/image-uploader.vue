<script setup lang="ts">
interface IImageUploaderProps {
  modelValue?: File;
}
const props = defineProps<IImageUploaderProps>();
const emit = defineEmits<{
  "update:modelValue": [file: File];
}>();

const id = useId();
const imageRef = ref<HTMLImageElement | null>();

function handleImageInputChange(e: InputEvent) {
  const el = e.target as HTMLInputElement;
  if (el.files && el.files[0])
    emit("update:modelValue", el.files[0]);
}

watchEffect(() => {
  if (props.modelValue)
    setImage(props.modelValue);
});
onMounted(() => {
  if (props.modelValue)
    setImage(props.modelValue);
});

function setImage(file: File) {
  if (imageRef.value) {
    const url = URL.createObjectURL(file);
    imageRef.value.src = url;
    imageRef.value.height = 200;
    imageRef.value.width = 200;
    imageRef.value.onload = function () {
      URL.revokeObjectURL((this as HTMLImageElement).src);
    };
  }
}
</script>

<template>
  <div>
    <input :id="id" type="file" accept=".jpg, .jpeg, .png" class="hidden" @change="(e) => handleImageInputChange(e as InputEvent)">
    <label :for="id" class="cursor-pointer">
      <div class="relative h-36 w-36 flex place-items-center justify-center overflow-hidden border border-trunks rounded-full bg-beerus text-trunks md:h-48 md:w-48">
        <img v-if="modelValue" ref="imageRef" alt="uploading avatar image" class="cover">
        <span v-else class="i-lucide:image block h-10 w-10" />
      </div>
    </label>
  </div>
</template>
