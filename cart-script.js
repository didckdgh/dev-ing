let cart = JSON.parse(localStorage.getItem('cart')) || [];

function displayCartItems() {
    const cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML = '';

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="cart-item-text">
                <h3>${item.name}</h3>
                <p class="cart-item-desc">옵션: ${item.option} (${item.optionWeight}kg)</p>
                <p class="cart-item-quantity">수량: ${item.quantity}</p>
                <p class="cart-item-price">총 가격: ${item.totalPrice.toLocaleString()}원</p>
            </div>
            <div class="cart-item-actions">
                <button class="edit-btn" onclick="openEditModal(${index})">수정</button>
            </div>
        `;
        cartItemsList.appendChild(li);
    });

    const totalPrice = cart.reduce((total, item) => total + item.totalPrice, 0);
    document.getElementById('total-price').innerText = `총 금액: ${totalPrice.toLocaleString()}원`;
}


// 옵션 선택 모달 열기
function openOptionModal(productName) {
    const product = products.find(p => p.name === productName);
    const optionSelect = document.getElementById('option');
    optionSelect.innerHTML = '';

    product.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.name;
        optionElement.textContent = `${option.name} (추가 금액: ${option.price}원)`;
        optionSelect.appendChild(optionElement);
    });

    document.getElementById('price').innerText = product.basePrice;
    document.getElementById('option-modal').style.display = 'block';
    document.getElementById('quantity').value = 1;
    document.getElementById('option-modal').setAttribute('data-product-name', productName);
}

// 장바구니에 담기
function addToCartWithOptions() {
    const productName = document.getElementById('option-modal').getAttribute('data-product-name');
    const product = products.find(p => p.name === productName);
    const quantity = parseInt(document.getElementById('quantity').value);
    const selectedOptionName = document.getElementById('option').value;
    const selectedOption = product.options.find(option => option.name === selectedOptionName);

    const cartItem = {
        name: product.name,
        optionWeight: selectedOption.weight,
        quantity: quantity,
        price: product.basePrice,
        optionPrice: selectedOption.price,
        totalPrice: (product.basePrice + selectedOption.price) * quantity,
        option: selectedOptionName
    };

    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    closeOptionModal();
    displayCartItems();
    alert(`${product.name}이(가) 장바구니에 담겼습니다!`);
}

// 수정용 모달 열기
function openEditModal(index) {
    const item = cart[index];
    const product = products.find(p => p.name === item.name);
    const editOptionSelect = document.getElementById('edit-option');
    editOptionSelect.innerHTML = '';

    product.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.name;
        optionElement.textContent = `${option.name} (추가 금액: ${option.price}원)`;
        editOptionSelect.appendChild(optionElement);
    });

    document.getElementById('edit-quantity').value = item.quantity;
    document.getElementById('edit-price').innerText = `현재 가격: ${item.totalPrice}원`;

    document.getElementById('edit-modal').style.display = 'block';
    document.getElementById('edit-modal').setAttribute('data-item-index', index);
}

// 수정 완료 후 장바구니 업데이트
function updateCartItem() {
    const itemIndex = document.getElementById('edit-modal').getAttribute('data-item-index');
    const item = cart[itemIndex];
    const quantity = parseInt(document.getElementById('edit-quantity').value);
    const optionName = document.getElementById('edit-option').value;

    const product = products.find(p => p.name === item.name);
    const selectedOption = product.options.find(option => option.name === optionName);

    item.quantity = quantity;
    item.option = optionName;
    item.optionWeight = selectedOption.weight;
    item.totalPrice = (product.basePrice + selectedOption.price) * quantity;

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    closeEditModal();
    alert('장바구니가 업데이트되었습니다!');
}

// 수량과 옵션 변경 시 실시간으로 가격 반영
function updatePrice() {
    const itemIndex = document.getElementById('edit-modal').getAttribute('data-item-index');
    const item = cart[itemIndex]; // 기존 cart 배열 사용
    const quantity = parseInt(document.getElementById('edit-quantity').value);
    const optionName = document.getElementById('edit-option').value;

    const product = products.find(p => p.name === item.name); // 기존 products 배열 사용
    const selectedOption = product.options.find(option => option.name === optionName);

    const totalPrice = (product.basePrice + selectedOption.price) * quantity;
    document.getElementById('edit-price').innerText = `${totalPrice}원`;
}

// 수정용 모달 닫기
function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// 장바구니 비우기
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// 구매 진행
function checkout() {
    alert('구매 진행');
}

// 초기화
displayCartItems();
