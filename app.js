const cafeList = document.querySelector("#cafe-list");
const addCafeForm = document.querySelector("#add-cafe-form");

// Create Elements and Render to dom
const renderCafe = doc => {
	const li = document.createElement("li");
	const name = document.createElement("span");
	const city = document.createElement("span");
	const cross = document.createElement("div");

	li.setAttribute("data-id", doc.id);
	name.textContent = doc.data().name;
	city.textContent = doc.data().city;
	cross.textContent = "x";

	li.appendChild(name);
	li.appendChild(city);
	li.appendChild(cross);

	cafeList.appendChild(li);

	// Deleting Data
	cross.addEventListener("click", e => {
		e.stopPropagation();
		const id = e.target.parentElement.getAttribute("data-id");

		db.collection("cafes")
			.doc(id)
			.delete();
		// Update and set are also done in a similar fashion
	});
};

// Getting Data
// The where method, allows us to define specific attributes about the documents being fetched. Here, the first element is the attribute being referenced, the second is the comparison operator and the last element is the value it should match
// orderBy allows us to order the results based on the rules defined. Please note that in firebase, small caps always come last alphabetically.
// db.collection("cafes")
// 	// .where("city", ">", "n")
// 	.orderBy("city")
// 	.get()
// 	.then(snapshot => {
// 		snapshot.docs.forEach(doc => {
// 			renderCafe(doc);
// 		});
// 	});

// Realtime Data and Updates
db.collection("cafes")
	.orderBy("city")
	.onSnapshot(snapShot => {
		const changes = snapShot.docChanges();
		changes.forEach(change => {
			if (change.type === "added") {
				renderCafe(change.doc);
			} else if (change.type === "removed") {
				const li = cafeList.querySelector(`[data-id=${change.doc.id}]`);
				cafeList.removeChild(li);
			}
		});
	});

// Saving Data
addCafeForm.addEventListener("submit", e => {
	e.preventDefault();

	db.collection("cafes").add({
		name: addCafeForm.name.value,
		city: addCafeForm.city.value
	});

	addCafeForm.name.value = "";
	addCafeForm.city.value = "";
});

// Deleting Data
