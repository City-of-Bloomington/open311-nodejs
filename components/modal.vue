<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header"></slot>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
.modal-mask {
  display: flex;
}

.modal-wrapper {
  .modal-container {
    hr {
      background-color: silver;
      height: 1px;
      border: none;
      margin: 15px 0;
    }

    h4 {
      padding: 0;
      letter-spacing: 1px;
      font-size: 18px;
      font-weight: $weight-semi-bold;
    }

    .modal-header {
      h4 {
        margin: 0;
      }
    }

    .modal-body {
      max-height: 300px;
      
      h4 {
        margin: 0 0 5px 0;
      }

      p {
        color: $text-color;
      } 
    }
  }
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>