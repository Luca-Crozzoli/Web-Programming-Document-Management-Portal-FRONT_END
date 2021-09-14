<template>
  <div>
    <article>
      <Navigationbar
        :applicant="'administrator'"
        :mainReport="'Resume'"
        :secondaryReport="'Administrators'"
        @showSection="showSection"
        @formRole="manageRole"
        @logout="displayMessage"
        >Admin page</Navigationbar
      >
      <!--sezione in cui mostro tutti gli attori che non sono amministratori-->
      <section v-show="section === 'home'">
        <header><h3>Resume</h3></header>
        <List
          :items="otherActorsList"
          :fields="otherActorsListFields"
          :tableDescription="description"
          :busy="loadData"
        />

        <b-form @submit.prevent="data" @reset.prevent="lastMonth">
          <Datepicker :dateFrom.sync="dateFrom" :dateTo.sync="dateTo" />
          <b-button type="submit" variant="primary">Filter</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </section>

      <!--sezione in cui mostro tutti gli amministratori-->
      <section v-show="section === 'list2'">
        <header><h3>Administrators List</h3></header>
        <List :items="adminList" :fields="adminListFields" :busy="loadData" />
      </section>

      <Registration
        v-show="section === 'registration'"
        :applicant="'administrator'"
        :role="formRole"
        @registrationuser="registration_user"
        @registration="displayMessage"
      />

      <ModInfo
        v-show="section === 'modifyInfo'"
        :applicant="'administrator'"
        :role="formRole"
        @modinfouser="modinfo_user"
        @modInfo="displayMessage"
      />

      <Delete
        v-show="section === 'delete'"
        :applicant="'administrator'"
        :listUsername="listUsername"
        @deleteusername="delete_user"
        @delete="displayMessage"
      />

      <Toasts :error="error" :warning="warning" :success="success" />
    </article>
  </div>
</template>

<script>
import Datepicker from "../components/values/Datepicker.vue";
import Delete from "../components/functions/Delete.vue";
import ModInfo from "../components/functions/ModInfo.vue";
import Registration from "../components/functions/Registration.vue";
import Navigationbar from "../components/layout/Navigationbar.vue";
import List from "../components/layout/List.vue";
import Toasts from "../components/layout/Toasts.vue";

import axios from "axios";
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("JWTToken")}`;

export default {
  name: "Admin_page",
  components: {
    Navigationbar,
    Registration,
    ModInfo,
    Delete,
    Datepicker,
    List,
    Toasts,
  },
  data() {
    return {
      section: "home",
      error: "",
      warning: "",
      success: "",

      loadData: false,
      otherActorsList: [], //report
      adminList: [],
      dateFrom: "",
      dateTo: "",
      dateFromConfirmed: "",
      dateToConfirmed: "",
      formRole: "",
      otherActorsListFields: [
        //report fields
        "name",
        { key: "loadedDoc", lable: "#doc", sortable: true },
        { key: "consumerAssociated", lable: "#cons", sortable: true },
        "details",
      ],
      adminListFields: ["name", "details"],
    };
  },
  computed: {
    //vado a valorizzare gli elementi
    listUsername: function () {
      let listUsers = [];
      this.otherActorsList.forEach((item) => {
        listUsers.push(item.username);
      });
      this.adminList.forEach((item) => {
        listUsers.push(item.username);
      });
      return listUsers;
    },
    description: function () {
      return (
        "data from " +
        this.dateFromConfirmed.substring(8, 10) +
        "/" +
        this.dateFromConfirmed.substring(5, 7) +
        "/" +
        this.dateFromConfirmed.substring(0, 4) +
        " to " +
        this.dateToConfirmed.substring(8, 10) +
        "/" +
        this.dateToConfirmed.substring(5, 7) +
        "/" +
        this.dateToConfirmed.substring(0, 4)
      );
    },
  },
  methods: {
    showSection(sectionin) {
      this.section = sectionin;
    },
    displayMessage(message) {
      if (message.startsWith("ERR") || message.startsWith("Er")) {
        this.error = message;
        this.$root.$bvToast.show("error_toast");
      } else if (message.startsWith("WAR")) {
        this.warning = message;
        this.$bvToast.show("warning_toast");
      } else {
        this.success = message;
        this.$bvToast.show("success_toast");
      }
    },
    //------------------------------------------------

    manageRole(roleIn) {
      this.formRole = roleIn;
    },
    registration_user(newUser) {
      const { username, name, email, role, logo } = newUser;
      if (role == "administrator") {
        const Admin = {
          username: username,
          name: name,
          email: email,
          logo: logo,
        };
        this.adminList.push(Admin); //aggiungo l'admin alla lista
      } else {
        const actor = {
          username: username,
          name: name,
          email: email,
          loadedDoc: 0,
          consumerAssociated: 0,
        };
        this.otherActorsList.push(actor);
      }
    },
    modinfo_user(userIn) {
      const { user, role } = userIn;
      if (role === "administrator") {
        let index = this.adminList.findIndex(
          (item) => item.username === user.username
        );
        if (index !== -1) {
          //indice diverso da -1 allora esiste
          this.adminList[index].name = user.name;
          this.adminList[index].email = user.email;
        }
      } else {
        let index = this.otherActorsList.findIndex(
          (item) => item.username === user.username
        );
        if (index !== -1) {
          this.otherActorsList[index].name = user.name;
          this.otherActorsList[index].email = user.email;
        }
      }
    },
    delete_user(usernameIn) {
      if (usernameIn.length === 4) {
        this.otherActorsList = this.otherActorsList.filter(
          (item) => item.username !== usernameIn
        );
      } else {
        this.adminList = this.adminList.filter(
          (item) => item.username !== usernameIn
        );
      }
    },
    date() {
      this.loadData = true;
      axios
        .post(`${process.env.VUE_APP_APIROOT}/list/administrator/report`, {
          from: this.dateFrom,
          to: this.dateTo,
        })
        .then((res) => {
          this.otherActorsList = res.data;
          this.dateFromConfirmed = this.dateFrom;
          this.dateToConfirmed = this.dateTo;
          this.displayMessage("Resume done!");
        })
        .catch((err) => this.displayMessage(err.toString()))
        .finally(() => {
          this.loadData = false;
        });
    },
    lastMonth() {
      const now = new Date();
      if (now.getMonth() === 0) {
        //partenza dal primo dicembre dell'anno precedente
        this.dateFrom = now.getFullYear() - 1 + "-12-01";
      } else if (now.getMonth() > 9) {
        this.dateFrom = now.getFullYear() + "-" + now.getMonth() + "-" + "01";
      } else {
        this.dateFrom = now.getFullYear() + "-0" + now.getMonth() + "-" + "01";
      }
      this.dateTo = now.toISOString().substring(0, 8) + "01";
    },
  },

  created() {
    console.log("token from admin page after login: "+ localStorage.getItem("JWTToken"));
    this.lastMonth();
    this.date();
    this.loadData = true;
    axios
      .get(`${process.env.VUE_APP_APIROOT}/list/administrators`)
      .then((res) => (this.adminList = res.data))
      .catch((err) => this.displayMessage(err.toString()))
      .finally(() => {
        this.loadData = false;
      });
  },
};
</script>