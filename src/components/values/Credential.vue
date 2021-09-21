<template>
  <b-container fluid>
    <b-form-group label="Username:" :label-for="usernameInputId">
      <b-form-text v-show="framework === 'modify'">Select the account you want to modify. If you leave the USERNAME BLANK YOUR ACCOUNT WILL BE MODIFIED</b-form-text>
      <b-form-input
        :id="usernameInputId"
        type="text"
        name="usernameInput"
        v-model="usernameInput"
        placeholder="Enter username"
        required
      />
    </b-form-group>

    <b-form-group label="Password:" :label-for="passwordInputId">
       <b-form-text v-show="framework === 'modify'"> Insert the new password
      </b-form-text>
      <b-form-input
        :id="passwordInputId"
        type="password"
        name="passwordInput"
        v-model="passwordInput"
        placeholder="Enter password"
        required
      />
    </b-form-group>
  </b-container>
</template>

<script>
import  {v4 as uuidv4} from "uuid";
export default {
  name: "Credential",
  props: ["required", "framework", "username", "password"], //framework serve ad indicare il constesto in cui son usate le credenziali
  data() {
    return {
      usernameInputId: "",
      passwordInputId: "",
    };
  },
  computed:{
    usernameInput: {
      get: function() {
        //ritorna in username input il valore username che arriva dal parent (props)
        return this.username;
      },
      set: function(newValue) {
        this.$emit("update:username", newValue);
      },
    },
    passwordInput: {
      get: function() {
        //ritorna in password input il valore password che arriva dal parent (props)
        return this.password;
      },
      set: function(newValue) {
        this.$emit("update:password", newValue);
      },
    },
  },

  mounted() { //osservo il valore required che mi viene passato dal apretn (vedi props) e se è falso allora tolgo l'attributo required all'elemento html 
    if (this.required !== true) {
      document.getElementById(this.usernameInputId).removeAttribute("required");
      document.getElementById(this.passwordInputId).removeAttribute("required");
    }
  },
  created(){
    this.usernameInputId= uuidv4();
    this.passwordInputId= uuidv4();
  }
}
</script>
