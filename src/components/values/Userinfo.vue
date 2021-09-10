<template>
  <b-container fluid>
    <b-form-group label="Name/Surname:" :label-for="nameInputId">
    <b-form-text v-show="framework === 'modify'">New Name and Surname, leave empty if you don't want to modify it
        your account will be modified </b-form-text>
      <b-form-input
        :id="nameInputId"
        type="text"
        name="nameInput"
        v-model="nameInput"
        maxlength="100"
        placeholder="Enter name"
        required
      />
    </b-form-group>

    <b-form-group label="Email:" :label-for="emailInputId">
      <b-form-text v-show="framework === 'modify'">New mail, leave empty if you don't want to modify it </b-form-text>
      <b-form-input
        :id="emailInputId"
        type="email"
        name="emailInput"
        v-model="emailInput"
        maxlength="100"
        placeholder="Enter email"
        required
      />
    </b-form-group>
  </b-container>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
export default {
  name: "Userinfo",
  props: ["required", "framework", "name", "email"],
  data() {
    return {
      nameInputId: "",
      emailInputId: "",
    };
  },
  computed: {
    nameInput: {
      get: function () {
        //vedi props
        return this.name;
      },
      set: function (newValue) {
        this.$emit("update:name", newValue);
      },
    },
    emailInput: {
      get: function () {
        //vedi props
        return this.email;
      },
      set: function (newValue) {
        this.$emit("update:email", newValue);
      },
    },
  },
  mounted() {
    // sto agendo dal punto di vista html
    if (this.required !== true) {
      document.getElementById(this.nameInputId).removeAttribute("required");
      document.getElementById(this.emailInputId).removeAttribute("required");
    }
  },
  created() {
    this.nameInputId = uuidv4();
    this.emailInputId = uuidv4();
  },
};
</script>