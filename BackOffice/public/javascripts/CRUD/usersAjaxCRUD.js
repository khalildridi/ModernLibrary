/* ===================== CREATE/EDIT MODAL ELEMENTS ======================= */
const idSaveData = document.getElementById("_idSaveData");
const idDeleteData = document.getElementById("_idDeleteData");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const dobInput = document.getElementById("date_of_birth");
const contactInput = document.getElementById("contact");
const loggedUserId = document.getElementById("loggedUserId");
const roleInput = document.getElementById("role");
const errorsSectionSaveData = document.getElementById("errorsSectionSaveData");

/* ===================== TOAST ELEMENTS ======================= */
const toast = document.getElementById("toastInfo");
const toastMsg = document.getElementById("toastMsg");

const modalTitle = document.getElementById("userModal-title");
const tableBody = document.querySelector("#usersTable tbody");
const searchBar = document.getElementById("search");

/* ===================== PAGINATION ELEMENTS ======================= */
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const paginationFirstEntry = document.getElementById("firstEntry");
const paginationLastEntry = document.getElementById("lastEntry");
const paginationTotalEntries = document.getElementById("totalEntries");
const perPage = document.getElementById("perPage");
let currentPage = 1;

const PREFIX = "api/v1/users/";

async function storeUserData(userData) {
	try {
		return await fetch(PREFIX + "create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(userData),
		}).then((res) => res.json());
	} catch (err) {
		throw err;
	}
}

async function getUserData(_id) {
	try {
		return await fetch(PREFIX + "show/" + _id, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}).then((res) => res.json());
	} catch (err) {
		throw err;
	}
}

async function updateUserData(userData, _id) {
	try {
		return await fetch(PREFIX + "edit/" + _id, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(userData),
		}).then((res) => res.json());
	} catch (err) {
		throw err;
	}
}

function showToast(msg, time) {
	toastMsg.innerHTML = msg;
	toast.classList.remove("hidden");
	toast.classList.remove("opacity-0");
	toast.classList.add("transition-all", "duration-150", "opacity-1");

	setTimeout(() => {
		toast.classList.remove("opacity-1");
		toast.classList.add("transition-all", "duration-150", "opacity-0");
		toast.classList.add("hidden");
	}, time);
}

async function deleteUserData(userId, loggedUserId) {
	try {
		return await fetch(PREFIX + `delete/${userId}/${loggedUserId}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		}).then((res) => res.json());
	} catch (err) {
		throw err;
	}
}

async function searchUsers() {
	try {
		let result = await fetch(
			PREFIX +
				`search?searchContent=${searchBar.value}&page=${currentPage}&perPage=${perPage.value}`,
			{
				method: "GET",
				headers: { "Content-Type": "application/json" },
			}
		).then((res) => res.json());

		const { user, ...pageDetails } = result;
		updatePaginationDetails(pageDetails);
		return result;
	} catch (err) {
		throw err;
	}
}

function clearInputs() {
	//clean the inputs
	idSaveData.value = "";
	nameInput.value = "";
	emailInput.value = "";
	dobInput.value = "";
	contactInput.value = "";
	if (roleInput) roleInput.value = "";
}

function addUserToHTMLTable(userDetails) {
	tableBody.innerHTML += `<tr
					class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
					<th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
					  ${userDetails.name}
					</th>
					<td class="px-6 py-4">
					  ${userDetails.email}
					</td>
					<td class="px-6 py-4">
					  ${userDetails.contact}
					</td>
					<td class="px-6 py-4">
					  ${userDetails.date_of_birth}
					</td>
					<td class="px-6 py-4">
					  ${userDetails.points}
					</td>
					<td class="px-6 py-4">
					  ${userDetails.role}
					</td>
					<td class="px-6 py-4 space-x-2">
					  <button type="button" btn-edit="${userDetails._id}" class="bg-orange-100 transition text-orange-500 hover:text-white border border-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg p-1.5 text-center dark:border-orange-300 dark:text-orange-300 cursor-pointer dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900"><svg
                      xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg></button>
					<button type="button" id="" btn-delete="${userDetails._id}"
                    class="bg-orange-100 transition text-orange-500 hover:text-white border border-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg p-1.5 text-center dark:border-orange-300 dark:text-orange-300 cursor-pointer dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
					</td>
				  </tr>`;

	editButtonActions();
	deleteButtonActions();
	clearInputs();
}

function addUsersToHTMLTable(usersDetails) {
	tableBody.innerHTML = "";
	for (const element of usersDetails) {
		addUserToHTMLTable(element);
	}
}

async function reloadData() {
	try {
		let result = await searchUsers();
		tableBody.innerHTML = "";
		addUsersToHTMLTable(result.users);

		const { user, ...pageDetails } = result;
		updatePaginationDetails(pageDetails);
		return result;
	} catch (err) {
		throw err;
	}
}

function showErrors(errorsDisplayArea, errors) {
	errorsDisplayArea.innerHTML = "";

	errorsDisplayArea.innerHTML += `<div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
		<span class="font-medium">Form error! </span>${errors[0].msg}</div>`;

	setTimeout(() => {
		errorsDisplayArea.innerHTML = "";
	}, 3000);
}

/* ====================== Button's Actions ========================== */

const modalSaveDataBtn = document.getElementById("saveData");
modalSaveDataBtn.addEventListener("click", async () => {
	try {
		const userData = {};
		userData.name = nameInput.value;
		userData.email = emailInput.value;
		userData.date_of_birth = dobInput.value;
		userData.contact = contactInput.value;
		if (roleInput) userData.role = roleInput.value;

		let result = null;
		let msg = "";
		if (modalTitle.textContent == "Create User") {
			result = await storeUserData(userData);
			msg = "User created successfully";
		} else {
			result = await updateUserData(userData, idSaveData.value);
			msg = "User updated successfully";
		}

		if (result.errors) {
			showErrors(errorsSectionSaveData, result.errors);
		} else {
			showToast(msg, 3500);
			await reloadData();
			MicroModal.close("userModal");
		}
	} catch (err) {
		console.log(err);
	}
});

const createBtn = document.getElementById("createUser");
createBtn.addEventListener("click", () => {
	MicroModal.show("userModal");
	modalTitle.textContent = "Create User";
	clearInputs();
});

const modalDeleteDataBtn = document.getElementById("deleteData");
modalDeleteDataBtn.addEventListener("click", async () => {
	try {
		await deleteUserData(idDeleteData.value, loggedUserId.value);
		await reloadData();
		MicroModal.close("deleteModal");
		showToast("User deleted successfully", 3500);
	} catch (err) {
		console.log(err);
	}
});

function deleteButtonActions() {
	const deleteBtns = document.querySelectorAll("button[btn-delete]");
	for (const element of deleteBtns) {
		element.addEventListener("click", () => {
			idDeleteData.value = element.getAttribute("btn-delete");
			MicroModal.show("deleteModal");
		});
	}
}

function editButtonActions() {
	const editBtns = document.querySelectorAll("button[btn-edit]");
	for (const element of editBtns) {
		element.addEventListener("click", async () => {
			try {
				const userDetails = await getUserData(element.getAttribute("btn-edit"));

				idSaveData.value = userDetails._id;
				nameInput.value = userDetails.name;
				emailInput.value = userDetails.email;
				dobInput.value = moment(userDetails.date_of_birth).format("MM/DD/YYYY");
				contactInput.value = userDetails.contact;
				if (roleInput) roleInput.value = userDetails.role;

				modalTitle.textContent = "Edit User";
				MicroModal.show("userModal");
			} catch (err) {
				console.log(err);
			}
		});
	}
}

function updatePaginationDetails(pageDetails) {
	let firstEntryValue = pageDetails.limit * (pageDetails.page - 1) + 1;
	let lastEntryValue = pageDetails.limit * pageDetails.page;

	pageDetails.hasPrevPage ? (prevPageBtn.disabled = false) : (prevPageBtn.disabled = true);
	pageDetails.hasNextPage ? (nextPageBtn.disabled = false) : (nextPageBtn.disabled = true);
	if (pageDetails.totalDocs == 0) firstEntryValue = lastEntryValue = 0;
	if (firstEntryValue > pageDetails.totalDocs) {
		currentPage--;
		try {
			reloadData();
		} catch (err) {}
	}

	paginationFirstEntry.innerHTML = firstEntryValue;
	paginationLastEntry.innerHTML =
		lastEntryValue > pageDetails.totalDocs ? pageDetails.totalDocs : lastEntryValue;
	paginationTotalEntries.innerHTML = pageDetails.totalDocs;
}

prevPageBtn.addEventListener("click", () => {
	try {
		if (currentPage - 1 > 0) {
			currentPage--;
		}

		reloadData();
	} catch (err) {
		console.log(err);
	}
});

nextPageBtn.addEventListener("click", () => {
	try {
		currentPage++;

		reloadData();
	} catch (err) {
		console.log(err);
	}
});

let searchTimer = null;
searchBar.addEventListener("keyup", function () {
	if (searchTimer) clearTimeout(searchTimer);
	searchTimer = setTimeout(() => {
		try {
			reloadData();
		} catch (err) {
			console.log(err);
		}
	}, 500);
});

perPage.addEventListener("change", () => {
	try {
		reloadData();
	} catch (err) {
		console.log(err);
	}
});

reloadData();
