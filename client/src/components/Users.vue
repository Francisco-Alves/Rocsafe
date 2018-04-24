<template>
	<v-app>
		<v-dialog v-model="dialog" scrollable max-width="1000px" persistent>
			<v-btn slot="activator" color="primary" dark class="mb-2">New User</v-btn>
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
						<v-form ref="form" lazy-validation>
							<v-layout wrap>
								<v-flex class="half_line">
									<v-checkbox v-model="editedItem.active" label="Active"></v-checkbox>
								</v-flex>
								<v-flex class="half_line">
									<v-checkbox v-model="editedItem.visibility" label="Visible"></v-checkbox>
								</v-flex>
								<v-flex class="quarter_line">
									<v-text-field v-model="editedItem.firstName" :rules="[rules.required]" label="First Name" required></v-text-field>
								</v-flex>
								<v-flex class="quarter_line">
									<v-text-field v-model="editedItem.lastName" :rules="[rules.required]" label="Last Name" required></v-text-field>
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
										<v-date-picker v-model="editedItem.birthday" width="200"></v-date-picker>
									</v-flex>
								</v-flex>
								<v-flex class="quarter_line">
									Gender:
									<v-radio-group v-model="editedItem.gender">
										<v-radio v-for="n in gender" :key="n" :label="`${n}`" :value="n"></v-radio>
									</v-radio-group>
								</v-flex>
								<v-flex class="quarter_line">
									<v-text-field v-model="editedItem.phone" label="Phone" prepend-icon="phone" mask="#########"></v-text-field>
								</v-flex>
								<v-flex v-for="nationality in editedItem.nationality" :key="nationality.abbr" class="quarter_line">
									<v-select :items="languages" :placeholder="nationality.name" v-model="editedItem.nationality" label="Nationality" class="input-group--focused" item-text="name" item-value="languages"></v-select>
								</v-flex>
								<v-flex v-for="nativeLanguage in editedItem.nativeLanguage" :key="nativeLanguage.abbr" class="quarter_line">
									<v-select :items="languages" :placeholder="nativeLanguage.name" v-model="editedItem.nativeLanguage" label="Native Language" class="input-group--focused" item-text="name" item-value="languages"></v-select>
								</v-flex>
								<v-flex class="quarter_line">
									<v-select :items="languages" v-model="editedItem.spokenLanguage" label="Spoken Languages" item-text="name" item-value="languages" autocomplete multiple></v-select>
								</v-flex>
								<v-flex class="quarter_line">
									<v-select :items="systemLanguages" v-model="editedItem.systemLanguage" label="System Language" class="input-group--focused" item-text="name" item-value="languages" disabled></v-select>
								</v-flex>
								<v-flex class="half_line">
									<v-select :items="staffSkills" v-model="editedItem.skills" label="Skills" item-text="name" item-value="staffSkills" autocomplete multiple></v-select>
								</v-flex>
								<v-flex class="half_line">
									<v-select :items="status" v-model="editedItem.status" label="Status" class="input-group--focused"></v-select>
								</v-flex>
								<v-flex class="full_line">
									<v-text-field v-model="editedItem.description" label="Description" multi-line></v-text-field>
								</v-flex>
								<v-flex class="half_line">
								</v-flex>
							</v-layout>
						</v-form>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" flat @click.native="save">
						Save
						<v-icon right>backup</v-icon>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-data-table :headers="columns" :items="rows" item-key="firstName" expand>
			<template slot="items" slot-scope="props">
				<tr>
					<!-- Show Details Column -->
					<td >
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
					<td>{{ props.item.firstName }} {{ props.item.lastName }}</td>
					<td>
						<v-icon v-if="props.item.gender == 'Male'" title="Male">mdi-gender-male</v-icon>
						<v-icon v-if="props.item.gender == 'Female'" title="Female">mdi-gender-female</v-icon>
						<v-icon v-if="props.item.gender == 'Unknown'" title="Unknown">remove</v-icon>
					</td>
					<td>{{ props.item.birthday | formatDate }}</td>
					<td><span v-for="nationality in props.item.nationality" :key="nationality.abbr"><flag :title="nationality.name" :iso="nationality.abbr" class="flags_skills border"/> {{ nationality.name }}</span></td>
					<td><span v-for="language in props.item.spokenLanguage" :key="language.abbr"><flag :title="language.name" :iso="language.abbr" class="flags_skills border"/></span></td>
					<td><span v-for="skill in props.item.skills" :key="skill.name"><v-icon :title="skill.name">mdi-{{ skill.icon }}</v-icon></span></td>
					<!-- Status Column -->
					<td v-if="props.item.status == 'Available'">
						<v-icon title="Available">done</v-icon>
					</td>
					<td v-else-if="props.item.status == 'Assigned'">
						<v-icon title="Assigned">spellcheck</v-icon>
					</td>
					<td v-else-if="props.item.status == 'Suspended'">
						<v-icon title="Suspended">not_interested</v-icon>
					</td>
					<td v-else-if="props.item.status == 'Inactive'">
						<v-icon title="Inactive">error</v-icon>
					</td>
					<td v-else></td>

					<!-- Visibility Column -->
					<td v-if="props.item.visibility">
						<v-icon title="Visible">visibility</v-icon>
					</td>
					<td v-else>
						<v-icon title="Non Visible">visibility_off</v-icon>
					</td>

					<!-- Options Column -->
					<td>
						<!-- <v-icon v-on:click="addItem(props.item)" title="Adicionar" class="opc">add_box</v-icon>--> <!-- add, add circle, add circle outline, delete sweep, room(localização), location on-->
						<v-icon title="Edit" class="opc" @click="editItem(props.item)">create</v-icon>
						<v-icon title="Delete" class="opc" @click="delItem(props.item)">delete</v-icon>
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
		</v-data-table>
	</v-app>
</template>

<script>
export default {
	name: 'Users',
	data () {
		return {
			title: 'Users Management Demo',
			//Variable responsible for showing the User Form
			dialog : false,
			//Variable responsible for keeping track of adding User
			createUser: true,
			//Variable responsible for showing DatePicker
			date: false,
			//Set of rules within User Form
			rules: {
				required: value => value !== undefined && value.trim().length > 0 || 'Required',
				email: value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'E-mail must be valid',
				username: value => /^([\w.-]+)*$/.test(value) || 'Username must be valid. Special characters available are [period, underscore and hyphen]'
			},
			gender:['Male','Female','Unknown'],
			status:['Available', 'Assigned', 'Suspended', 'Inactive'],
			systemLanguages: [{name:'German', abbr:'de'},{name:'Austrian', abbr:'at'},{name:'Belgian', abbr:'be'},{name:'Bulgarian', abbr:'bg'},{name:'Cypriot', abbr:'cy'},{name:'Croatian', abbr:'hr'},{name:'Danish', abbr:'dk'},{name:'Slovakian', abbr:'sk'},{name:'Slovene', abbr:'si'},{name:'Spanish', abbr:'es'},{name:'Estonian', abbr:'ee'},{name:'Finnish', abbr:'fi'},{name:'French', abbr:'fr'},{name:'Greek', abbr:'gr'},{name:'Hungarian', abbr:'hu'},{name:'Irish', abbr:'ie'},{name:'Italian', abbr:'it'},{name:'Latvian', abbr:'lv'},{name:'Lithuanian', abbr:'lt'},{name:'Luxembourgish', abbr:'lu'},{name:'Maltese', abbr:'mt'},{name:'Dutch', abbr:'nl'},{name:'Polish', abbr:'pl'},{name:'Portuguese', abbr:'pt'},{name:'British', abbr:'gb'},{name:'Czech', abbr:'cz'},{name:'Romanian', abbr:'ro'},{name:'Swedish', abbr:'se'}],
			languages: [{name:'German', abbr:'de'},{name:'Austrian', abbr:'at'},{name:'Belgian', abbr:'be'},{name:'Bulgarian', abbr:'bg'},{name:'Cypriot', abbr:'cy'},{name:'Croatian', abbr:'hr'},{name:'Danish', abbr:'dk'},{name:'Slovakian', abbr:'sk'},{name:'Slovene', abbr:'si'},{name:'Spanish', abbr:'es'},{name:'Estonian', abbr:'ee'},{name:'Finnish', abbr:'fi'},{name:'French', abbr:'fr'},{name:'Greek', abbr:'gr'},{name:'Hungarian', abbr:'hu'},{name:'Irish', abbr:'ie'},{name:'Italian', abbr:'it'},{name:'Latvian', abbr:'lv'},{name:'Lithuanian', abbr:'lt'},{name:'Luxembourgish', abbr:'lu'},{name:'Maltese', abbr:'mt'},{name:'Dutch', abbr:'nl'},{name:'Polish', abbr:'pl'},{name:'Portuguese', abbr:'pt'},{name:'British', abbr:'gb'},{name:'Czech', abbr:'cz'},{name:'Romanian', abbr:'ro'},{name:'Swedish', abbr:'se'},{name:'Unknown', abbr:''}],
			staffSkills:[{name:'Chemical', icon:'chemical-weapon'},{name:'Biological', icon:'biohazard'},{name:'Radioactive', icon:'radioactive'},{name:'Nuclear', icon:'atom'},{name:'Explosive', icon:'bomb'}],
			columns: [
				{text: '', value: 'details', type: 'boolean', sortable: false},
				{text: 'Active', value: 'active', type: 'boolean'},
				{text: 'Name', value: 'name', type: 'text', width: '17%'},
				{text: 'Gender', value: 'gender', type: 'text'},
				{text: 'Birthdate', value: 'birthday', type: 'date'},
				{text: 'Nationality', value: 'nationality', type: 'array', width: '14%'},
				{text: 'Spoken Languages', value: 'spokenLanguage', type: 'array'},
				{text: 'Skills', value: 'skills', width: '18%', type: 'array'},
				{text: 'Status', value: 'status', type: 'text'},
				{text: 'Visible', value: 'visibility', type: 'boolean'},
				{text: 'Actions', value: 'opc', width: '12%', sortable: false}
			],
			rows: [
			],
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
			console.log(this.$refs);
			this.$refs.profile_pic.outerHTML = '';
			this.$refs.avatar.innerText = 'person';
		},
		//Get Users BD
		getUsers() {
			this.$http.get('/users')
				.then(response => {
					this.rows.length = 0;
					response.data.forEach(user => {
						user.birthday = user.birthday.split('T')[0];
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
		editUser() {
			this.$http.put('/users/' + this.editedItem._id, this.editedItem)
				.then(response => {
					console.log('User updated', response.data);
					this.$emit('dismiss', response.data);
					Object.assign(this.rows[this.editedIndex], response.data);
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
			this.dialog = true;
		},
		delItem: function(user){
			//Call Delete User
			const index = user._id;
			const index_row = this.rows.indexOf(user);
			console.log('Request to delete user', index);
			var conf = confirm('Are you sure you want to delete this user?');
			if (conf) {
				this.rows.splice(index_row, 1);
				this.$http.delete('/users/' + index)
					.then(response => {
						console.log('User deleted', response);
						this.$emit('dismiss', index);
					})
					.catch(error => {
						console.log(error);
					//this.saving = false;
					//this.errorHandler(error);
					});
			}
		},
		close () {
			this.dialog = false;
			this.createUser = true;
			setTimeout(() => {
				this.editedItem = Object.assign({}, null);
				this.editedItem.spokenLanguage = [];
				this.editedItem.skills = [];
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
					this.editUser();
				}
				this.close();
			}
		}
	}
};
</script>

<style scoped>
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
