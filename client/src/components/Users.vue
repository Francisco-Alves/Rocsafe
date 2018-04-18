<template>
	<v-app>
		<v-dialog v-model="dialog" max-width="500px">
			<v-btn slot="activator" color="primary" dark class="mb-2">New User</v-btn>
			<v-card>
				<v-card-title>
					<span class="headline"></span>
				</v-card-title>
				<v-card-text>
					<v-container grid-list-md>
						<h2>User Form</h2>
						<v-layout wrap>
							<v-flex class="half_line">
								<v-text-field v-model="editedItem.firstName" label="First Name"></v-text-field>
							</v-flex>
							<v-flex class="half_line">
								<v-text-field v-model="editedItem.lastName" label="Last Name"></v-text-field>
							</v-flex>
							<v-flex class="full_line">
								<v-text-field v-model="editedItem.username" label="Username"></v-text-field>
							</v-flex>
							<v-flex class="half_line">
								<v-checkbox v-model="editedItem.active" label="Active"></v-checkbox>
							</v-flex>
							<v-flex class="half_line">
								<v-checkbox v-model="editedItem.visibility" label="Visibility"></v-checkbox>
							</v-flex>
							<v-flex class="half_line">
								<v-select :items="languages" v-model="editedItem.nationality" label="Nationality" class="input-group--focused" item-text="name" item-value="languages"></v-select>
							</v-flex>
							<v-flex class="half_line">
								<v-select :items="languages" v-model="editedItem.nativeLanguage" label="Native Language" class="input-group--focused" item-text="name" item-value="languages"></v-select>
							</v-flex>
							<v-flex class="half_line">
								<v-select :items="languages" v-model="editedItem.spokenLanguage" label="Spoken Languages" item-text="name" item-value="languages" autocomplete multiple chips></v-select>
							</v-flex>
							<v-flex class="half_line">
								<v-select :items="systemLanguages" v-model="editedItem.systemLanguage" label="System Language" class="input-group--focused" item-text="name" item-value="languages" disabled></v-select>
							</v-flex>
							<v-flex class="half_line">
								<v-select :items="staffSkills" v-model="editedItem.skills" label="Skills" item-text="name" item-value="staffSkills" autocomplete multiple chips></v-select>
							</v-flex>
							<v-flex class="half_line">
								<v-select :items="status" v-model="editedItem.status" label="Status" class="input-group--focused"></v-select>
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
							<v-flex class="half_line">
								Gender:
								<v-radio-group v-model="editedItem.gender">
									<v-radio v-for="n in gender" :key="n" :label="`${n}`" :value="n"></v-radio>
								</v-radio-group>
							</v-flex>
							<v-flex class="half_line">
								<v-text-field v-model="editedItem.phone" label="Phone" prepend-icon="phone" mask="#########"></v-text-field>
							</v-flex>
							<v-flex class="half_line">
								<v-text-field v-model="editedItem.email" label="Email" prepend-icon="email" :rules="[rules.required, rules.email]"></v-text-field>
							</v-flex>
							<v-flex class="full_line">
								<v-text-field v-model="editedItem.description" label="Description" multi-line></v-text-field>
							</v-flex>
							<v-flex class="half_line">

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
		<v-data-table :headers="columns" :items="rows" item-key="firstName" :v-model="getUsers()" expand>
			<template slot="items" slot-scope="props">
				<tr @click="props.expanded = !props.expanded">
					<!-- Show Details Column -->
					<td >
						<v-icon v-if="props.expanded" title="Hide" class="opc">keyboard_arrow_up</v-icon>
						<v-icon v-else title="Show More" class="opc">keyboard_arrow_down</v-icon>
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
					<td><span v-for="nationality in props.item.nationality" :key="nationality.abbr"><flag class="flags_skills" :title="nationality.name" :iso="nationality.abbr"/> {{ nationality.name }}</span></td>
					<td><span v-for="language in props.item.spokenLanguage" :key="language.abbr"><flag class="flags_skills" :title="language.name" :iso="language.abbr"/></span></td>
					<td><span v-for="skill in props.item.skills" :key="skill.name"><v-icon :title="skill.name">mdi-{{ skill.icon }}</v-icon></span></td>
					<!-- Status Column -->
					<td v-if="props.item.status == 'Available'">
						<v-icon title="Available" class="opc">done</v-icon>
					</td>
					<td v-else-if="props.item.status == 'Assigned'">
						<v-icon title="Assigned" class="opc">spellcheck</v-icon>
					</td>
					<td v-else-if="props.item.status == 'Suspended'">
						<v-icon title="Suspended" class="opc">not_interested</v-icon>
					</td>
					<td v-else-if="props.item.status == 'Inactive'">
						<v-icon title="Inactive" class="opc">error</v-icon>
					</td>

					<!-- Visibility Column -->
					<td v-if="props.item.visibility">
						<v-icon @click="props.item.visibility = !props.item.visibility" title="Visible" class="opc">visibility</v-icon>
					</td>
					<td v-else>
						<v-icon @click="props.item.visibility = !props.item.visibility" title="Non Visible" class="opc">visibility_off</v-icon>
					</td>

					<!-- Options Column -->
					<td>
						<!-- <v-icon v-on:click="addItem(props.item)" title="Adicionar" class="opc">add_box</v-icon>--> <!-- add, add circle, add circle outline, delete sweep, room(localização), location on-->
						<v-icon @click="editItem(props.item)" title="Edit" class="opc">create</v-icon>
						<v-icon @click="delItem(props.item)" title="Delete" class="opc">delete</v-icon>
					</td>
				</tr>

				<!-- Details Section -->

			</template>
			<template slot="expand" slot-scope="props">
				<td colspan="11">
					<v-container>
						<v-flex class="profile_img">
							<v-card-media style="width:180px;" :src="'https://rocsafe.inov.pt/img/users/' + props.item.username + '.jpg'" height="200px"></v-card-media>
						</v-flex>
						<v-flex>
							<span class="details_content">
								Username: {{ props.item.username }}
							</span>
							<span class="details_content">
								Native Language: <span v-for="nativeLanguage in props.item.nativeLanguage" :key="nativeLanguage.abbr"><flag class="flags_skills" :title="nativeLanguage.name" :iso="nativeLanguage.abbr"/></span>
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
								Description: {{ props.item.description }} Lorem ipsum dolor sLorem ipsum dolor sit amet, in per suscipit hymenaeos pellentesque suspendisse, molestiae sed, tincidunt sapien rhoncus scelerisque, morbi justo et fermentum aliquet elit lorem, fermentum magna.Lorem ipsum dolor sit amet, in per suscipit hymenaeos pellentesque suspendisse, molestiae sed, tincidunt sapien rhoncus scelerisque, morbi justo et fermentum aliquet elit lorem, fermentum magna.Lorem ipsum dolor sit amet, in per suscipit.
							</span>
						</v-flex>
					</v-container>
					<v-container>
						Missions
					</v-container>
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
			title: 'Tabela',
			dialog : false,
			date: false,
			rules: {
				required: (value) => !!value || 'Required.',
				email: (value) => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return pattern.test(value) || 'Invalid e-mail.';
				}
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
				{text: 'Options', value: 'opc', width: '12%', sortable: false}
			],
			rows: [
			],
			editedItem: {
				firstName: '',
				lastName: '',
				active: true,
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
			editedIndex: []
		};
	},
	mounted () {
	},
	created() {
		this.getUsers();
	},
	methods: {
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

				})
				.catch(error => {
				//this.errorHandler(error);
					console.log(error);
				});
		},
		editUser() {
			this.$http.put('/users/' + this.editedIndex, this.editedItem)
				.then(response => {
					console.log('User updated', response.data);
					this.$emit('dismiss', response.data);
				})
				.catch(error => {
					console.log(error);
				//this.saving = false;
				//this.errorHandler(error);
				});
		},
		editItem: function(user){
			//Call Edit User
			this.editedIndex = user._id;
			this.editedItem = Object.assign({}, user);
			this.dialog = true;
		},
		delItem: function(user){
			//Call Delete User
			const index = user._id;
			console.log('Request to delete mission', index);
			var conf = confirm('Are you sure you want to delete this item?');
			if (conf) {
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
			setTimeout(() => {
				this.editedItem = Object.assign({}, null);
				this.editedIndex = [];
			}, 300);
		},
		//Save user btn function
		save () {
			//Call Edit User
			if (this.editedItem._id !== null) {
				//console.log(this.editedItem);
				//	Object.assign(this.rows[this.editedIndex], this.editedItem);
				this.editUser();
			} else {
				//Call Create User
				this.postUser();
			}
			this.close();

		}
	}
};
</script>

<style scoped>
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
	height: 7.2em;
	line-height: 1.8em;
}
.flags_skills{
	margin-right:5px;
	height:1.3em;
	width:1.3em;
}
.half_line{
	display:inline-block;
	width:50%;
}
.full_line{
	display:inline-block;
	width:100%;
}
</style>
