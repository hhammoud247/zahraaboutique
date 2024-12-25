// Declare itemContainer for Clothes Page only
let itemContainer;

document.addEventListener('DOMContentLoaded', function () {
    // Check if we are on the "Clothes" page (by checking if the itemContainer exists)
    itemContainer = document.getElementById('product-container');
    
    // Only load products if we are on the "Clothes" page (itemContainer exists)
    if (itemContainer) {
        loadProductsIntoClothesSection(itemContainer);
    } else {
        console.log("Item container not found on this page. This is expected on Manager page.");
    }
});

// Handling form submission in Manager page (productForm)
const productForm = document.getElementById('productForm');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');

// Image Upload Event Listener
if (imageUpload) {
    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';  // Show the preview
            };
            reader.readAsDataURL(file);
        }
    });
}

if (productForm) {
    productForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const price = document.getElementById('price').value;
        const size = document.getElementById('size').value;
        const imageSrc = document.getElementById('imagePreview').src;

        // Validate fields
        if (!title || !price || !size || !imageSrc || imageSrc === '') {
            alert('Please fill out all fields and upload an image!');
            return;
        }

        const product = {
            title,
            price,
            size,
            image: imageSrc
        };

        // Save product to local storage
        saveProductToLocalStorage(product);

        // Reset form and hide image preview
        productForm.reset();
        document.getElementById('imagePreview').style.display = 'none';
        alert('Product added successfully!');
    });
}

// Save product to localStorage
function saveProductToLocalStorage(product) {
    const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
    existingProducts.push(product);
    localStorage.setItem('products', JSON.stringify(existingProducts));
}

// Load products into the clothes section (only for the Clothes page)
function loadProductsIntoClothesSection(itemContainer) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach(product => {
        const itemCard = createItemCard(product);
        itemContainer.appendChild(itemCard);
    });
}

// Create the HTML for each product card
function createItemCard(product) {
    const itemCard = document.createElement('div');
    itemCard.classList.add('product-container');
    itemCard.innerHTML = `
        <img class="product-image" src="${product.image}" alt="${product.title}">
        <div class="product-title-input">
            <input type="text" class="product-title-input" value="${product.title}" readonly />
        </div>
        <div class="product-title-input">
            <span>Price:</span>
            <input type="text" class="product-title-input" value="$${product.price}" readonly />
        </div>
        <div class="product-controls">
            <div class="quantity-input">
                <span>Quantity:</span>
                <input type="number" min="1" value="1">
            </div>
            <select class="dropdown">
                <option value="" disabled selected>Select Size</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">Extra Large</option>
            </select>
            <button class="add-to-cart-button">
                <img src="./clothes/cart-icon.png" class="cart-icon" alt="Add to Cart">
            </button>
        </div>
    `;
    return itemCard;
}
function reset_button() {
    // Clear the products from localStorage
    localStorage.removeItem('products');

    // Remove all item cards from the clothes section
    if (itemContainer) {
        itemContainer.innerHTML = ''; // Clears the container
    }

    alert('All products have been removed and localStorage has been reset!');
}
function open_html(filepath){
    window.open(filepath,'_blank');
}