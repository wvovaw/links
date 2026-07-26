<template>
  <div class="mockup-phone">
    <div class="camera" />
    <div class="display">
      <div class="artboard artboard-demo">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* srouce: daisy-ui */
.mockup-phone {
  display: inline-block;
  border: 4px solid #444;
  border-radius: 50px;
  background-color: #000;
  padding: 10px;
  margin: 0 auto;
}
.mockup-phone .display {
  border-radius: 40px;
  margin-top: -25px;
}
.mockup-phone .camera {
  position: relative;
  top: 0;
  left: 0;
  background: #000;
  height: 25px;
  width: 150px;
  margin: 0 auto;
  border-bottom-left-radius: 17px;
  border-bottom-right-radius: 17px;
  z-index: 11;
}
.artboard {
  width: 360px;
  min-height: 680px;
  height: fit-content;
}
.mockup-phone .camera:after {
  content: "";
  position: absolute;
  top: 20%;
  left: 70%;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  background-color: #0f0b25;
}
.mockup-phone .camera:before {
  content: "";
  position: absolute;
  top: 35%;
  left: 50%;
  width: 50px;
  height: 4px;
  border-radius: 5px;
  background-color: #0c0b0e;
  transform: translate(-50%,-50%);
}
.artboard-demo {
  background-color: var(--goku);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 2.5rem;
  box-shadow: 0 1px 3px #0000001a, 0 1px 2px #0000000f;
}
</style>
