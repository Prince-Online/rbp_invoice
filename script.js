let products = [];
let productCounter = 0;

function addProduct() {
    productCounter++;
    const productDiv = document.createElement('div');
    productDiv.className = 'product-item';
    productDiv.id = `product-${productCounter}`;
    
    productDiv.innerHTML = `
        <div class="product-inputs">
            <input type="text" placeholder="Product Name" class="product-name">
            <input type="number" placeholder="Qty" class="product-qty" value="1" min="1" onchange="updateProductTotal(${productCounter})">
            <input type="number" placeholder="Price" class="product-price" value="0" min="0" step="0.01" onchange="updateProductTotal(${productCounter})">
            <div class="product-total" id="total-${productCounter}">₹0.00</div>
            <button class="btn-remove" onclick="removeProduct(${productCounter})">Remove</button>
        </div>
    `;
    
    document.getElementById('productsList').appendChild(productDiv);
}

function updateProductTotal(id) {
    const productDiv = document.getElementById(`product-${id}`);
    const qty = parseFloat(productDiv.querySelector('.product-qty').value) || 0;
    const price = parseFloat(productDiv.querySelector('.product-price').value) || 0;
    const total = qty * price;
    document.getElementById(`total-${id}`).textContent = `₹${total.toFixed(2)}`;
}

function removeProduct(id) {
    const productDiv = document.getElementById(`product-${id}`);
    productDiv.remove();
}

function toggleTax() {
    const taxRow = document.getElementById('taxRow');
    const isChecked = document.getElementById('taxCheckbox').checked;
    taxRow.style.display = isChecked ? 'flex' : 'none';
}

function generateInvoice() {
    const customerName = document.getElementById('customerName').value;
    const customerAddress = document.getElementById('customerAddress').value;
    
    if (!customerName || !customerAddress) {
        alert('Please fill in customer name and address');
        return;
    }
    
    const productItems = document.querySelectorAll('.product-item');
    if (productItems.length === 0) {
        alert('Please add at least one product');
        return;
    }
    
    products = [];
    productItems.forEach((item, index) => {
        const name = item.querySelector('.product-name').value;
        const qty = parseFloat(item.querySelector('.product-qty').value) || 0;
        const price = parseFloat(item.querySelector('.product-price').value) || 0;
        
        if (name && qty > 0 && price >= 0) {
            products.push({
                sno: index + 1,
                name: name,
                qty: qty,
                price: price,
                total: qty * price
            });
        }
    });
    
    if (products.length === 0) {
        alert('Please fill in all product details');
        return;
    }
    
    document.getElementById('shopLogo').src = SHOP_CONFIG.logoUrl;
    document.getElementById('shopName').textContent = SHOP_CONFIG.name;
    document.getElementById('invoiceCustomerName').textContent = customerName;
    document.getElementById('invoiceCustomerAddress').textContent = customerAddress;
    
    const invoiceNum = 'INV-' + Date.now().toString().slice(-8);
    document.getElementById('invoiceNumber').textContent = invoiceNum;
    
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('invoiceDate').textContent = dateStr;
    
    const productsListHTML = products.map(p => `
        <tr>
            <td>${p.sno}</td>
            <td>${p.name}</td>
            <td>${p.qty}</td>
            <td>₹${p.price.toFixed(2)}</td>
            <td>₹${p.total.toFixed(2)}</td>
        </tr>
    `).join('');
    document.getElementById('invoiceProductsList').innerHTML = productsListHTML;
    
    const subtotal = products.reduce((sum, p) => sum + p.total, 0);
    document.getElementById('invoiceSubtotal').textContent = `₹${subtotal.toFixed(2)}`;
    
    const taxEnabled = document.getElementById('taxCheckbox').checked;
    let total = subtotal;
    
    if (taxEnabled) {
        const tax = subtotal * 0.18;
        document.getElementById('invoiceTax').textContent = `₹${tax.toFixed(2)}`;
        total = subtotal + tax;
        document.getElementById('taxRow').style.display = 'flex';
    } else {
        document.getElementById('taxRow').style.display = 'none';
    }
    
    document.getElementById('invoiceTotal').textContent = `₹${total.toFixed(2)}`;
    
    document.querySelector('.form-section').style.display = 'none';
    document.getElementById('invoiceDisplay').style.display = 'block';
}

async function downloadInvoice() {
    const invoiceContent = document.getElementById('invoiceContent');
    
    const originalWidth = invoiceContent.style.width;
    invoiceContent.style.width = '794px';
    
    const canvas = await html2canvas(invoiceContent, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 794,
        windowWidth: 794
    });
    
    invoiceContent.style.width = originalWidth;
    
    const imgData = canvas.toDataURL('image/jpeg', 0.7);
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, '', 'FAST');
    
    const invoiceNum = document.getElementById('invoiceNumber').textContent;
    pdf.save(`Invoice-${invoiceNum}.pdf`);
}

function newInvoice() {
    document.getElementById('customerName').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('productsList').innerHTML = '';
    document.getElementById('taxCheckbox').checked = false;
    productCounter = 0;
    products = [];
    
    document.querySelector('.form-section').style.display = 'block';
    document.getElementById('invoiceDisplay').style.display = 'none';
}

addProduct();
