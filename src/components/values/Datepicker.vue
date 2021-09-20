<template>
  <b-container fluid>
    <b-form-group>
      <label for="datepicker">Choose a date</label>
      <b-form-datepicker 
        id="dateFromIn"
        type="date"
        name="dateFromIn"
        v-model="dateFromIn"
        locale="en"
      ></b-form-datepicker>
      <b-form-datepicker
        id="dateToIn"
        type="date"
        name="dateToIn"
        v-model="dateToIn"
        locale="en"
      ></b-form-datepicker>
    </b-form-group>
  </b-container>
</template>

<script>
export default {
  name: "Datepicker",
  props: ["dateFrom", "dateTo"],
  computed: {
    dateFromIn: {
      get: function () {
        return this.dateFrom;
      },
      set: function (newValue) {
        this.$emit("update:dateFrom", newValue);
      },
    },
    dateToIn: {
      get: function () {
        return this.dateTo;
      },
      set: function (newValue) {
        this.$emit("update:dateTo", newValue);
      },
    },
  },
};
</script>
