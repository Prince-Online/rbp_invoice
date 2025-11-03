function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const uniqueID = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${year}${month}${day}-${uniqueID}`;
}

const productRowsContainer = document.getElementById('product-rows');
const inputForm = document.getElementById('input-form');
const invoiceContainer = document.getElementById('invoice-container');
const downloadBtnWrapper = document.getElementById('download-btn-wrapper');

window.onload = () => {
    addProductRow();
    document.getElementById('shopLogo').src = SHOP_CONFIG.LOGO_URL;
    document.getElementById('shopNameDisplay').textContent = SHOP_CONFIG.SHOP_NAME;
    document.getElementById('shopSignatureName').textContent = SHOP_CONFIG.SHOP_NAME;
};

function calculateTotals() {
    let subtotal = 0;
    const productRows = productRowsContainer.querySelectorAll('.product-row');
    productRows.forEach(row => {
        const qtyInput = row.querySelector('.product-qty');
        const priceInput = row.querySelector('.product-price');
        const totalDisplay = row.querySelector('.product-row-total');
        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const rowTotal = qty * price;
        totalDisplay.textContent = rowTotal.toFixed(2);
        subtotal += rowTotal;
    });
    const grandTotal = subtotal;
    document.getElementById('invoiceSubtotal').textContent = '₹' + subtotal.toFixed(2);
    document.getElementById('invoiceGrandTotal').textContent = '₹' + grandTotal.toFixed(2);
}

function addProductRow() {
    const rowCount = productRowsContainer.children.length + 1;
    const row = document.createElement('div');
    row.className = 'product-row grid grid-cols-4 md:grid-cols-7 gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-200';
    row.innerHTML = `
        <div class="col-span-4 md:col-span-3">
            <input type="text" placeholder="Product Name (S No. ${rowCount})" class="product-name w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div class="col-span-2 md:col-span-1">
            <input type="number" min="0.01" step="0.01" placeholder="Price" class="product-price w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" oninput="calculateTotals()" required>
        </div>
        <div class="col-span-2 md:col-span-1">
            <input type="number" min="1" step="1" value="1" placeholder="Qty" class="product-qty w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" oninput="calculateTotals()" required>
        </div>
        <div class="col-span-3 md:col-span-1 text-right font-semibold text-gray-700">
            ₹<span class="product-row-total">0.00</span>
        </div>
        <div class="col-span-1 md:col-span-1 flex justify-center">
            <button onclick="removeProductRow(this)" class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition duration-150 shadow-md">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3"></path></svg>
            </button>
        </div>
    `;
    productRowsContainer.appendChild(row);
    calculateTotals();
}

function removeProductRow(button) {
    if (productRowsContainer.children.length > 1) {
        button.closest('.product-row').remove();
        calculateTotals();
        const productRows = productRowsContainer.querySelectorAll('.product-row');
        productRows.forEach((row, index) => {
            row.querySelector('.product-name').placeholder = `Product Name (S No. ${index + 1})`;
        });
    }
}

function generateInvoice() {
    const customerName = document.getElementById('customerName').value;
    const customerAddress = document.getElementById('customerAddress').value;
    if (!customerName || !customerAddress || productRowsContainer.children.length === 0) {
        const messageBox = document.createElement('div');
        messageBox.textContent = "Please enter customer details and at least one product.";
        messageBox.className = "fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-xl z-50 transition-opacity duration-300";
        document.body.appendChild(messageBox);
        setTimeout(() => messageBox.remove(), 3000);
        return;
    }
    document.getElementById('invoiceCustomerName').textContent = customerName;
    document.getElementById('invoiceCustomerAddress').textContent = customerAddress;
    document.getElementById('invoiceNumber').textContent = generateInvoiceNumber();
    document.getElementById('invoiceDate').textContent = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    const invoiceProductList = document.getElementById('invoice-product-list');
    invoiceProductList.innerHTML = '';
    let subtotal = 0;
    const productRows = productRowsContainer.querySelectorAll('.product-row');
    productRows.forEach((row, index) => {
        const name = row.querySelector('.product-name').value || 'N/A';
        const price = parseFloat(row.querySelector('.product-price').value) || 0;
        const qty = parseFloat(row.querySelector('.product-qty').value) || 0;
        const rowTotal = price * qty;
        subtotal += rowTotal;
        const newRow = document.createElement('tr');
        newRow.className = 'hover:bg-gray-50';
        newRow.innerHTML = `
            <td class="px-3 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-500">${index + 1}</td>
            <td class="px-6 py-3 whitespace-wrap text-sm font-medium text-gray-900">${name}</td>
            <td class="px-6 py-3 whitespace-nowrap text-right text-sm text-gray-700">${qty}</td>
            <td class="px-6 py-3 whitespace-nowrap text-right text-sm text-gray-700">₹${price.toFixed(2)}</td>
            <td class="px-6 py-3 whitespace-nowrap text-right text-sm font-bold text-gray-800">₹${rowTotal.toFixed(2)}</td>
        `;
        invoiceProductList.appendChild(newRow);
    });
    const grandTotal = subtotal;
    document.getElementById('invoiceSubtotal').textContent = '₹' + subtotal.toFixed(2);
    document.getElementById('invoiceGrandTotal').textContent = '₹' + grandTotal.toFixed(2);
    inputForm.classList.add('hidden');
    invoiceContainer.classList.remove('hidden');
}

async function downloadPDF() {
    downloadBtnWrapper.classList.add('hidden');
    const { jsPDF } = window.jspdf;
    const element = document.getElementById('invoice-container');
    const filename = `Invoice_${document.getElementById('invoiceNumber').textContent}.pdf`;
    const options = { scale: 2, useCORS: true, logging: true };
    const canvas = await html2canvas(element, options);
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }
    pdf.save(filename);
    downloadBtnWrapper.classList.remove('hidden');
}
