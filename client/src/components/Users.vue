<template>
  <v-app>
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn color="primary" dark slot="activator" class="mb-2">New User</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline"></span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-container>
                <v-flex style="display:inline-block;">
                  <span>Active</span>
                  <input type="checkbox" id="active" v-model="editedItem.active">
                </v-flex>
                <v-flex style="display:inline-block;">
                  <span>Visibility</span>
                  <input type="checkbox" id="visible" v-model="editedItem.visibility">
                </v-flex>
              </v-container>
              <v-flex>
                <v-text-field label="First Name" v-model="editedItem.firstName"></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field label="Last Name" v-model="editedItem.lastName"></v-text-field>
              </v-flex>


              <v-flex>
                <v-select v-bind:items="nationality" v-model="editedItem.nationality" label="Nationality" autocomplete multiple chips></v-select>
                <!--<v-card-text>{{editedItem.nationality}}</v-card-text>-->
              </v-flex>
              <v-flex><v-select v-bind:items="languages" v-model="editedItem.spokenLanguage" label="Spoken Languages" autocomplete multiple chips></v-select></v-flex>

              <v-card-text>Birthdate: {{editedItem.birthday | formatDate}}<v-icon class="opc" v-on:click="date = !date">event</v-icon></v-card-text>
              <v-flex v-if="date">
                <v-date-picker
                width="290"
                class="mt-3"
                v-model="editedItem.birthday"
                ></v-date-picker>
              </v-flex>

              <v-container><v-select v-bind:items="staffSkills" v-model="editedItem.skills" label="Skills" autocomplete multiple chips></v-select>
              </v-container>
              <v-flex style="display:inline-block">
                <span>Gender</span>
                <br>
                <input type="radio" id="male" value="gender-male" v-model="editedItem.gender">
                <label for="male">Male</label>
                <br>
                <input type="radio" id="female" value="gender-female" v-model="editedItem.gender">
                <label for="female">Female</label>
              </v-flex>
              <v-flex style="display:inline-block">

                <span>Choose Status</span>
                <select style="border:1px solid lightgrey; cursor:pointer; display:inline-block" v-model="editedItem.status">
                  <option disabled value="">Status: </option>
                  <option value="available">Available</option>
                  <option value="assigned">Assigned</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
                phone
                Email
                photo
                nativelanguage
                systemLanguage
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table :headers="columns" :items="rows">
      <template slot="items" slot-scope="props">
        <tr>
          <!-- Show Details Column -->
          <td v-on:click="props.item.details = !props.item.details">
            <v-icon v-if="props.item.details" title="Hide" class="opc">keyboard_arrow_up</v-icon>
            <v-icon v-else title="Show More" class="opc">keyboard_arrow_down</v-icon>
          </td>
          <!-- Active Column -->
          <td v-if="props.item.active">
            <v-icon title="Active">visibility</v-icon>
          </td>
          <td v-else>
            <v-icon title="Inactive">visibility_off</v-icon>
          </td>
          <td>{{ props.item.firstName }} {{props.item.lastName}}</td>
          <td>{{ props.item.gender }}</td>
          <td>{{ props.item.birthday | formatDate}}</td>
          <td><flag class="flags" v-for="nationality in props.item.nationality" :key="nationality.id" :iso="nationality.value"/> {{props.item.nationality.text}} </td>
          <td><flag class="flags" v-for="language in props.item.spokenLanguage" :key="language.id" :iso="language.value"/></td>
          <td><span v-for="skill in props.item.skills">{{ skill }}</span></td>
          <!-- Status Column -->
          <td v-if="props.item.status == 'available'">
            <v-icon title="Available" class="opc">done</v-icon>
          </td>
          <td v-else-if="props.item.status == 'assigned'">
            <v-icon title="Assigned" class="opc">spellcheck</v-icon>
          </td>
          <td v-else-if="props.item.status == 'suspended'">
            <v-icon title="Suspended" class="opc">not_interested</v-icon>
          </td>
          <td v-else-if="props.item.status == 'inactive'">
            <v-icon title="Inactive" class="opc">error</v-icon>
          </td>

          <!-- Visibility Column -->
          <td v-if="props.item.visibility">
            <v-icon v-on:click="props.item.visibility = !props.item.visibility" title="Visible" class="opc">visibility</v-icon>
          </td>
          <td v-else>
            <v-icon v-on:click="props.item.visibility = !props.item.visibility" title="Non Visible" class="opc">visibility_off</v-icon>
          </td>

          <!-- Options Column -->
          <td>
            <!-- <v-icon v-on:click="addItem(props.item)" title="Adicionar" class="opc">add_box</v-icon>--> <!-- add, add circle, add circle outline, delete sweep, room(localização), location on-->
            <v-icon v-on:click="editItem(props.item)" title="Edit" class="opc">create</v-icon>
            <v-icon v-on:click="delItem(props.item)" title="Delete" class="opc">delete</v-icon>
          </td>
        </tr>

        <!-- Details Section -->
        <tr v-if="props.item.details">
          <td colspan="11">
            <img class="profile_img" height="200px" src="@/assets/profile.png">
            <v-flex>
              <span class="details_content">
                First Name: {{props.item.firstName}}
              </span>
              <span class="details_content">
                Last Name: {{props.item.lastName}}
              </span>
              <span class="details_content">
                Native Language: <flag class="flags" :iso="props.item.nativeLanguage"/>
              </span>
            </v-flex>
            <v-flex>
              <span class="details_content">
                Phone: {{props.item.phone}}
              </span>
              <span class="details_content">
                Email: {{props.item.email}}
              </span>
            </v-flex>
            <v-flex>
              <span class="description">
                Description: {{props.item.description}} Lorem ipsum dolor sLorem ipsum dolor sit amet, in per suscipit hymenaeos pellentesque suspendisse, molestiae sed, tincidunt sapien rhoncus scelerisque, morbi justo et fermentum aliquet elit lorem, fermentum magna.Lorem ipsum dolor sit amet, in per suscipit hymenaeos pellentesque suspendisse, molestiae sed, tincidunt sapien rhoncus scelerisque, morbi justo et fermentum aliquet elit lorem, fermentum magna.Lorem ipsum dolor sit amet, in per suscipit hymenaeos pellentesque suspendisse, molestiae sed, tincidunt sapien rhLorem ipsum dolor sit amet, in per suscipit hymenaeos pellentesque suspendisse, molestiae sed, tincidunt sapien rhoncus scelerisque, morbi justo et fermentum aliquet elit lorem, fermentum magna.Lorem ipsum dolor sit amet.!
              </span>
            </v-flex>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-app>
</template>

<script>
import UsersService from '@/services/UsersService'

export default {
  name: 'users',
  data () {
    return {
      title: "Tabela",
      dialog : false,
      date: false,
      nationality: [{text:'German', value:'de'},{text:'Austrian', value:'at'},{text:'Belgian', value:'be'},{text:'Bulgarian', value:'bg'},{text:'Cypriot', value:'cy'},{text:'Croatian', value:'hr'},{text:'Danish', value:'dk'},{text:'Slovakian', value:'sk'},{text:'Slovene', value:'si'},{text:'Spanish', value:'es'},{text:'Estonian', value:'ee'},{text:'Finnish', value:'fi'},{text:'French', value:'fr'},{text:'Greek', value:'gr'},{text:'Hungarian', value:'hu'},{text:'Irish', value:'ie'},{text:'Italian', value:'it'},{text:'Latvian', value:'lv'},{text:'Lithuanian', value:'lt'},{text:'Luxembourgish', value:'lu'},{text:'Maltese', value:'mt'},{text:'Dutch', value:'nl'},{text:'Polish', value:'pl'},{text:'Portuguese', value:'pt'},{text:'British', value:'gb'},{text:'Czech', value:'cz'},{text:'Romanian', value:'ro'},{text:'Swedish', value:'se'}],
      languages: [{text:'German', value:'de'},{text:'Austrian', value:'at'},{text:'Belgian', value:'be'},{text:'Bulgarian', value:'bg'},{text:'Cypriot', value:'cy'},{text:'Croatian', value:'hr'},{text:'Danish', value:'dk'},{text:'Slovakian', value:'sk'},{text:'Slovene', value:'si'},{text:'Spanish', value:'es'},{text:'Estonian', value:'ee'},{text:'Finnish', value:'fi'},{text:'French', value:'fr'},{text:'Greek', value:'gr'},{text:'Hungarian', value:'hu'},{text:'Irish', value:'ie'},{text:'Italian', value:'it'},{text:'Latvian', value:'lv'},{text:'Lithuanian', value:'lt'},{text:'Luxembourgish', value:'lu'},{text:'Maltese', value:'mt'},{text:'Dutch', value:'nl'},{text:'Polish', value:'pl'},{text:'Portuguese', value:'pt'},{text:'British', value:'gb'},{text:'Czech', value:'cz'},{text:'Romanian', value:'ro'},{text:'Swedish', value:'se'}],
      staffSkills:[{text:'Chemical', value:'chemical'},{text:'Biological', value:'biological'},{text:'Radiological', value:'radiological'},{text:'Nuclear', value:'nuclear'},{text:'Explosive', value:'explosive'}],
      columns: [
        {text: '',value: 'details',type: 'boolean',sortable: false},
        {text: 'Active',value: 'active',type: 'boolean',width: '7%'},
        {text: 'Name',value: 'name',type: 'text',width: '17%'},
        {text: 'Gender',value: 'gender',type: 'text',width: '7%'},
        {text: 'Birthdate',value: 'birthday',type: 'date',width: '12%'},
        {text: 'Nationality',value: 'nationality',width: '12%',type: 'array'},
        {text: 'Spoken Languages',value: 'spokenLanguage',width: '12%',type: 'array'},
        {text: 'Skills',value: 'skills',width: '10%',type: 'array'},
        {text: 'Status',value: 'status',width: '7%', type: 'text'},
        {text: 'Visible',value: 'visibility',type: 'boolean',width: '10%'},
        {text: 'Options',value: 'opc',sortable: false,width: '10%'}
      ],
      rows: [
      ],
      editedItem: {
        firstName: '',
        lastName: '',
        active: false,
        gender: '',
        birthday: '',
        phone: 0,
        email: '',
        photo: '',
        nationality: [this.nationality],
        skills: [this.staffSkills],
        nativeLanguage: [this.languages],
        spokenLanguage: [this.languages],
        systemLanguage: [this.languages],
        status: '',
        visibility: false
      },
      editedIndex: []
    };
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    //Get Users BD
    async getUsers () {
      const response = await UsersService.fetchUsers()
      this.rows = response.data.users
    },
    //Create User BD
    async addUser () {
      await UsersService.addUser(this.editedItem)
      this.rows.push(this.editedItem)
      console.log(this.editedItem)
      this.$router.push({ name: 'Users' })
    },
	  //Edit User BD
    async updateUser () {
      await UsersService.updateUser(this.editedItem)
      //this.$router.push({ name: 'Users' })
    },
    addItem: function(i){
      alert('add!' + i.firstName)
    },
    editItem: function(user){
      //Call Edit User
      this.editedIndex = user._id
      this.editedItem = Object.assign({}, user)
      this.dialog = true
    },
    delItem: function(user){
      //Call Delete User
      const index = user._id
      //Fazer Delete !!!
      confirm('Are you sure you want to delete this item?') && this.rows.splice(index, 1)
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, null)
        this.editedIndex = []
      }, 300)
    },
    //Save user btn function
    save () {
      //Call Edit User
      if (this.editedIndex != []) {
        //console.log(this.editedItem);
        this.updateUser()
        Object.assign(this.rows[this.editedIndex], this.editedItem)
      } else {
        //Call Create User
        this.addUser()
      }
      this.close()

    }
  }
}
</script>

<style scoped>
.opc:hover{
  cursor:pointer;
}

.content{
  height:150px;
}
.profile_img{
  width:150px;
  height:200px;
  float:left;
  display:block;
  margin-right:40px;
}
.details_content{
  display:inline-block;
  width:20%;
  text-overflow: ellipsis;
  max-height: 1.8em;
  line-height: 1.8em;
}
.description{
  display: inline-block;
  width:70%;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  max-height: 7.2em;
  line-height: 1.8em;
}
.description:hover{
  cursor:pointer;
}
.flags{
  margin-right:5px;
}
</style>
