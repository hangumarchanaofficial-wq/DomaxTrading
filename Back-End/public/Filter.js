function toggleSection(title){
    const content = title.nextElementSibling;
    const isOpen = content.style.display === 'flex';
    content.style.display = isOpen ? 'none' : 'flex';
}

function toggleRotate(IMG){
    IMG.classList.toggle('arrow-up');

}
Filter =document.querySelectorAll('.filter-title')

Filter.forEach(item =>{
        item.addEventListener('click', function(){
            IMG = this.querySelector('img');
            IMG.classList.toggle('arrow-up');
        })
    }


)


document.addEventListener("DOMContentLoaded", function () {
    const selectedFiltersContainer = document.getElementById('selected-filters-container');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const colorCircles = document.querySelectorAll('.color-circle');
    const checkboxes = document.querySelectorAll('#FilterSlider input[type="checkbox"]');
    const appliedFilterBox = document.getElementById('applied-filters');
    const clearAllBtn = document.getElementById('clearAllBtn');



    appliedFilterBox.style.display = 'none';

    function updateFilterVisibility() {
        if (selectedFiltersContainer.children.length === 0) {
            appliedFilterBox.style.display = 'none';


        } else {
            appliedFilterBox.style.display = 'flex'; // or 'block'
        }
    }

    // ---------- Handle Checkbox Filters ----------
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const label = this.parentElement.textContent.trim();

            if (this.checked) {
                const tag = document.createElement('span');
                tag.className = 'filter-tag';
                tag.textContent = label;

                const removeBtn = document.createElement('span');
                removeBtn.textContent = " ×";
                removeBtn.style.cursor = 'pointer';
                removeBtn.onclick = () => {
                    this.checked = false;
                    tag.remove();
                    updateFilterVisibility();
                    applyFilters();
                };

                tag.appendChild(removeBtn);
                selectedFiltersContainer.appendChild(tag);
            } else {
                document.querySelectorAll('.filter-tag').forEach(tag => {
                    if (tag.textContent.trim().startsWith(label)) {
                        tag.remove();
                    }
                });
            }
            updateFilterVisibility();
            applyFilters();
        });
    });


    colorCircles.forEach(circle => {
        circle.addEventListener('click', function () {
            const colorName = this.dataset.color;
            const alreadySelected = this.classList.contains('selected');

            if (!alreadySelected) {
                this.classList.add('selected');

                const tag = document.createElement('span');
                tag.className = 'filter-tag';
                tag.textContent = colorName;

                const removeBtn = document.createElement('span');
                removeBtn.textContent = ' ×';
                removeBtn.style.cursor = 'pointer';
                removeBtn.onclick = () => {
                    this.classList.remove('selected');
                    tag.remove();
                    updateFilterVisibility();
                };

                tag.appendChild(removeBtn);
                selectedFiltersContainer.appendChild(tag);
            } else {
                this.classList.remove('selected');
                document.querySelectorAll('.filter-tag').forEach(tag => {
                    if (tag.textContent.trim().startsWith(colorName)) {
                        tag.remove();
                    }
                });
            }
            updateFilterVisibility();
            applyFilters();
        });
    });


    clearFiltersBtn.addEventListener('click', function (e) {
        e.preventDefault();
        checkboxes.forEach(cb => cb.checked = false);
        colorCircles.forEach(c => c.classList.remove('selected'));
        selectedFiltersContainer.innerHTML = '';
        updateFilterVisibility();
        applyFilters();
    });
    clearAllBtn.addEventListener('click', function (e) {
        e.preventDefault();
        checkboxes.forEach(cb => cb.checked = false);
        colorCircles.forEach(c => c.classList.remove('selected'));
        selectedFiltersContainer.innerHTML = '';
        updateFilterVisibility();
        applyFilters();
        const productErrorBox = document.querySelector('.product-error-box');
        productErrorBox.style.display = 'none';

    })

});



function renderProducts(filteredItems) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    const itemCount = document.getElementById('itemCount');
    const endDIV = document.getElementById('endDIV');

    if (filteredItems.length === 0) {
        const productErrorBox = document.querySelector('.product-error-box');
        productErrorBox.style.display = 'flex';
        const footer = document.getElementById('footer');
        footer.classList.add('footerActive')
        const mobileFilterBtn = document.getElementById('mobileFilterBtn');
        mobileFilterBtn.style.display = 'none';
        itemCount.innerText = `0 Items`;
        endDIV.style.setProperty(
            'display',
            'none',
            'important'
        )

        return;



    }
    else{
        const productErrorBox = document.querySelector('.product-error-box');
        productErrorBox.style.display = 'none';
        const mobileFilterBtn = document.getElementById('mobileFilterBtn');
        mobileFilterBtn.style.display = 'block';
        const footer = document.getElementById('footer');
        footer.classList.remove('footerActive')
        endDIV.style.setProperty(
            'display',
            'flex',
            'important'
        )
    }



    const row = document.createElement('div');
    row.className = 'row';

    filteredItems.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-xl-4 mb-4';




        const productCard = document.createElement('div');
        productCard.className = 'card product-card shadow-lg';

        productCard.innerHTML = `
            <div class="product-img-container">
                <img src="${product.IMG}" class="product-img w-100 h-100 object-fit-cover " alt="${product.Name}" />
            </div>
            <div class="card-body1">
                <h5 class="card-title productName">${product.Name}</h5>
                <a href="ProductDetails.html?id=${product.Id}" class="btn btn-outline-dark BuyButton">View More</a>

                
            </div>
        `;

        col.appendChild(productCard);
        row.appendChild(col);
    });


    productList.appendChild(row);

    itemCount.innerText = `${filteredItems.length} Items`;
}

function applyFilters() {
    const selectedColors = Array.from(document.querySelectorAll('.color-circle.selected'))
        .map(c => c.dataset.color.toLowerCase());

    const selectedSubTypes = Array.from(document.querySelectorAll('#FilterSlider input[name="shape"]:checked'))
        .map(cb => cb.parentElement.textContent.trim().toLowerCase());
    const selectedCategoryTypes = Array.from(document.querySelectorAll('#FilterSlider input[name="category"]:checked'))
        .map(cb => cb.parentElement.textContent.trim().toLowerCase());
    const selectedStyleTypes = Array.from(document.querySelectorAll('#FilterSlider input[name="style"]:checked'))
        .map(cb => cb.parentElement.textContent.trim().toLowerCase());
    const filtered = database.filter(item => {
        const matchesColor = selectedColors.length === 0 || selectedColors.includes(item.Color.toLowerCase());
        const matchesSub = selectedSubTypes.length === 0 || selectedSubTypes.includes(item.Sub.toLowerCase());
        const matchesCategory = selectedCategoryTypes.length === 0 || selectedCategoryTypes.includes(item.Category.toLowerCase());
        const matchesStyle = selectedStyleTypes.length === 0 || selectedStyleTypes.includes(item.Style.toLowerCase());


        return matchesColor && matchesSub && matchesCategory && matchesStyle;
    });

    console.log(filtered);
    renderProducts(filtered);

}
let database1;
async function dataLoader(){
    try{
        const response = await fetch('Data.json');
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        database1 = await  response.json();
    }
    catch (error){
        console.log(error);
    }
    console.log(database1);
    renderProducts(database1);

}
dataLoader();

const mobileFilterBtn = document.getElementById('mobileFilterBtn');

mobileFilterBtn.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent the document click event from firing
    const filterSlider = document.getElementById('FilterSlider');
    filterSlider.classList.toggle('active');
});

document.addEventListener('click', function (event) {
    const filterSlider = document.getElementById('FilterSlider');


    if (!filterSlider.contains(event.target) && event.target !== mobileFilterBtn) {
        filterSlider.classList.remove('active');
    }
});

const backToTopBtn = document.getElementById("backToTop");


window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        backToTopBtn.classList.add("showTopDiv");
    } else {
        backToTopBtn.classList.remove("showTopDiv");
    }
});


backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

