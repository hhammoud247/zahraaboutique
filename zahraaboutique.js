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
    productForm.addEventListener('submit', async function (event) {
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

        // Save product to MySQL via API
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (response.ok) {
                alert('Product added successfully!');
                productForm.reset();
                imagePreview.style.display = 'none';
            } else {
                const error = await response.json();
                alert(`Failed to add product: ${error.message}`);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('An error occurred while saving the product.');
        }
    });
}

// Load products into the clothes section (only for the Clothes page)
async function loadProductsIntoClothesSection(itemContainer) {
    try {
        const response = await fetch('/api/products');
        if (response.ok) {
            const products = await response.json();
            products.forEach(product => {
                const itemCard = createItemCard(product);
                itemContainer.appendChild(itemCard);
            });
        } else {
            console.error('Failed to fetch products.');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
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
    // Clear the products from the database via API
    fetch('/api/products', { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                if (itemContainer) {
                    itemContainer.innerHTML = ''; // Clears the container
                }
                alert('All products have been removed!');
            } else {
                alert('Failed to reset products.');
            }
        })
        .catch(error => {
            console.error('Error resetting products:', error);
        });
}

function open_html(filepath) {
    window.open(filepath, '_blank');
}
