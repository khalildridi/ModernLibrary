/* ===================== CREATE/EDIT MODAL ELEMENTS ======================= */
const condition1Input = document.getElementById("condition1");
const condition2Input = document.getElementById("condition2");
const condition3Input = document.getElementById("condition3");
const condition4Input = document.getElementById("condition4");
let currentCondition = "";
const errorsSectionSaveData = document.getElementById("errorsSectionSaveData");

/* ===================== TOAST ELEMENTS ======================= */
const toast = document.getElementById("toastInfo");
const toastMsg = document.getElementById("toastMsg");

const table = document.querySelector("#loyaltyConditionsTable");

const PREFIX = "api/v1/loyaltyConditions/";

async function getLoyaltyConditionsData(attribute = "") {
	try {
		return await fetch(PREFIX + "?condition=" + attribute, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}).then((res) => res.json());
	} catch (err) {
		throw err;
	}
}

async function storeLoyaltyConditionsData(conditions) {
	try {
		return await fetch(PREFIX + "edit/" + currentCondition, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(conditions),
		}).then((res) => res.json());
	} catch (err) {
		throw err;
	}
}

function clearInputs() {
	//clean the inputs
	condition1Input.value = "";
	condition2Input.value = "";
	condition3Input.value = "";
	condition4Input.value = "";
}

function addConditionToHTMLTable(conditionDetails, namedCondition) {
	table.innerHTML += `<tr
	class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
	<th class="px-6 py-4">${namedCondition}</th>
	<td class="px-6 py-4">${conditionDetails[0]}</td>
	<td class="px-6 py-4">${conditionDetails[1]}</td>
	<td class="px-6 py-4">${conditionDetails[2]}</td>
	<td class="px-6 py-4">${conditionDetails[3]}</td>
	<td class="px-6 py-4">
		<button type="button" btn-edit="${namedCondition}"
			class="bg-orange-100 transition text-orange-500 hover:text-white border border-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg p-1.5 text-center dark:border-orange-300 dark:text-orange-300 cursor-pointer dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
				viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round"
					d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
			</svg>
		</button>
	</td>
</tr>`;

	editButtonActions();
	clearInputs();
}

function addConditionsToHTMLTable(conditionsDetails) {
	table.innerHTML = "";
	const namedConditions = ["percentages", "ages", "numAcquisitions", "numSoldBooks"];
	for (let i = 0; i < conditionsDetails[namedConditions[i]]?.length; i++) {
		addConditionToHTMLTable(conditionsDetails[namedConditions[i]], namedConditions[i]);
	}
}

async function reloadData() {
	try {
		let result = await getLoyaltyConditionsData();
		addConditionsToHTMLTable(result[0]);
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
		let conditions = [];
		conditions.push(condition1Input.value);
		conditions.push(condition2Input.value);
		conditions.push(condition3Input.value);
		conditions.push(condition4Input.value);

		let result = await storeLoyaltyConditionsData(conditions);

		if (result.errors) {
			showErrors(errorsSectionSaveData, result.errors);
		} else {
			showToast("Condition saved successfully", 3500);
			await reloadData();
			MicroModal.close("loyaltyConditionsModal");
		}
	} catch (err) {
		console.log(err);
	}
});

function editButtonActions() {
	const editBtns = document.querySelectorAll("button[btn-edit]");
	for (const element of editBtns) {
		element.addEventListener("click", async () => {
			try {
				currentCondition = element.getAttribute("btn-edit");
				const loyaltyConditionsDetails = await getLoyaltyConditionsData(currentCondition);
				const conditionsArray = loyaltyConditionsDetails[0][currentCondition];

				if (currentCondition == "ages") {
					condition1Input.type = "text";
					condition2Input.type = "text";
					condition3Input.type = "text";
					condition4Input.type = "text";
				} else {
					condition1Input.type = "number";
					condition2Input.type = "number";
					condition3Input.type = "number";
					condition4Input.type = "number";
				}

				condition1Input.value = conditionsArray[0];
				condition2Input.value = conditionsArray[1];
				condition3Input.value = conditionsArray[2];
				condition4Input.value = conditionsArray[3];

				MicroModal.show("loyaltyConditionsModal");
			} catch (err) {
				console.log(err);
			}
		});
	}
}

reloadData();
