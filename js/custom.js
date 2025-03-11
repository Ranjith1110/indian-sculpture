(function () {
	'use strict';

	var tinyslider = function () {
		var el = document.querySelectorAll('.testimonial-slider');

		if (el.length > 0) {
			var slider = tns({
				container: '.testimonial-slider',
				items: 1,
				axis: "horizontal",
				controlsContainer: "#testimonial-nav",
				swipeAngle: false,
				speed: 700,
				nav: true,
				controls: true,
				autoplay: true,
				autoplayHoverPause: true,
				autoplayTimeout: 3500,
				autoplayButtonOutput: false
			});
		}
	};
	tinyslider();




	var sitePlusMinus = function () {

		var value,
			quantity = document.getElementsByClassName('quantity-container');

		function createBindings(quantityContainer) {
			var quantityAmount = quantityContainer.getElementsByClassName('quantity-amount')[0];
			var increase = quantityContainer.getElementsByClassName('increase')[0];
			var decrease = quantityContainer.getElementsByClassName('decrease')[0];
			increase.addEventListener('click', function (e) { increaseValue(e, quantityAmount); });
			decrease.addEventListener('click', function (e) { decreaseValue(e, quantityAmount); });
		}

		function init() {
			for (var i = 0; i < quantity.length; i++) {
				createBindings(quantity[i]);
			}
		};

		function increaseValue(event, quantityAmount) {
			value = parseInt(quantityAmount.value, 10);

			console.log(quantityAmount, quantityAmount.value);

			value = isNaN(value) ? 0 : value;
			value++;
			quantityAmount.value = value;
		}

		function decreaseValue(event, quantityAmount) {
			value = parseInt(quantityAmount.value, 10);

			value = isNaN(value) ? 0 : value;
			if (value > 0) value--;

			quantityAmount.value = value;
		}

		init();

	};
	sitePlusMinus();


})()

// Function to Load Cart from Local Storage
function loadCart() {
	let cart = JSON.parse(localStorage.getItem('cart')) || [];
	let cartContainer = document.getElementById('cart-items');
	let grandTotalElement = document.getElementById('grand-total');
	let grandTotal = 0;

	if (cart.length === 0) {
		cartContainer.innerHTML = "<tr><td colspan='6'>Your cart is empty.</td></tr>";
		grandTotalElement.innerText = "₹0.00";
		return;
	}

	cartContainer.innerHTML = ""; // Clear table before adding items

	cart.forEach((item, index) => {
		let quantity = item.quantity || 1; // Default quantity = 1
		let totalPrice = parseFloat(item.price.replace("₹", "")) * quantity;
		grandTotal += totalPrice; // Add to grand total

		let row = document.createElement('tr');
		row.innerHTML = `
            <td><img src="${item.image}" alt="${item.title}" width="50"></td>
            <td>${item.title}</td>
            <td>${item.price}</td>
            <td class="quantity">
                <button onclick="updateQuantity(${index}, -1)">-</button>
                <input type="text" value="${quantity}" readonly>
                <button onclick="updateQuantity(${index}, 1)">+</button>
            </td>
            <td class="total-price">₹${totalPrice.toFixed(2)}</td>
            <td><button class="remove-btn" onclick="removeFromCart(${index})">x</button></td>
        `;
		cartContainer.appendChild(row);
	});

	// Update Grand Total
	grandTotalElement.innerText = `₹${grandTotal.toFixed(2)}`;
}

// Function to Add Product to Cart
function addToCart(event) {
	event.preventDefault();
	let productElement = event.target.closest('.product-item');

	let product = {
		image: productElement.querySelector("img").src,
		title: productElement.querySelector(".product-title").innerText,
		price: productElement.querySelector(".product-price").innerText.replace("$", "₹"),
		quantity: 1
	};

	let cart = JSON.parse(localStorage.getItem('cart')) || [];

	let existingProduct = cart.find(item => item.title === product.title);
	if (existingProduct) {
		existingProduct.quantity += 1;
		alert(`${product.title} quantity updated in cart 🛒`);
	} else {
		cart.push(product);
		alert(`${product.title} added to cart 🛒`);
	}

	localStorage.setItem('cart', JSON.stringify(cart));
	loadCart();
}

// Function to Update Quantity
function updateQuantity(index, change) {
	let cart = JSON.parse(localStorage.getItem('cart')) || [];

	cart[index].quantity = Math.max(1, (cart[index].quantity || 1) + change);
	localStorage.setItem('cart', JSON.stringify(cart));

	loadCart();
}

// Function to Remove Item from Cart
function removeFromCart(index) {
	let cart = JSON.parse(localStorage.getItem("cart")) || [];
	if (cart.length > index) {
		let removedProduct = cart[index].title; // Get the product title before removing
		cart.splice(index, 1);
		localStorage.setItem("cart", JSON.stringify(cart));
		alert(`${removedProduct} removed from cart ❌`);
	} else {
		alert("Invalid product selection ❌");
	}
	loadCart();
}

let countdown; // Global variable for countdown timer

function showQRCode() {
	let grandTotalElement = document.getElementById('grand-total');
	let grandTotal = parseFloat(grandTotalElement.innerText.replace("₹", "")) || 0;

	if (grandTotal <= 0) {
		alert("Cart is empty. Please add items before paying.");
		return;
	}

	let upiID = "pinkyprithiv6@okhdfcbank";
	let upiURL = `upi://pay?pa=${upiID}&pn=YourStore&tr=TXN${Date.now()}&tn=Payment&am=${grandTotal}&cu=INR`;

	let qrCodeURL = `https://quickchart.io/qr?text=${encodeURIComponent(upiURL)}&size=500`;

	let qrCodeImage = document.getElementById("qr-code");
	qrCodeImage.src = qrCodeURL;

	document.getElementById("qr-container").style.display = "block";
	document.getElementById("payment-confirmation").style.display = "block";
	document.getElementById("payment-form").style.display = "block";

	alert("Scan the QR code with any UPI app to complete the payment.");

	startCountdown(240); // Start 4-minute countdown
}

// Function to Start the Countdown
function startCountdown(seconds) {
	let counterElement = document.getElementById("countdown-timer");
	counterElement.innerText = `Time left: ${seconds}s`;

	clearInterval(countdown); // Clear any existing timer

	countdown = setInterval(() => {
		seconds--;
		counterElement.innerText = `Time left: ${seconds}s`;

		if (seconds <= 0) {
			clearInterval(countdown);
			document.getElementById("qr-container").style.display = "none";
			alert("Time expired! If payment is completed, thank you. If not, please try again.");
		}
	}, 1000);
}


// Function to Close QR Code Manually
function closeQRCode() {
	clearInterval(countdown);
	document.getElementById("qr-container").style.display = "none";
	document.getElementById("payment-confirmation").style.display = "none";
	document.getElementById("payment-form").style.display = "none";
	alert("Payment confirmed! Thank you.");
}


// Function to Remove QR Code
function hideQRCode() {
	document.getElementById("qr-container").style.display = "none";
	document.getElementById("payment-confirmation").style.display = "none";
	document.getElementById("payment-form").style.display = "none";
}


function sendToWhatsApp() {
	const name = document.getElementById("name").value;
	const phone = document.getElementById("phone").value;
	const address = document.getElementById("address").value;
	const orderThings = document.getElementById("order-things").value;
	const description = document.getElementById("description").value;

	if (name && phone && address) {
		const message = `Payment Details:\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nOrder: ${orderThings}\nDescription: ${description}`;
		const whatsappURL = `https://wa.me/+918056438344?text=${encodeURIComponent(message)}`;
		window.open(whatsappURL, "_blank");
	} else {
		alert("Please fill all required fields!");
	}
}

function updateProductDetails(selectElement) {
	// Get the selected option
	var selectedOption = selectElement.options[selectElement.selectedIndex];

	// Get the selected price and size
	var selectedPrice = selectedOption.value;
	var selectedSize = selectedOption.getAttribute("data-size");

	// Find the closest product container
	var productItem = selectElement.closest(".product-item");

	// Find the product title element
	var productTitleElement = productItem.querySelector(".product-title");

	// Get the original product title (without size)
	var originalTitle = productTitleElement.getAttribute("data-original-title");
	if (!originalTitle) {
		originalTitle = productTitleElement.textContent;
		productTitleElement.setAttribute("data-original-title", originalTitle); // Store original title
	}

	// Update product title with selected size
	productTitleElement.textContent = originalTitle + ", " + selectedSize;

	// Update product price
	var productPriceElement = productItem.querySelector(".product-price");
	productPriceElement.textContent = "₹" + selectedPrice;
}


// Load Cart on Page Load
window.onload = loadCart;


