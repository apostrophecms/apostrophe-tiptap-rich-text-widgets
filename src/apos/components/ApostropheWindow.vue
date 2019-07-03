<template>
  <div class="apos-window-wrapper">
    <div class="apos-window-inner">
      <slot name="body">
        default body
      </slot>
      <div class="apos-window-buttons">
        <slot name="footer">
          default footer
          <button class="apos-window-button" @click="$emit('close')">
            OK
          </button>
        </slot>
      </div>
    </div>
    <div class="apos-window-bubble">
      <svg width="24px" height="36px" viewBox="0 0 24 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g transform="translate(-261.000000, -214.000000)" fill="#FFFFFF" fill-rule="nonzero">
            <path d="M256.193424,214.329547 L274.122356,214.329547 C276.88378,214.329547 279.122356,216.568124 279.122356,219.329547 L279.122356,237.25848 C279.122356,240.019903 276.88378,242.25848 274.122356,242.25848 C272.796274,242.25848 271.524504,241.731695 270.586823,240.794014 L252.65789,222.865081 C250.705269,220.91246 250.705269,217.746635 252.65789,215.794014 C253.595572,214.856332 254.867342,214.329547 256.193424,214.329547 Z" id="Rectangle-2" transform="translate(261.622356, 231.829547) rotate(-315.000000) translate(-261.622356, -231.829547) "></path>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApostropheWindow'
}
</script>

<style>
  .apos-window-wrapper {
    position: absolute;
    z-index: 999;
    bottom: calc(100% + 30px);
    color: black;
    font-size: 12px;
    font-family: sans-serif;
  }

  .apos-window-inner {
    position: relative;
    z-index: 2;
    background: #FFFFFF;
    min-width: 270px;
    padding: 20px;
    border-radius: 4px;
    left: 15px;
  }

  .apos-window-fieldset {
    border: none;
    margin-bottom: 30px;
  }

  .apos-window-fieldset input {
    width: 100%;
  }

  .apos-window-label {
    display: block;
    color: black;
    margin-bottom: 10px;
  }

  .apos-window-input {
    background: #F3F3F3;
    border: 1px solid #DBDBDB;
    border-radius: 5px;
    font-size: 14px;
    padding: 5px;
  }

  .apos-window-button {
    color: #323232;
    letter-spacing: 0.5px;
    padding: 10px 20px;
    background: #F3F3F3;
    border: 1px solid #DBDBDB;
    border-radius: 3px;
  }

  .apos-window-button--primary {
    background-color: #6516DD; 
    border: none;
    color: white;
  }

  .apos-window-buttons {
    display: flex;
    justify-content: flex-end;
  }

  .apos-window-buttons .apos-window-button {
    margin-left: 20px;
  }

  .apos-window-bubble {
    position: absolute;
    pointer-events: none;
    z-index: 1;
    bottom: 10px;
    left: 14px;
    bottom: -18px;
  }

</style>
