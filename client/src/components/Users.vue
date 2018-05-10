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

		<v-toolbar dense>
			<v-switch v-model="userAdmin" label="Admin" style="max-width: 100px; padding-top: 25px;"></v-switch>
			<v-btn v-if="userAdmin" color="primary" dark class="mb-2" @click="userForm = !userForm">New User</v-btn>
			<v-btn v-if="userAdmin" color="primary" dark class="mb-2" @click="jsonForm = !jsonForm">JSON File</v-btn>
			<v-spacer></v-spacer><v-spacer></v-spacer>
			<v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
		</v-toolbar>
		<!-- User Form Dialog -->
		<v-dialog v-model="userForm" scrollable max-width="1000px" persistent>
			<template>
				<div>
					<v-toolbar v-if="!createUser" color="primary" dark tabs>
						<v-tabs v-model="selectedTab" centered color="primary" slider-color="white">
							<v-tab :href="`#tab-edit`">
								Edit User
							</v-tab>
							<v-tab :href="`#tab-missions`">
								User Missions
							</v-tab>
						</v-tabs>
						<v-spacer></v-spacer>
						<v-btn class="inline close" icon dark @click.native="close">
							<v-icon>close</v-icon>
						</v-btn>
					</v-toolbar>
					<v-tabs-items v-model="selectedTab">
						<v-tab-item :id="`tab-edit`" class="users_tab">
							<v-card>
								<v-card-title>
									<v-toolbar dense dark color="primary">
										<v-avatar size="40">
											<v-icon x-large>person</v-icon>
										</v-avatar>
										<span v-if="createUser" class="headline mx-3"> Add User </span>
										<span v-else class="headline mx-3"> Edit User </span>
										<v-spacer></v-spacer>
										<v-btn v-if="createUser" class="inline close" icon dark @click.native="close">
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
												<v-flex class="half_line">
													<v-text-field v-model="editedItem.description" label="Description" rows="3" multi-line></v-text-field>
												</v-flex>

												<v-flex class="half_line">
													<v-text-field v-model="imageName" label="Select Image" prepend-icon="attach_file" @click="pickFile"></v-text-field>
													<input ref="image" type="file" style="display: none" accept="image/*" @change="onFilePicked">
													<span v-if="!validImageFile" style="color:red;">Please Select Valid JPG or PNG File</span>
												</v-flex>
											</v-layout>
										</v-form>
									</v-container>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn :disabled="!valid && !validImageFile" color="blue darken-1" flat @click.native="save">
										Save
										<v-icon right>backup</v-icon>
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-tab-item>
						<v-tab-item :id="`tab-missions`" class="users_tab">
							<!-- Missions Datatable -->
							<v-data-table :headers="missionColumns" :items="missionRows" :pagination.sync="missionPagination" item-key="name" style="width:1000px; padding:10px;">
								<template slot="headers" slot-scope="props">
									<tr>
										<th v-for="header in props.headers" :key="header.text" :class="['column sortable', missionPagination.descending ? 'desc' : 'asc', header.value === missionPagination.sortBy ? 'active' : '']" style="text-align:left; padding:5px;" @click="changeMissionSort(header.value)">
											<span>{{ header.text }}</span>
											<v-icon v-if="header.sortable != false" small>arrow_upward</v-icon>
										</th>
									</tr>
								</template>
								<template slot="items" slot-scope="props">
									<tr class="missionTable">
										<!-- Mission Name Column -->
										<td id="missionColumnName" style="padding-left: 5px; padding-right: 5px;">{{ props.item.name }}</td>
										<!-- Mission Status Column -->
										<td id="missionColumnStatus">
											<v-icon v-if="props.item.status == 'Started'" title="Started">mdi-clock-start</v-icon>
											<v-icon v-if="props.item.status == 'Ended'" title="Ended">mdi-clock-end</v-icon>
											<v-icon v-if="props.item.status == 'Programmed'" title="Programmed">mdi-calendar-clock</v-icon>
											<v-icon v-if="props.item.status == 'Cancelled'" title="Cancelled">mdi-cancel</v-icon>
										</td>
										<!-- Mission Duration Column -->
										<td id="missionColumnDuration">{{ props.item.startDate | formatDate }} - {{ props.item.endDate | formatDate }}</td>
										<!-- Mission Type Column -->
										<td id="missionColumnType">{{ props.item.type }}</td>
										<!-- Mission Commander Column -->
										<td id="missionColumnCommander">{{ props.item.missionCommander }}</td>
										<!-- Mission Description Column -->
										<td id="missionColumnDescription">{{ props.item.description }}</td>
										<!-- Mission Visibility Column -->
										<td v-if="props.item.visible" id="missionColumnVisible">
											<v-icon title="Visible">visibility</v-icon>
										</td>
										<td v-else id="missionColumnVisible">
											<v-icon title="Non Visible">visibility_off</v-icon>
										</td>
										<!-- Mission Accessibility Column -->
										<td v-if="props.item.restrictedAccess" id="missionColumnAccess">
											<v-icon title="Restricted Access">mdi-lock</v-icon>
										</td>
										<td v-else id="missionColumnAccess">
											<v-icon title="Accessible">mdi-lock-open-outline</v-icon>
										</td>
										<!-- Mission Location Column -->
										<td id="missionColumnLocation"><v-icon title="">room</v-icon></td>
										<!-- Mission Column -->
										<td id="missionColumnDetails"><v-icon title="">mdi-dots-horizontal-circle</v-icon></td>
									</tr>
								</template>
							</v-data-table>
						</v-tab-item>
					</v-tabs-items>
				</div>
			</template>
		</v-dialog>
		<!--JSON Form Dialog -->
		<v-dialog v-model="jsonForm" scrollable max-width="500px" persistent>
			<v-card>
				<v-card-title>
					<v-toolbar dense dark color="primary">
						<span class="headline mx-3"> Add Users </span>
						<v-spacer></v-spacer>
						<v-btn class="inline close" icon dark @click.native="closeJsonForm">
							<v-icon>close</v-icon>
						</v-btn>
					</v-toolbar>
				</v-card-title>
				<v-card-text>
					<v-container grid-list-md>
						<v-form ref="form" v-model="valid" lazy-validation>
							<v-layout wrap>
								<v-flex class="half_line">
									<v-text-field ref="textFieldJson" v-model="jsonName" label="Select JSON File" prepend-icon="attach_file" @click="pickJSONFile"></v-text-field>
									<input ref="json" type="file" style="display: none" accept=".json" @change="onJSONFilePicked">
									<span v-if="!validFile" style="color:red;">Please Select Valid Json File</span>
								</v-flex>
							</v-layout>
						</v-form>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn :disabled="!validJson" color="blue darken-1" flat @click.native="createJSON">
						Add
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
						<span v-if="header.value == 'active'">{{ header.text }}</span>
						<span v-else-if="header.value == 'firstName'">{{ header.text }}</span>
						<span v-else-if="header.value == 'gender'"><v-icon style="opacity: 1;" medium title="Gender">mdi-gender-male-female</v-icon></span>
						<span v-else-if="header.value == 'birthday'">{{ header.text }}</span>
						<span v-else-if="header.value == 'nationality'">{{ header.text }}</span>
						<span v-else-if="header.value == 'spokenLanguage'">{{ header.text }}</span>
						<span v-else-if="header.value == 'skills'">{{ header.text }}</span>
						<span v-else-if="header.value == 'status'">{{ header.text }}</span>
						<span v-else-if="header.value == 'visibility'">{{ header.text }}</span>
						<span v-else-if="header.value == 'actions' && userAdmin">{{ header.text }}</span>

						<v-icon v-if="header.sortable != false" small>arrow_upward</v-icon>
					</th>
				</tr>
			</template>
			<template v-if="userAdmin || (props.item.visibility && !userAdmin)" slot="items" slot-scope="props">
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
					<td v-if="userAdmin" id="columnActions">
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
							<img v-if="props.item.photo" :src="props.item.photo" style="width:180px;" height="200px"/>
							<img v-else ref="profile_pic" :src="'https://rocsafe.inov.pt/img/users/' + props.item.username + '.jpg'" style="width:180px;" height="200px" @error="imageLoadOnError()">
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
			//User Datatable Pagination Variable
			pagination: {
				sortBy: 'firstName'
			},
			//Mission Datatable Pagination Variable
			missionPagination: {
				sortBy: 'name'
			},
			//Variable responsible for warning delete alert
			deleteAlert: false,
			//Search parameter
			search: '',
			//Variable responsible for enabling save button (User Form)
			valid: false,
			imageName: '',
			jsonName: '',
			jsonFile: '',
			jsonForm: false,
			validJson: false,
			validFile: true,
			validImageFile: true,
			userAdmin: true,
			selectedTab: 'tab-edit',
			text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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
			missionColumns: [
				{text: 'Name', value: 'name', type: 'text'},
				{text: 'Status', value: 'status', type: 'text'},
				{text: 'Duration', value: 'startDate', type: 'date'},
				{text: 'Type', value: 'type', type: 'text'},
				{text: 'M. C.', value: 'missionCommander', type: 'text'},
				{text: 'Description', value: 'description', type: 'text'},
				{text: 'Visible', value: 'visible', type: 'boolean'},
				{text: 'Access', value: 'restrictedAccess', type: 'boolean'},
				{text: 'Location', value: 'location', type: 'text'},
				{text: '', value: 'actions', sortable: false}
			],
			missionRows: [],
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
		changeMissionSort (column) {
			if (this.missionPagination.sortBy === column) {
				this.missionPagination.descending = !this.missionPagination.descending;
			} else {
				this.missionPagination.sortBy = column;
				this.missionPagination.descending = false;
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
				if(files[0].type === 'image/jpeg'||'image/png'){
					var fr = new FileReader();
					fr.onload = function() {
						var data = fr.result;
						localStorage.setItem('image', data);
					};
					fr.readAsDataURL(files[0]);
					this.validImageFile = true;
				}
			}else {
				this.validImageFile = false;
				this.imageName = '';
			}
		},
		pickJSONFile () {
			this.$refs.json.click ();
		},
		onJSONFilePicked (e) {
			const files = e.target.files;
			if(files[0] !== undefined) {
				this.jsonName = files[0].name;
				if(this.jsonName.lastIndexOf('.') <= 0) {
					return;
				}

				if(files[0].type === 'application/json'){
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
					this.validJson = true;
					this.validFile = true;
				}
			}else{
				this.jsonFile = '';
				this.jsonName = '';
				this.validFile = false;
				this.validJson = false;
			}
		},
		createJSON(){
			var aux = localStorage.getItem('json');
			localStorage.removeItem('json');
			this.jsonFile = JSON.parse(aux);
			for (var i = 0; i < this.jsonFile.length; i++) {
				this.editedItem.firstName = this.jsonFile[i].firstName;
				this.editedItem.lastName = this.jsonFile[i].lastName;
				this.editedItem.email = this.jsonFile[i].email;
				this.editedItem.username = this.jsonFile[i].username;
				this.editedItem.active = this.jsonFile[i].active;
				this.editedItem.gender = this.jsonFile[i].gender;
				this.editedItem.birthday = this.jsonFile[i].birthday;
				this.editedItem.phone = this.jsonFile[i].phone;
				this.editedItem.photo = this.jsonFile[i].photo;
				this.editedItem.description = this.jsonFile[i].description;
				this.editedItem.nationality = this.jsonFile[i].nationality;
				this.editedItem.skills = this.jsonFile[i].skills;
				this.editedItem.nativeLanguage = this.jsonFile[i].nativeLanguage;
				this.editedItem.spokenLanguage = this.jsonFile[i].spokenLanguage;
				this.editedItem.systemLanguage = this.jsonFile[i].systemLanguage;
				this.editedItem.status = this.jsonFile[i].status;
				this.editedItem.visibility = this.jsonFile[i].visibility;
				this.editedItem._id = this.mongoObjectId();
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
				this.editedItem = {};
			}
			this.jsonFile = '';
			this.closeJsonForm();
		},
		closeJsonForm(){
			this.jsonForm = false;
			setTimeout(() => {
				this.jsonName = '';
				this.jsonFile = '';
			}, 500);
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
		//Get Missions BD
		getMissions() {
			this.$http.get('/missions')
				.then(response => {
					this.missionRows.length = 0;
					response.data.forEach(mission => {
						this.missionRows.push(mission);
					});
				});
		},
		postUser() {
			var aux = localStorage.getItem('image');
			localStorage.removeItem('image');
			this.editedItem.photo = aux;
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
			var aux = localStorage.getItem('image');
			localStorage.removeItem('image');
			user.photo = aux;
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

			//Get User Missions
			this.getMissions();
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
				this.validImageFile = true;
				this.selectedTab = 'tab-edit';
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
/*Users Datatable*/
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
/*Missions Datatable*/
.missionTable > td{
	padding-left:5px !important;
}
#missionColumnName{
	max-width: 100px;
	padding-left:5px;
	padding-right:5px;
}
#missionColumnStatus{
	max-width: 20px;
	padding-left:5px;
	padding-right:5px;
}
#missionColumnDuration{
	max-width: 50px;
	padding-left:5px;
	padding-right:5px;
}
#missionColumnType{
	max-width: 70px;
	padding-left:5px;
	padding-right:5px;
}
#missionColumnCommander{
	max-width: 70px;
	padding-left:5px;
	padding-right:5px;
}
#missionColumnDescription{
	max-width: 200px;
	padding-left:5px;
	padding-right:5px;
}
#missionColumnVisible{
	max-width: 20px;
	padding-left:5px;
	padding-right:5px;
}
#missionColumnAccess{
	max-width: 20px;
	padding-left:5px;
	padding-right:5px;
}
#missionColumnLocation{
	max-width: 20px;
	padding-left:5px;
	padding-right:5px;
}
#missionColumnDetails{
	max-width: 20px;
	padding-left:5px;
	padding-right:5px;
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
.users_tab{
	min-height:400px;
	max-height:800px;
	min-width:700px;
	max-width:1000px;
	background-color:white;
}
</style>
