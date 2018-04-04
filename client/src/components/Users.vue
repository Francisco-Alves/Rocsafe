<template>
  <v-app>
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn color="primary" dark slot="activator" class="mb-2">Novo Item</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline"></span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-container>
                <v-flex style="display:inline-block;">
                  <span>Ativo</span>
                  <input type="checkbox" id="active" v-model="editedItem.active">
                </v-flex>
                <v-flex style="display:inline-block;">
                  <span>Visível</span>
                  <input type="checkbox" id="visible" v-model="editedItem.visibility">
                </v-flex>
              </v-container>
              <v-flex>
                <v-text-field label="Primeiro Nome" v-model="editedItem.firstName"></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field label="Apelido" v-model="editedItem.lastName"></v-text-field>
              </v-flex>


              <v-flex>
                <v-select v-bind:items="countries" v-model="editedItem.nationality" label="Nacionalidade" autocomplete multiple chips></v-select>
                <!--<v-card-text>{{editedItem.nationality}}</v-card-text>-->
              </v-flex>
              <v-flex><v-select v-bind:items="countries" v-model="editedItem.spokenLanguage" label="Línguas Faladas" autocomplete multiple chips></v-select></v-flex>

              <v-card-text>Data de Nascimento: {{editedItem.birthday}}<v-icon class="opc" v-on:click="date = !date">event</v-icon></v-card-text>
              <v-flex v-if="date">
                <v-date-picker
                width="290"
                class="mt-3"
                v-model="editedItem.birthday"
                ></v-date-picker>
              </v-flex>

              <v-container><v-select v-bind:items="skills" v-model="editedItem.skills" label="Skills" autocomplete multiple chips></v-select>
              </v-container>
              <v-flex style="display:inline-block">
                <span>Género</span>
                <br>
                <input type="radio" id="male" value="M" v-model="editedItem.gender">
                <label for="male">Masculino</label>
                <br>
                <input type="radio" id="female" value="F" v-model="editedItem.gender">
                <label for="female">Feminino</label>
              </v-flex>
              <v-flex style="display:inline-block">

                <span>Selecione o Estado</span>
                <select style="border:1px solid lightgrey; cursor:pointer; display:inline-block" v-model="editedItem.status">
                  <option disabled value="">Estado: </option>
                  <option value="available">Available</option>
                  <option value="assigned">Assigned</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>

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
          <!-- Coluna Detalhes -->
          <td v-on:click="props.item.details = !props.item.details">
            <v-icon v-if="props.item.details" title="Esconder" class="opc">keyboard_arrow_up</v-icon>
            <v-icon v-else title="Mostrar Mais" class="opc">keyboard_arrow_down</v-icon>
          </td>
          <!-- Coluna Active -->
          <td v-if="props.item.active">
            <v-icon title="Ativo">visibility</v-icon>
          </td>
          <td v-else>
            <v-icon title="Inativo">visibility_off</v-icon>
          </td>
          <td>{{ props.item.firstName }} {{props.item.lastName}}</td>
          <td>{{ props.item.gender }}</td>
          <td>{{ props.item.birthday }}</td>
          <td><flag class="flags" v-for="nationality in props.item.nationality" :key="nationality.id" :iso="nationality.language"/></td>
          <td><flag class="flags" v-for="language in props.item.spokenLanguage" :key="language.id" :iso="language"/></td>
          <td><span v-for="skill in props.item.skills">{{ skill }}</span></td>
          <!-- Coluna Status -->
          <td v-if="props.item.status == 'available'">
            <v-icon title="Disponível" class="opc">done</v-icon>
          </td>
          <td v-else-if="props.item.status == 'assigned'">
            <v-icon title="Atribuído" class="opc">spellcheck</v-icon>
          </td>
          <td v-else-if="props.item.status == 'suspended'">
            <v-icon title="Suspenso" class="opc">not_interested</v-icon>
          </td>
          <td v-else-if="props.item.status == 'inactive'">
            <v-icon title="Inativo" class="opc">error</v-icon>
          </td>

          <!-- Coluna Visibility -->
          <td v-if="props.item.visibility">
            <v-icon v-on:click="props.item.visibility = !props.item.visibility" title="Alterar" class="opc">visibility</v-icon>
          </td>
          <td v-else>
            <v-icon v-on:click="props.item.visibility = !props.item.visibility" title="Alterar" class="opc">visibility_off</v-icon>
          </td>

          <!-- Coluna Options -->
          <td>
            <!-- <v-icon v-on:click="addItem(props.item)" title="Adicionar" class="opc">add_box</v-icon>--> <!-- add, add circle, add circle outline, delete sweep, room(localização), location on-->
            <v-icon v-on:click="editItem(props.item)" title="Editar" class="opc">create</v-icon>
            <v-icon v-on:click="delItem(props.item)" title="Remover" class="opc">delete</v-icon>
          </td>
        </tr>

        <tr v-if="props.item.details">
          <td colspan="11">
            <img class="profile_img" height="200px" src="@/assets/profile.png">
            <v-flex>
              <span class="details_content">
                Nome: {{props.item.firstName}}
              </span>
              <span class="details_content">
                Apelido: {{props.item.lastName}}
              </span>
              <span class="details_content">
                Língua Materna: <flag class="flags" :iso="props.item.nationality"/>
              </span>
            </v-flex>
            <v-flex>
              <span class="details_content">
                Nº Telemóvel: {{props.item.phone}}
              </span>
              <span class="details_content">
                Email: {{props.item.email}}
              </span>
            </v-flex>
            <v-flex>
              <span class="description">
                Descrição: {{props.item.description}} Lorem ipsum dolor sLorem ipsum dolor sit amet, in per suscipit hymenaeos pellentesque suspendisse, molestiae sed, tincidunt sapien rhoncus scelerisque, morbi justo et fermentum aliquet elit lorem, fermentum magna.Lorem ipsum dolor sit amet, in per suscipit hymenaeos pellentesque suspendisse, molestiae sed, tincidunt sapien rhoncus scelerisque, morbi justo et fermentum aliquet elit lorem, fermentum magna.Lorem ipsum dolor sit amet, in per suscipit hymenaeos pellentesque suspendisse, molestiae sed, tincidunt sapien rhLorem ipsum dolor sit amet, in per suscipit hymenaeos pellentesque suspendisse, molestiae sed, tincidunt sapien rhoncus scelerisque, morbi justo et fermentum aliquet elit lorem, fermentum magna.Lorem ipsum dolor sit amet.!
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
      countries: [{text:'Alemanha', value:'de'},{text:'Áustria', value:'at'},{text:'Bélgica', value:'be'},{text:'Bulgária', value:'bg'},{text:'Chipre', value:'cy'},{text:'Croácia', value:'hr'},{text:'Dinamarca', value:'dk'},{text:'Eslováquia', value:'sk'},{text:'Eslovénia', value:'si'},{text:'Espanha', value:'es'},{text:'Estónia', value:'ee'},{text:'Finlândia', value:'fi'},{text:'França', value:'fr'},{text:'Grécia', value:'gr'},{text:'Hungria', value:'hu'},{text:'Irlanda', value:'ie'},{text:'Itália', value:'it'},{text:'Letónia', value:'lv'},{text:'Lituânia', value:'lt'},{text:'Luxemburgo', value:'lu'},{text:'Malta', value:'mt'},{text:'Países Baixos', value:'nl'},{text:'Polónia', value:'pl'},{text:'Portugal', value:'pt'},{text:'Reino Unido', value:'gb'},{text:'República Checa', value:'cz'},{text:'Roménia', value:'ro'},{text:'Suécia', value:'se'}],
      skills:[{text:'Químico', value:'chemical'},{text:'Biológico', value:'bio'},{text:'Radioativo', value:'radioactive'},{text:'Nuclear', value:'nuclear'},{text:'Explosivo', value:'explosive'}],
      columns: [
        {
          text: '',
          value: 'details',
          type: 'boolean',
          sortable: false
        },
        {
          text: 'Active',
          value: 'active',
          type: 'boolean',
          width: '7%'
        },
        {
          text: 'Nome Completo',
          value: 'name',
          type: 'text',
          width: '17%'
        },
        {
          text: 'Género',
          value: 'gender',
          type: 'text',
          width: '7%'
        },
        {
          text: 'Data de Nascimento',
          value: 'birthday',
          type: 'date',
          inputFormat: 'YYYY-MM-DD',
          outputFormat: 'DD-MM-YYYY',
          width: '12%'
        },
        {
          text: 'Nacionalidade',
          value: 'nationality',
          width: '12%',
          type: 'array'
        },
        {
          text: 'Línguas Faladas',
          value: 'spokenLanguage',
          width: '12%',
          type: 'array'
        },/*
        {
          text: 'Habilidades',
          value: 'skills',
          width: '10%',
          type: 'array'
        },*/
        {
          text: 'Status',
          value: 'status',
          width: '7%'
          //type: 'text'
        },
        {
          text: 'Visibilidade',
          value: 'visibility',
          type: 'boolean',
          width: '10%'
        },
        {
          text: 'Opções',
          value: 'opc',
          sortable: false,
          width: '10%'
          //type: 'text'
        }
      ],
      rows: [
        //{id:0, active:true, firstName:'John', lastName:'John', gender:'M', birthday: '2012/02/01', nationality: ['it'],
        //languages: ['it', 'pt'], skills: [], status: 'available', visibility: true, opc: '', details:false},
      ],
      editedItem: {
        firstName: '',
        lastName: '',
        active: false,
        gender: '',
        birthday: '',
        nationality: [],
        spokenLanguage: [],
        skills: [],
        status: '',
        visibility: false
      },
      editedIndex: -1
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
    addItem: function(i){
      alert('add!' + i.firstName)
    },
    editItem: function(user){
      //Call Edit User
      this.editedIndex = this.rows.indexOf(user)
      this.editedItem = Object.assign({}, user)
      this.dialog = true
      this.editedItem.firstName = user.firstName
      this.editedItem.lastName = user.lastName
      this.editedItem.active = user.active
      this.editedItem.gender = user.gender
      this.editedItem.birthday = user.birthday
      this.editedItem.nationality = user.nationality
      this.editedItem.languages = user.languages
      this.editedItem.skills = user.skills
      this.editedItem.status = user.status
      this.editedItem.visibility = user.visibility
    },
    delItem: function(item){
      //Call Delete User
      const index = this.rows.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.rows.splice(index, 1)
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, null)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      //Call Edit User
      if (this.editedIndex > -1) {
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
