/* ===================== CREATE/EDIT MODAL ELEMENTS ======================= */
const idSaveData = document.getElementById("_idSaveData");
const idDeleteData = document.getElementById("_idDeleteData");
const idSellBook = document.getElementById("_idSellBook");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const ISBNInput = document.getElementById("ISBN");
const editorInput = document.getElementById("editor");
const genreInput = document.getElementById("genre");
const launchDateInput = document.getElementById("launch_date");
const numberOfPagesInput = document.getElementById("number_of_pages");
const newInput = document.getElementById("new");
const wornInput = document.getElementById("worn");
const imageInput = document.getElementById("image");
const priceInput = document.getElementById("price");
const synopsisInput = document.getElementById("synopsis");
const loggedUserId = document.getElementById("loggedUserId");
const modalTitle = document.getElementById("bookModal-title");
const apicover = document.getElementById("apicover");
const errorsSectionSaveData = document.getElementById("errorsSectionSaveData");
const errorsSectionSellBook = document.getElementById("errorsSectionSellBook");

/* ===================== TOAST ELEMENTS ======================= */
const toast = document.getElementById("toastInfo");
const toastMsg = document.getElementById("toastMsg");

/* ===================== SELL MODAL ELEMENTS ======================= */
let userPurchaseEmail = document.getElementById("userPurchaseEmail");
const qtNewBooksInput = document.getElementById("newQt");
const qtWornBooksInput = document.getElementById("wornQt");
const bookCover = document.getElementById("bookCover");
const bookTitle = document.getElementById("bookTitle");
const bookSynopsis = document.getElementById("bookSynopsis");
const bookAuthor = document.getElementById("bookAuthor");
const bookISBN = document.getElementById("bookISBN");
const bookEditor = document.getElementById("bookEditor");
const bookGenre = document.getElementById("bookGenre");
const bookLaunchDate = document.getElementById("bookLaunchDate");
const bookNewQt = document.getElementById("bookNewQt");
const bookPrice = document.getElementById("bookPrice");
const bookWornQt = document.getElementById("bookWornQt");
const totalPrice = document.getElementById("totalPrice");

const tableBody = document.querySelector("#booksTable tbody");
const searchBar = document.getElementById("search");

/* ===================== PAGINATION ELEMENTS ======================= */
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const paginationFirstEntry = document.getElementById("firstEntry");
const paginationLastEntry = document.getElementById("lastEntry");
const paginationTotalEntries = document.getElementById("totalEntries");
const perPage = document.getElementById("perPage");
let currentPage = 1;

const PREFIX = "api/v1/books/";

async function storeBookData(formData) {
	try {
		return await fetch(PREFIX + "create", {
			method: "POST",
			body: formData,
		}).then((res) => res.json());
	} catch (err) {
		throw err;
	}
}

async function getBookData(_id) {
	try {
		return await fetch(PREFIX + "show/" + _id, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}).then((res) => res.json());
	} catch (err) {
		throw err;
	}
}

async function updateBookData(formData, _id) {
	try {
		return await fetch(PREFIX + "edit/" + _id, {
			method: "PUT",
			body: formData,
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

async function deleteBookData(bookId, userId) {
	try {
		return await fetch(PREFIX + `delete/${bookId}/${userId}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		}).then((res) => res.json());
	} catch (err) {
		throw err;
	}
}

async function searchBooks() {
	try {
		let result = await fetch(
			PREFIX +
				`search?searchContent=${searchBar.value}&page=${currentPage}&perPage=${perPage.value}`,
			{
				method: "GET",
				headers: { "Content-Type": "application/json" },
			}
		).then((res) => res.json());

		const { book, ...pageDetails } = result;
		updatePaginationDetails(pageDetails);
		return result;
	} catch (err) {
		throw err;
	}
}

function clearInputs() {
	userPurchaseEmail.value = "";
	qtNewBooksInput.value = "";
	qtWornBooksInput.value = "";
	titleInput.value = "";
	authorInput.value = "";
	ISBNInput.value = "";
	editorInput.value = "";
	genreInput.value = "";
	launchDateInput.value = "";
	newInput.value = "";
	wornInput.value = "";
	imageInput.value = "";
	priceInput.value = "";
	synopsisInput.value = "";
	numberOfPagesInput.value = "";
	apiSearchStatus.value = "";
	apicover.value = "";
}

function addBookToHTMLTable(bookDetails) {
	let image = bookDetails.cover
		? `<img src='images/uploads/${bookDetails.cover}' width='40px' alt='' />`
		: "No image";
	tableBody.innerHTML += `<tr
					class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
					<td scope="row" class="px-6 py-4">
                        ${image}
					</td >
					<th class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
					  ${bookDetails.title}
					</th>
					<td class="px-6 py-4">
					  ${bookDetails.author}
					</td>
					<td class="px-6 py-4">
					  ${bookDetails.ISBN}
					</td>
					<td class="px-6 py-4">
					  ${bookDetails.new}
					</td>
					<td class="px-6 py-4">
					  ${bookDetails.worn}
					</td>
					<td class="px-6 py-4 space-x-2">
					  <button type="button" btn-edit="${bookDetails._id}" class="bg-orange-100 transition text-orange-500 hover:text-white border border-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg p-1.5 text-center dark:border-orange-300 dark:text-orange-300 cursor-pointer dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900"><svg
                      xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg></button>
					<button type="button" btn-delete="${bookDetails._id}"
                    class="bg-orange-100 transition text-orange-500 hover:text-white border border-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg p-1.5 text-center dark:border-orange-300 dark:text-orange-300 cursor-pointer dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button type="button" btn-sell="${bookDetails._id}"
                    class="bg-orange-100 transition text-orange-500 hover:text-white border border-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg p-1.5 text-center dark:border-orange-300 dark:text-orange-300 cursor-pointer dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
					</td>
				  </tr >`;

	if (bookDetails.worn == 0 && bookDetails.new == 0) {
		document.querySelector(`[btn-sell="${bookDetails._id}"]`).disabled = true;
	}

	clearInputs();
	deleteButtonActions();
	sellButtonActions();
	editButtonActions();
}

async function setBookDataFromOpenLibrary() {
	try {
		let bookDetailsOpenLibrary = await fetch(
			`https://openlibrary.org/isbn/${ISBNInput.value}.json`
		).then((res) => res.json());

		titleInput.value = bookDetailsOpenLibrary?.title || "";
		numberOfPagesInput.value = bookDetailsOpenLibrary?.number_of_pages || "";
		editorInput.value = bookDetailsOpenLibrary?.publishers[0] || "";
		synopsisInput.value = bookDetailsOpenLibrary?.first_sentence?.value || "";
		launchDateInput.value = new Date(bookDetailsOpenLibrary?.publish_date)?.toDateString() || "";

		let bookAuthorDetails = await fetch(
			`https://openlibrary.org${bookDetailsOpenLibrary.authors[0].key}.json`
		).then((res) => res.json());
		console.log(bookDetailsOpenLibrary);
		console.log(bookAuthorDetails);

		authorInput.value = bookAuthorDetails?.personal_name || bookAuthorDetails?.name || "";

		apicover.value = `https://covers.openlibrary.org/b/isbn/${ISBNInput.value}-L.jpg`;
	} catch (err) {
		throw err;
	}
}

const apiSearchStatus = document.getElementById("apiSearchStatus");
apiSearchStatus.addEventListener("change", () => {
	if (apiSearchStatus.checked) {
		clearInputs();
		imageInput.disabled = true;
		ISBNInput.addEventListener("change", setBookDataFromOpenLibrary);
	} else {
		clearInputs();
		imageInput.disabled = false;
		ISBNInput.removeEventListener("change", setBookDataFromOpenLibrary);
	}
});

async function registerPurchase() {
	try {
		const userEmail = userPurchaseEmail.value == "" ? "EmptyEmail" : userPurchaseEmail.value;
		const purchaseData = {};

		let bookDetails = await getBookData(idSellBook.value);

		purchaseData.date = new Date();
		purchaseData.discount = 0;
		purchaseData.totalPrice = bookDetails.price;
		purchaseData.books = [];
		purchaseData.books[0] = {};
		purchaseData.books[0]._id = bookDetails._id;
		purchaseData.books[0].title = bookDetails.title;
		purchaseData.books[0].cover = bookDetails.cover;
		purchaseData.books[0].price = bookDetails.price;
		purchaseData.books[0].new = qtNewBooksInput.value;
		purchaseData.books[0].worn = qtWornBooksInput.value;

		console.log(purchaseData);

		let registerPurchaseResult = await fetch("api/v1/users/registerPurchase/" + userEmail, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(purchaseData),
		}).then((res) => res.json());

		if (registerPurchaseResult.errors) {
			showErrors(errorsSectionSellBook, registerPurchaseResult.errors);
			return;
		}

		const bookData = bookDetails;
		bookData.new = bookData.new - qtNewBooksInput.value;
		bookData.worn = bookData.worn - qtWornBooksInput.value;

		return await fetch(PREFIX + "edit/" + idSellBook.value, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(bookData),
		}).then((res) => res.json());
	} catch (err) {
		throw err;
	}
}

async function showSellingBookData(_id) {
	try {
		let bookDetails = await getBookData(_id);

		qtNewBooksInput.setAttribute("max", bookDetails.new);
		qtWornBooksInput.setAttribute("max", bookDetails.worn);

		bookCover.src = "images/uploads/" + bookDetails.cover;
		bookSynopsis.textContent = bookDetails.synopsis.substring(0, 370) + "...";
		bookTitle.textContent = bookDetails.title;
		bookAuthor.textContent = bookDetails.author;
		bookISBN.textContent = bookDetails.ISBN;
		bookEditor.textContent = bookDetails.editor;
		bookGenre.textContent = bookDetails.genre;
		bookLaunchDate.textContent = moment(bookDetails.launch_date).format("MM/DD/YYYY");
		bookNewQt.textContent = bookDetails.new;
		bookWornQt.textContent = bookDetails.worn;
		bookPrice.textContent = bookDetails.price;

		function calcTotalPrice(book) {
			let price =
				book.price * parseInt(qtNewBooksInput.value || 0) +
				(book.price - book.price * 0.25) * parseInt(qtWornBooksInput.value || 0);
			totalPrice.textContent = price;
		}
		calcTotalPrice(bookDetails);
		qtNewBooksInput.addEventListener("change", () => calcTotalPrice(bookDetails));
		qtWornBooksInput.addEventListener("change", () => calcTotalPrice(bookDetails));
		qtWornBooksInput.addEventListener("keyup", () => calcTotalPrice(bookDetails));
		qtNewBooksInput.addEventListener("keyup", () => calcTotalPrice(bookDetails));
	} catch (err) {
		throw err;
	}
}

function addBooksToHTMLTable(bookDetails) {
	tableBody.innerHTML = "";
	for (const element of bookDetails) {
		addBookToHTMLTable(element);
	}
}

async function reloadData() {
	try {
		let result = await searchBooks();
		tableBody.innerHTML = "";
		addBooksToHTMLTable(result.books);

		const { book, ...pageDetails } = result;
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
		//It's necessary to create a FormData since we want to pass a binary file (the image) to req.body
		let formData = new FormData();
		formData.append("title", titleInput.value);
		formData.append("author", authorInput.value);
		formData.append("ISBN", ISBNInput.value);
		formData.append("editor", editorInput.value);
		formData.append("genre", genreInput.value);
		formData.append("launch_date", launchDateInput.value);
		formData.append("new", newInput.value);
		formData.append("worn", wornInput.value);
		formData.append("number_of_pages", numberOfPagesInput.value);
		formData.append("price", priceInput.value);
		formData.append("synopsis", synopsisInput.value);
		formData.append("cover", imageInput.files[0]);
		if (apicover.value != "") {
			formData.append("apicover", apicover.value);
		}

		let result = null;
		let msg = "";
		if (modalTitle.textContent == "Create Book") {
			result = await storeBookData(formData);
			msg = "Book created successfully";
		} else {
			result = await updateBookData(formData, idSaveData.value);
			msg = "Book updated successfully";
		}

		if (result.errors) {
			showErrors(errorsSectionSaveData, result.errors);
		} else {
			showToast(msg, 3500);
			await reloadData();
			MicroModal.close("bookModal");
		}
	} catch (err) {
		console.log(err);
	}
});

const createBtn = document.getElementById("createBook");
createBtn.addEventListener("click", () => {
	MicroModal.show("bookModal");
	document.getElementById("apiSearchDiv").classList.remove("hidden");
	modalTitle.textContent = "Create Book";
	clearInputs();
});

const modalDeleteDataBtn = document.getElementById("deleteData");
modalDeleteDataBtn.addEventListener("click", async () => {
	try {
		await deleteBookData(idDeleteData.value, loggedUserId.value);
		await reloadData();
		MicroModal.close("deleteModal");
		showToast("Book deleted successfully", 3500);
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

function sellButtonActions() {
	const sellBtns = document.querySelectorAll("button[btn-sell]");
	for (const element of sellBtns) {
		element.addEventListener("click", () => {
			try {
				clearInputs();
				showSellingBookData(element.getAttribute("btn-sell"));
				idSellBook.value = element.getAttribute("btn-sell");
				MicroModal.show("sellBookModal");
			} catch (err) {}
		});
	}
}

const sellBookModalBtn = document.getElementById("sellBook");
sellBookModalBtn.addEventListener("click", async () => {
	try {
		let result = await registerPurchase();
		if (result) {
			await reloadData();
			MicroModal.close("sellBookModal");
			showToast("Purchase stored successfully", 3500);
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
				const bookDetails = await getBookData(element.getAttribute("btn-edit"));

				idSaveData.value = bookDetails._id;
				titleInput.value = bookDetails.title;
				authorInput.value = bookDetails.author;
				ISBNInput.value = bookDetails.ISBN;
				editorInput.value = bookDetails.editor;
				genreInput.value = bookDetails.genre;
				launchDateInput.value = moment(bookDetails.launch_date).format("MM/DD/YYYY");
				numberOfPagesInput.value = bookDetails.number_of_pages;
				newInput.value = bookDetails.new;
				wornInput.value = bookDetails.worn;
				priceInput.value = bookDetails.price;
				synopsisInput.value = bookDetails.synopsis;

				modalTitle.textContent = "Edit Book";
				document.getElementById("apiSearchDiv").classList.add("hidden");
				MicroModal.show("bookModal");
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
