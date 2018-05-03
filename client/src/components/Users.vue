<template>
	<v-app>
		<!-- Alert Delete Dialog -->
		<v-dialog v-model="deleteAlert" max-width="450">
			<v-card class="warningAlert">
				<v-icon style="float:left; margin-top:10px; margin-left:10px;" large>priority_high</v-icon>
				<v-card-title class="headline">Are you sure you want to delete user "{{ deleteItem.firstName }} {{ deleteItem.lastName }}"?</v-card-title>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="darken-1" flat="flat" autofocus @click="deleteAlert = false; deleteItem = {}">No</v-btn>
					<v-btn color="darken-1" flat="flat" @click="deleteAlert = false; delItem(deleteItem)">Yes, I'm Sure</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-toolbar dense style="padding-top:15px;padding-bottom:5px;">
			<v-btn color="primary" dark class="mb-2" @click="userForm = !userForm">New User</v-btn>
			<v-text-field ref="add_json" v-model="jsonName" label="Select JSON File" prepend-icon="attach_file" @click="pickJSONFile"></v-text-field>
			<input
				ref="json"
				type="file"
				style="display: none"
				accept=".json"
				@change="onJSONFilePicked"
			>
			<v-btn :disabled="!jsonName" color="primary" dark class="mb-2" @click="createJSON()"><v-icon>add_box</v-icon></v-btn>

			<v-spacer></v-spacer><v-spacer></v-spacer>
			<v-text-field
				v-model="search"
				append-icon="search"
				label="Search"
				single-line
				hide-details
			></v-text-field>
		</v-toolbar>
		<!-- User Form Dialog -->
		<v-dialog v-model="userForm" scrollable max-width="1000px" persistent>
			<v-card>
				<v-card-title>
					<v-toolbar dense dark color="primary">
						<v-avatar size="40">
							<v-icon x-large>person</v-icon>
						</v-avatar>
						<span v-if="createUser" class="headline mx-3"> Add User </span>
						<span v-else class="headline mx-3"> Edit User </span>
						<v-spacer></v-spacer>
						<v-btn class="inline close" icon dark @click.native="close">
							<v-icon>close</v-icon>
						</v-btn>
					</v-toolbar>
				</v-card-title>
				<v-card-text>
					<v-container grid-list-md>
						<v-form ref="form" v-model="valid" lazy-validation>
							<v-layout wrap>
								<v-flex class="half_line">
									<v-checkbox v-model="editedItem.active" label="Active"></v-checkbox>
								</v-flex>
								<v-flex class="half_line">
									<v-checkbox v-model="editedItem.visibility" label="Visible"></v-checkbox>
								</v-flex>
								<v-flex class="quarter_line">
									<v-text-field v-model="editedItem.firstName" :rules="[rules.required, rules.name]" label="First Name" required></v-text-field>
								</v-flex>
								<v-flex class="quarter_line">
									<v-text-field v-model="editedItem.lastName" :rules="[rules.required, rules.name]" label="Last Name" required></v-text-field>
								</v-flex>
								<v-flex v-if="createUser" class="quarter_line">
									<v-text-field v-model="editedItem.username" :rules="[rules.required, rules.username]" label="Username" required></v-text-field>
								</v-flex>
								<v-flex v-else class="quarter_line">
									<v-text-field v-model="editedItem.username" :rules="[rules.required]" label="Username" required disabled></v-text-field>
								</v-flex>
								<v-flex class="quarter_line">
									<v-text-field v-model="editedItem.email" :rules="[rules.required, rules.email]" label="Email" prepend-icon="email" required></v-text-field>
								</v-flex>
								<v-flex class="half_line" @click="date = !date">
									<v-card-text>
										<v-icon class="opc">event</v-icon>
										Birthdate: {{ editedItem.birthday | formatDate }}
									</v-card-text>
									<v-flex v-if="date">
										<v-date-picker v-model="editedItem.birthday" width="450"></v-date-picker>
									</v-flex>
								</v-flex>
								<v-flex class="quarter_line">
									<v-select :items="gender" v-model="editedItem.gender" label="Gender"></v-select>
								</v-flex>
								<v-flex class="quarter_line">
									<v-text-field v-model="editedItem.phone" label="Phone" prepend-icon="phone" mask="#########"></v-text-field>
								</v-flex>
								<v-flex class="quarter_line">
									<v-select :items="languages" v-model="editedItem.nationality" label="Nationality" item-text="name" item-value="languages" multiple></v-select>
								</v-flex>
								<v-flex class="quarter_line">
									<v-select :items="languages" v-model="editedItem.nativeLanguage" label="Native Language" item-text="name" item-value="languages" multiple></v-select>
								</v-flex>
								<v-flex class="quarter_line">
									<v-select :items="languages" v-model="editedItem.spokenLanguage" label="Spoken Languages" item-text="name" item-value="languages" autocomplete multiple></v-select>
								</v-flex>
								<v-flex class="quarter_line">
									<v-select :items="systemLanguages" v-model="editedItem.systemLanguage" label="System Language" item-text="name" item-value="languages" disabled></v-select>
								</v-flex>
								<v-flex class="half_line">
									<v-select :items="staffSkills" v-model="editedItem.skills" label="Skills" item-text="name" item-value="staffSkills" autocomplete multiple></v-select>
								</v-flex>
								<v-flex class="half_line">
									<v-select :items="status" v-model="editedItem.status" label="Status"></v-select>
								</v-flex>
								<v-flex class="full_line">
									<v-text-field v-model="editedItem.description" label="Description" rows="3" multi-line></v-text-field>
								</v-flex>
								<!--
								<v-flex class="quarter_line">
								<img v-if="imageUrl" :src="imageUrl" height="150"/>
								<v-text-field v-model="imageName" label="Select Image" prepend-icon="attach_file" @click="pickFile"></v-text-field>
								<input
								ref="image"
								type="file"
								style="display: none"
								accept="image/*"
								@change="onFilePicked"
								>
							</v-flex> -->
							</v-layout>
						</v-form>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn :disabled="!valid" color="blue darken-1" flat @click.native="save">
						Save
						<v-icon right>backup</v-icon>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- Users Datatable -->
		<v-data-table :headers="columns" :items="rows" :pagination.sync="pagination" :search="search" item-key="firstName" expand>
			<template slot="headers" slot-scope="props">
				<tr>
					<th v-for="header in props.headers" v-if="header.value != 'lastName'" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" style="text-align:left; padding:5px;" @click="changeSort(header.value)">
						<span v-if="header.value != 'gender'">{{ header.text }}</span>
						<span v-else-if="header.value == 'gender'"><v-icon style="opacity: 1;" medium title="Gender">mdi-gender-male-female</v-icon></span>
						<v-icon v-if="header.sortable != false" small>arrow_upward</v-icon>
					</th>
				</tr>
			</template>
			<template slot="items" slot-scope="props">
				<tr class="primaryTable">
					<!-- Show Details Column -->
					<td id="columnDetails">
						<v-icon v-if="props.expanded" title="Hide" class="opc" @click="props.expanded = !props.expanded">keyboard_arrow_up</v-icon>
						<v-icon v-else title="Show More" class="opc" @click="props.expanded = !props.expanded">keyboard_arrow_down</v-icon>
					</td>
					<!-- Active Column -->
					<td v-if="props.item.active">

						<v-icon color="green" title="Active">check_circle</v-icon>
					</td>
					<td v-else>
						<v-icon color="red darken-2" title="Inactive">cancel</v-icon>
					</td>
					<td id="columnName">
						<v-edit-dialog lazy>
							<div>{{ props.item.firstName }} {{ props.item.lastName }}</div>
							<v-card slot="input" flat>
								<v-card-text>
									<v-text-field slot="input" v-model="props.item.firstName" label="First Name" autofocus></v-text-field>
									<v-text-field slot="input" v-model="props.item.lastName" label="Last Name"></v-text-field>
									<v-btn slot="input" color="blue darken-1" flat block @click.native="editUser(props.item)">
										Save
										<v-icon right>backup</v-icon>
									</v-btn>
								</v-card-text>
							</v-card>
						</v-edit-dialog>
					</td>
					<td id="columnGender">
						<v-edit-dialog lazy>
							<div><v-icon v-if="props.item.gender == 'Male'" title="Male">mdi-gender-male</v-icon>
								<v-icon v-if="props.item.gender == 'Female'" title="Female">mdi-gender-female</v-icon>
							<v-icon v-if="props.item.gender == 'Unknown'" title="Unknown">remove</v-icon></div>
							<v-card slot="input" flat>
								<v-card-text style="padding:0px;">
									<v-btn slot="input" icon flat title="Male" @click="props.item.gender='Male'; editUser(props.item)">
										<v-icon medium title="Male">mdi-gender-male</v-icon>
									</v-btn>
									<v-btn slot="input" icon flat title="Female" @click="props.item.gender='Female'; editUser(props.item)">
										<v-icon medium title="Female">mdi-gender-female</v-icon>
									</v-btn>
									<v-btn slot="input" icon flat title="Unknown" @click="props.item.gender='Unknown'; editUser(props.item)">
										<v-icon medium title="Unknown">remove</v-icon>
									</v-btn>
								</v-card-text>
							</v-card>
						</v-edit-dialog>
					</td>
					<td id="columnBirthdate">{{ props.item.birthday | formatDate }}</td>
					<td id="columnNationality"><span v-for="nationality in props.item.nationality" :key="nationality.abbr"><flag :title="nationality.name" :iso="nationality.abbr" class="flags_skills border"/> {{ nationality.name }}</span></td>
					<td><span v-for="language in props.item.spokenLanguage" :key="language.abbr"><flag :title="language.name" :iso="language.abbr" class="flags_skills border"/></span></td>
					<td id="columnSkills"><span v-for="skill in props.item.skills" :key="skill.name"><v-icon :title="skill.name">mdi-{{ skill.icon }}</v-icon></span></td>
					<!-- Status Column -->
					<td v-if="props.item.status == 'Available'" id="columnStatus">
						<v-icon title="Available">done</v-icon>
					</td>
					<td v-else-if="props.item.status == 'Assigned'" id="columnStatus">
						<v-icon title="Assigned">spellcheck</v-icon>
					</td>
					<td v-else-if="props.item.status == 'Suspended'" id="columnStatus">
						<v-icon title="Suspended">not_interested</v-icon>
					</td>
					<td v-else-if="props.item.status == 'Inactive'" id="columnStatus">
						<v-icon title="Inactive">error</v-icon>
					</td>
					<td v-else></td>

					<!-- Visibility Column -->
					<td v-if="props.item.visibility" id="columnVisibility">
						<v-icon title="Visible">visibility</v-icon>
					</td>
					<td v-else id="columnVisibility">
						<v-icon title="Non Visible">visibility_off</v-icon>
					</td>

					<!-- Actions Column -->
					<td id="columnActions">
						<!-- <v-icon v-on:click="addItem(props.item)" title="Adicionar" class="opc">add_box</v-icon>--> <!-- add, add circle, add circle outline, delete sweep, room(localização), location on-->
						<v-icon title="Edit" class="opc" @click="editItem(props.item); openUserForm()">create</v-icon>
						<v-icon title="Delete" class="opc" @click="deleteAlert = true; deleteItem = props.item">delete</v-icon>
					</td>
				</tr>

				<!-- Details Section -->

			</template>
			<template slot="expand" slot-scope="props">
				<td colspan="11">
					<v-container class="details">
						<v-flex class="profile_img">
							<img ref="profile_pic" :src="'https://rocsafe.inov.pt/img/users/' + props.item.username + '.jpg'" style="width:180px;" height="200px" @error="imageLoadOnError()">
							<v-icon ref="avatar" size="175px"></v-icon>
						</v-flex>
						<v-flex>
							<span class="details_content">
								Username: {{ props.item.username }}
							</span>
							<span class="details_content">
								Native Language: <span v-for="nativeLanguage in props.item.nativeLanguage" :key="nativeLanguage.abbr"><flag :title="nativeLanguage.name" :iso="nativeLanguage.abbr" class="flags_skills border"/></span>
							</span>
						</v-flex>
						<v-flex>
							<span class="details_content">
								Phone: {{ props.item.phone }}
							</span>
							<span class="details_content">
								Email: {{ props.item.email }}
							</span>
						</v-flex>
						<v-flex>
							<span class="description">
								Description: {{ props.item.description }}
							</span>
						</v-flex>
					</v-container>
					<!--<v-container class="details border">
					Missions
				</v-container>-->
				</td>
			</template>
			<v-alert slot="no-results" :value="true" color="error" icon="warning">
				Your search for "{{ search }}" found no results.
			</v-alert>
		</v-data-table>
	</v-app>
</template>

<script>
//import json from '../assets/data.json';
export default {
	name: 'Users',
	data () {
		return {
			title: 'Users Management Demo',
			//Variable responsible for showing the User Form
			userForm : false,
			//Variable responsible for keeping track of adding User
			createUser: true,
			//Variable responsible for showing DatePicker
			date: false,
			//Datatable Pagination Variable
			pagination: {
				sortBy: 'firstName'
			},
			//Variable responsible for warning delete alert
			deleteAlert: false,
			//Search parameter
			search: '',
			//Variable responsible for enabling save button (User Form)
			valid: false,
			imageName: '',
			imageUrl: '',
			imageFile: '',
			jsonName: '',
			jsonFile: '',
			//Set of rules within User Form
			rules: {
				required: value => value !== undefined && value.trim().length > 0 || 'Required',
				email: value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'E-mail must be valid',
				username: value => /^([\w.-]+)*$/.test(value) || 'Username must be valid. Special characters available are [period, underscore and hyphen]',
				name: value => /^[a-zA-Z záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]*$/.test(value) || 'Name must be valid.'

			},
			gender:['Male','Female','Unknown'],
			status:['Available', 'Assigned', 'Suspended', 'Inactive'],
			systemLanguages: [{name:'German', abbr:'de'},{name:'Austrian', abbr:'at'},{name:'Belgian', abbr:'be'},{name:'Bulgarian', abbr:'bg'},{name:'Cypriot', abbr:'cy'},{name:'Croatian', abbr:'hr'},{name:'Danish', abbr:'dk'},{name:'Slovakian', abbr:'sk'},{name:'Slovene', abbr:'si'},{name:'Spanish', abbr:'es'},{name:'Estonian', abbr:'ee'},{name:'Finnish', abbr:'fi'},{name:'French', abbr:'fr'},{name:'Greek', abbr:'gr'},{name:'Hungarian', abbr:'hu'},{name:'Irish', abbr:'ie'},{name:'Italian', abbr:'it'},{name:'Latvian', abbr:'lv'},{name:'Lithuanian', abbr:'lt'},{name:'Luxembourgish', abbr:'lu'},{name:'Maltese', abbr:'mt'},{name:'Dutch', abbr:'nl'},{name:'Polish', abbr:'pl'},{name:'Portuguese', abbr:'pt'},{name:'British', abbr:'gb'},{name:'Czech', abbr:'cz'},{name:'Romanian', abbr:'ro'},{name:'Swedish', abbr:'se'}],
			languages: [{name:'German', abbr:'de'},{name:'Austrian', abbr:'at'},{name:'Belgian', abbr:'be'},{name:'Bulgarian', abbr:'bg'},{name:'Cypriot', abbr:'cy'},{name:'Croatian', abbr:'hr'},{name:'Danish', abbr:'dk'},{name:'Slovakian', abbr:'sk'},{name:'Slovene', abbr:'si'},{name:'Spanish', abbr:'es'},{name:'Estonian', abbr:'ee'},{name:'Finnish', abbr:'fi'},{name:'French', abbr:'fr'},{name:'Greek', abbr:'gr'},{name:'Hungarian', abbr:'hu'},{name:'Irish', abbr:'ie'},{name:'Italian', abbr:'it'},{name:'Latvian', abbr:'lv'},{name:'Lithuanian', abbr:'lt'},{name:'Luxembourgish', abbr:'lu'},{name:'Maltese', abbr:'mt'},{name:'Dutch', abbr:'nl'},{name:'Polish', abbr:'pl'},{name:'Portuguese', abbr:'pt'},{name:'British', abbr:'gb'},{name:'Czech', abbr:'cz'},{name:'Romanian', abbr:'ro'},{name:'Swedish', abbr:'se'},{name:'Unknown', abbr:''}],
			staffSkills:[{name:'Chemical', icon:'chemical-weapon'},{name:'Biological', icon:'biohazard'},{name:'Radioactive', icon:'radioactive'},{name:'Nuclear', icon:'atom'},{name:'Explosive', icon:'bomb'}],
			columns: [
				{text: '', value: 'details', type: 'boolean', sortable: false},
				{text: 'Active', value: 'active', type: 'boolean'},
				{text: 'Name', value: 'firstName', type: 'text'},
				{value: 'lastName', type:'text'},
				{text: 'Gender', value: 'gender', type: 'text'},
				{text: 'Birthdate', value: 'birthday', type: 'date'},
				{text: 'Nationality', value: 'nationality', type: 'array'},
				{text: 'Spoken Languages', value: 'spokenLanguage', type: 'array'},
				{text: 'Skills', value: 'skills', type: 'array'},
				{text: 'Status', value: 'status', type: 'text'},
				{text: 'Visible', value: 'visibility', type: 'boolean'},
				{text: 'Actions', value: 'actions', sortable: false}
			],
			rows: [],
			editedItem: {
				_id: null,
				firstName: '',
				lastName: '',
				active: false,
				gender: '',
				birthday: '',
				phone: '',
				email: '',
				photo: '',
				description: '',
				nationality: [],
				skills: [],
				nativeLanguage: [],
				spokenLanguage: [],
				systemLanguage: [],
				status: '',
				username: '',
				visibility: true
			},
			jsonItem: {
				_id: null,
				firstName: '',
				lastName: '',
				active: false,
				gender: '',
				birthday: '',
				phone: '',
				email: '',
				photo: '',
				description: '',
				nationality: [],
				skills: [],
				nativeLanguage: [],
				spokenLanguage: [],
				systemLanguage: [],
				status: '',
				username: '',
				visibility: true
			},
			deleteItem:{},
			editedIndex: null
		};
	},
	mounted () {
	},
	created() {
		this.getUsers();
	},
	methods: {
		mongoObjectId () {
			var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
			return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
				return (Math.random() * 16 | 0).toString(16);
			}).toLowerCase();
		},
		//Profile Image Handler
		imageLoadOnError () {
			this.$refs.profile_pic.outerHTML = '';
			this.$refs.avatar.innerText = 'person';
		},
		changeSort (column) {
			if (this.pagination.sortBy === column) {
				this.pagination.descending = !this.pagination.descending;
			} else {
				this.pagination.sortBy = column;
				this.pagination.descending = false;
			}
		},
		//Pick Image File, User Form
		pickFile () {
			this.$refs.image.click ();
		},
		onFilePicked (e) {
			const files = e.target.files;
			if(files[0] !== undefined) {
				this.imageName = files[0].name;
				if(this.imageName.lastIndexOf('.') <= 0) {
					return;
				}
				const fr = new FileReader ();
				fr.readAsDataURL(files[0]);
				fr.addEventListener('load', () => {
					this.imageUrl = fr.result;
					this.imageFile = files[0]; // this is an image file that can be sent to server...
					this.editedItem.photo = this.imageFile;
					console.log(files[0]);
					console.log(this.imageFile);
					console.log(this.editedItem.photo);
				});
			} else {
				this.imageName = '';
				this.imageFile = '';
				this.imageUrl = '';
			}
		},
		pickJSONFile () {
			this.$refs.json.click ();
		},
		onJSONFilePicked (e) {
			const files = e.target.files;
			if(files[0].type === 'application/json'){
				this.$refs.add_json.label = 'Select JSON File';
				const files = e.target.files;
				if(files[0] !== undefined) {
					this.jsonName = files[0].name;
					if(this.jsonName.lastIndexOf('.') <= 0) {
						return;
					}
					var file = files[0];
					var start =  0;
					var stop = file.size - 1;
					const fr = new FileReader ();

					var blob = file.slice(start, stop + 1);
					fr.readAsBinaryString(blob);
					fr.onload = (function(e) {
						//var json = JSON.parse(e.target.result);
						localStorage.setItem('json', e.target.result);
					});
				}else {
					console.log('erase');
					this.jsonName = '';
					this.jsonFile = '';
				}
			}else{
				this.$refs.add_json.label = 'Insert Valid File';
			}
		},
		createJSON(){
			var aux = localStorage.getItem('json');
			localStorage.removeItem('json');
			this.jsonFile = JSON.parse(aux);
			for (var i = 0; i < this.jsonFile.length; i++) {
				this.jsonItem.firstName = this.jsonFile[i].firstName;
				this.jsonItem.lastName = this.jsonFile[i].lastName;
				this.jsonItem.email = this.jsonFile[i].email;
				this.jsonItem.username = this.jsonFile[i].username;
				this.jsonItem.active = this.jsonFile[i].active;
				this.jsonItem.gender = this.jsonFile[i].gender;
				this.jsonItem.birthday = this.jsonFile[i].birthday;
				this.jsonItem.phone = this.jsonFile[i].phone;
				this.jsonItem.photo = this.jsonFile[i].photo;
				this.jsonItem.description = this.jsonFile[i].description;
				this.jsonItem.nationality = this.jsonFile[i].nationality;
				this.jsonItem.skills = this.jsonFile[i].skills;
				this.jsonItem.nativeLanguage = this.jsonFile[i].nativeLanguage;
				this.jsonItem.spokenLanguage = this.jsonFile[i].spokenLanguage;
				this.jsonItem.systemLanguage = this.jsonFile[i].systemLanguage;
				this.jsonItem.status = this.jsonFile[i].status;
				this.jsonItem.visibility = this.jsonFile[i].visibility;
				this.jsonItem._id = this.mongoObjectId();
				this.$http.post('/users', this.jsonItem)
					.then(response => {
						console.log('User created', response.data);
						this.$emit('dismiss', response.data);
						this.rows.push(response.data);
					})
					.catch(error => {
					//this.errorHandler(error);
						console.log(error);
					});
				this.jsonItem = {};
			}
			this.jsonFile = '';
		},
		//Get Users BD
		getUsers() {
			this.$http.get('/users')
				.then(response => {
					this.rows.length = 0;
					response.data.forEach(user => {
						if(user.birthday){
							user.birthday = user.birthday.split('T')[0];}
						this.rows.push(user);
					});
				});
		},
		postUser() {
			this.$http.post('/users', this.editedItem)
				.then(response => {
					console.log('User created', response.data);
					this.$emit('dismiss', response.data);
					this.rows.push(response.data);
				})
				.catch(error => {
					//this.errorHandler(error);
					console.log(error);
				});
		},
		editUser(user) {
			this.$http.put('/users/' + user._id, user)
				.then(response => {
					console.log('User updated', response.data);
					this.$emit('dismiss', response.data);
					if(this.editedIndex) {
						Object.assign(this.rows[this.editedIndex], response.data);
					}
				})
				.catch(error => {
					console.log(error);
					//this.saving = false;
					//this.errorHandler(error);
				});
		},
		editItem: function(user){
			//Call Edit User
			this.editedIndex = this.rows.indexOf(user);
			this.editedItem = Object.assign({}, user);
			this.createUser = false;
			//this.userForm = true;
		},
		openUserForm: function(){
			this.userForm = true;
		},
		delItem: function(user){
			//Call Delete User
			const index = user._id;
			const index_row = this.rows.indexOf(user);
			console.log('Request to delete user', index);
			this.rows.splice(index_row, 1);
			this.$http.delete('/users/' + index)
				.then(response => {
					console.log('User deleted', response);
					this.deleteItem = {};
					this.$emit('dismiss', index);
				})
				.catch(error => {
					console.log(error);
					//this.saving = false;
					//this.errorHandler(error);
				});
		},
		close () {
			this.userForm = false;
			this.createUser = true;
			setTimeout(() => {
				this.editedItem = Object.assign({}, null);
				this.editedItem.nationality = [];
				this.editedItem.nativeLanguage = [];
				this.editedItem.spokenLanguage = [];
				this.editedItem.skills = [];
				this.editedItem.photo = '';
				this.imageName = '';
				this.imageFile = '';
				this.imageUrl = '';
				this.editedIndex = null;
			}, 500);
		},
		//Save user btn function
		save () {
			//Call validation of User Form
			if (this.$refs.form.validate()) {
				//Call Create User
				if (this.editedIndex === null) {
					this.editedItem._id = this.mongoObjectId();
					this.postUser();
				} else {
					//Call Edit User
					this.editUser(this.editedItem);
				}
				this.close();
			}
		}
	}
};
</script>

<style scoped>
.primaryTable > td{
	padding-left:5px !important;
}
#columnDetails{
	max-width: 20px;
	padding-left:24px !important;
}
#columnName{
	min-width: 200px;
}
#columnGender{
	max-width: 20px;
	padding-left:5px;
	padding-right:5px;
}
#columnBirthdate{
	min-width: 110px;
}
#columnNationality{
	min-width: 170px;
}
#columnSkills{
	min-width: 120px;
}
#columnStatus{
	max-width: 20px;
	padding-left:5px;
	padding-right:5px;
}
#columnVisibility{
	max-width: 20px;
	padding-left:5px;
	padding-right:5px;
}
#columnActions{
	min-width: 100px;
}
.warningAlert{
	background-color: #FFC107;
	color:white;
}
.close {

}
.border{
	border:1px solid grey;
}
.inline{
	display:inline;
}
.opc:hover{
	cursor:pointer;
}

.content{
	height:150px;
}
.profile_img{
	width:180px;
	height:200px;
	float:left;
	margin-right:40px;
}
.details{
	height:250px;
	width:1200px;
}
.details_content{
	display:inline-block;
	width:30%;
	text-overflow: ellipsis;
	max-height: 1.8em;
	line-height: 1.8em;
}
.description{
	display: inline-block;
	width:80%;
	text-overflow: ellipsis;
	word-wrap: break-word;
	overflow: hidden;
	height: 10.8em;
	line-height: 1.8em;
}
.flags_skills{
	margin-right:5px;
	height:1.3em;
	width:1.3em;
}

.formHeader{
	background-color:#1E88E5;
	color:white;
	display:inline;
}
.formHeader img{
	margin: 5px 10px 0px 10px;
}
.half_line{
	display:inline-block;
	width:50%;
}
.full_line{
	display:inline-block;
	width:100%;
}
.quarter_line{
	display:inline-block;
	width:25%;
}
</style>
