// Fetch categories data for display buttons
const loadCategories = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/peddy/categories"
  );
  const data = await res.json();
  displayCategories(data.categories);
};

// display categories buttons
const displayCategories = (categories) => {
  const categoriesBtnContainer = document.getElementById(
    "categories-btn-container"
  );

  categories.forEach((category) => {
    const div = document.createElement("div");

    div.innerHTML = `
        <button id="btn-${category.category}" onclick="loadPetsByCategory('${category.category}')" class="category-btn border-2 rounded-2xl w-full flex items-center justify-center py-2 space-x-4 hover:bg-primary hover:bg-opacity-10 duration-300 ease-in-out">
                    <div class="max-w-9">
                        <img class="w-full object-cover" src=${category.category_icon} />
                    </div>
                    <div class="font-Inter font-bold lg:text-xl">${category.category}</div>
        </button>
        `;
    categoriesBtnContainer.append(div);
  });
};

// removing active class form buttons
const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");

  for (let button of buttons) {
    button.classList.remove("active");
    button.classList.add("rounded-2xl");
  }
};

// load pets by category function on clicking category buttons
const loadPetsByCategory = (id) => {
  loadPetsCategorywise(id);
  removeActiveClass();

  const activeBtn = document.getElementById(`btn-${id}`);
  activeBtn.classList.remove("rounded-2xl");
  activeBtn.classList.add("active");
};

// fetch data using category when called from loadPetsByCategory function
const loadPetsCategorywise = async (category) => {
  const loadingSpinner = document.getElementById("loading-spinner");
  const petsContainer = document.getElementById("pets-container");
  loadingSpinner.style.display = "flex";
  petsContainer.classList.add("hidden");

  const res = await fetch(
    `https://openapi.programming-hero.com/api/peddy/category/${category}`
  );
  const data = await res.json();

  await new Promise((resolve) => setTimeout(resolve, 2000));
  loadingSpinner.style.display = "none";
  petsContainer.classList.remove("hidden");

  displayPets(data.data);

  document
    .getElementById("sort-button")
    .addEventListener("click", () => sortPrice(data.data));
};

// Fetch All Pets
const loadAllCategories = async () => {
  const loadingSpinner = document.getElementById("loading-spinner");
  const petsContainer = document.getElementById("pets-container");
  loadingSpinner.style.display = "flex";
  petsContainer.classList.add("hidden");

  const res = await fetch(
    "https://openapi.programming-hero.com/api/peddy/pets"
  );
  const data = await res.json();

  await new Promise((resolve) => setTimeout(resolve, 3000));
  loadingSpinner.style.display = "none";
  petsContainer.classList.remove("hidden");

  // data to display
  displayPets(data.pets);

  // sending data for sorting
  document
    .getElementById("sort-button")
    .addEventListener("click", () => sortPrice(data.pets));
};

// display pet cards
const displayPets = (pets) => {
  const petsContainer = document.getElementById("pets-container");

  petsContainer.innerHTML = "";

  if (pets.length == 0) {
    petsContainer.classList.remove("grid");
    petsContainer.innerHTML = `
        <div class="bg-[#F8F8F8] rounded-xl w-full py-8 lg:py-24 flex items-center flex-col justify-center gap-5 text-center">
            <div class="lg:mb-8"><img src="images/error.webp"/></div>
            <h1 class="text-Inter font-bold text-2xl lg:text-4xl">No Information Available</h1>
            <p class="text-dark">Sorry, the category you are looking for is currently unavailable.</p>
        </div>
    `;
    return;
  } else {
    petsContainer.classList.add("grid");
    pets.forEach((pet) => {
      const div = document.createElement("div");
      div.classList =
        "w-full border border-[#E7E7E7] p-5 rounded-xl flex flex-col justify-between";
      div.innerHTML = `
                            <div class="w-full h-40 mb-6">
                                <!-- img -->
                                <img class="w-full h-full rounded-lg object-cover" src=${
                                  pet.image
                                } alt="">
                            </div>
                            <div class="space-y-2 pb-2 border-b mb-4">
                                <h1 class="text-xl font-bold">${
                                  pet.pet_name
                                }</h1>
                                <p class="text-dark space-x-1">
                                    <i class="fa-regular fa-rectangle-list"></i>
                                    <span>Breed: ${
                                      pet.breed ? `${pet.breed}` : "No records"
                                    }</span>
                                </p>
                                <p class="text-dark space-x-1">
                                    <i class="fa-regular fa-calendar"></i>
                                    <span>Birth: ${
                                      pet.date_of_birth
                                        ? `${pet.date_of_birth}`
                                        : "No records"
                                    }
                                     </span>
                                </p>
                                <p class="text-dark space-x-1">
                                    <i class="fa-solid fa-mercury"></i>
                                    <span>Gender: ${
                                      pet.gender
                                        ? `${pet.gender}`
                                        : "No records"
                                    }</span>
                                </p>
                                <p class="text-dark space-x-1">
                                    <i class="fa-solid fa-dollar-sign"></i>
                                    <span>Price : $${
                                      pet.price ? `${pet.price}` : "No records"
                                    }</span>
                                </p>
                            </div>
                            <!-- buttons container -->
                            <div class="flex flex-wrap gap-3">

                                <button id="like-btn-${
                                  pet.petId
                                }" onclick="selectPetDisplay('${pet.image}', '${
        pet.petId
      }')" class="btn py-4 px-2 bg-white"><i class="fa-regular fa-thumbs-up"></i></button>

                                <button id="adopt-btn-${
                                  pet.petId
                                }" onclick="adoptModal('${
        pet.petId
      }')" class="btn py-4 px-2 bg-white text-primary font-extrabold">Adopt</button>

                                <button onclick="loadDetails('${
                                  pet.petId
                                }')" class="btn py-4 px-2 bg-white text-primary font-extrabold">Details</button>
        
                            </div>
        `;
      petsContainer.append(div);
    });
  }
};

// load details when clicked on Details button
const loadDetails = async (petId) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
  );
  const data = await res.json();
  displayDetailsModal(data.petData);
};

// display details in Modal
const displayDetailsModal = (petData) => {
  const modalContentContainer = document.getElementById(
    "modal-content-container"
  );
  modalContentContainer.innerHTML = `
                        <div class="mb-6 w-full">
                            <img class="w-full rounded-xl" src=${
                              petData.image
                            } alt="">
                        </div>
                        <h1 class="text-xl font-bold mb-4">${
                          petData.pet_name
                        }</h1>

                        <div class="grid grid-cols-2 py-4 border-b">
                            <p class="text-dark space-x-1">
                                <i class="fa-regular fa-rectangle-list"></i>
                                <span>Breed: ${
                                  petData.breed
                                    ? `${petData.breed}`
                                    : "No records"
                                }</span>
                            </p>
                            <p class="text-dark space-x-1">
                                <i class="fa-regular fa-calendar"></i>
                                <span>Birth: ${
                                  petData.date_of_birth
                                    ? `${petData.date_of_birth}`
                                    : "No records"
                                }
                                </span>
                            </p>
                            <p class="text-dark space-x-1">
                                <i class="fa-solid fa-mercury"></i>
                                <span>Gender: ${
                                  petData.gender
                                    ? `${petData.gender}`
                                    : "No records"
                                }</span>
                            </p>
                            <p class="text-dark space-x-1">
                                <i class="fa-solid fa-dollar-sign"></i>
                                <span>Price : $${
                                  petData.price
                                    ? `${petData.price}`
                                    : "No records"
                                }</span>
                            </p>
                            <p class="text-dark space-x-1">
                                <i class="fa-solid fa-syringe"></i>
                                <span>Vacinated status : ${
                                  petData.vaccinated_status
                                    ? `${petData.vaccinated_status}`
                                    : "No records"
                                }</span>
                            </p>
                        </div>
                        <h1 class="text-lg font-bold my-4">Details Information</h1>
                        <p class="text-dark">
                            ${petData.pet_details}
                        </p>
                   
  `;
  document.getElementById("showModalDetails").click();
};

// display liked photos
const selectPetDisplay = (item, id) => {
  const photoContainer = document.getElementById("selected-photos-container");
  const div = document.createElement("div");
  div.classList = "w-full md:h-32 ";
  div.innerHTML = `
        <img class="w-full h-full rounded-xl object-cover" src=${item} alt="">
    `;
  photoContainer.append(div);

  const likeBtn = document.getElementById(`like-btn-${id}`);
  likeBtn.classList.remove("bg-white");
  likeBtn.classList.add("bg-primary", "text-white");
};

// sorting function
function sortPrice(pets) {
  petsSorted = pets.sort((a, b) => {
    if (b.price < a.price) {
      return -1;
    }
  });
  displayPets(petsSorted);
}

// adopt modal functions
const adoptModal = (id) => {
  const countdownText = document.getElementById("adopt-content-container");

  let countdown = 3;
  countdownText.innerText = `${countdown}`;

  const countdownInterval = setInterval(() => {
    countdown--;
    countdownText.textContent = `${countdown}`;

    if (countdown === 0) {
      clearInterval(countdownInterval);
      document.getElementById("close").click();
    }
  }, 1000);

  document.getElementById("showAdoptModal").click();

  const adoptBtn = document.getElementById(`adopt-btn-${id}`);
  adoptBtn.innerText = "Adopted";

  adoptBtn.disabled = true;  
};

// calling functions
loadCategories();
loadAllCategories();
