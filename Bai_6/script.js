// Chờ DOM tải xong
document.addEventListener('DOMContentLoaded', function() {
    
    // 0. CHỨC NĂNG LOCALSTORAGE - KHỞI TẠO VÀ LOAD SẢN PHẨM
    
    // Sản phẩm mẫu mặc định
    const defaultProducts = [
        {
            id: Date.now() + 1,
            name: 'Đắc Nhân Tâm',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9ErOxeEjtfP8LPooprGj3YwPaOgPaiAmFyQ&s',
            description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử, giúp bạn hiểu rõ bản thân và cải thiện mối quan hệ với mọi người xung quanh.',
            price: 89000
        },
        {
            id: Date.now() + 2,
            name: 'Nhà Giả Kim',
            image: 'https://nhasachmienphi.com/images/thumbnail/nhasachmienphi-nha-gia-kim.jpg',
            description: 'Tác phẩm nổi tiếng của Paulo Coelho kể về hành trình tìm kiếm ước mơ và ý nghĩa cuộc sống qua câu chuyện của cậu bé chăn cừu Santiago.',
            price: 75000
        },
        {
            id: Date.now() + 3,
            name: 'Sapiens: Lược Sử Loài Người',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtSH2BYZfQJnwHmkZxMtMXRGVAqsTGyomDAw&s',
            description: 'Cuốn sách đưa bạn đi qua hành trình tiến hóa của loài người từ thời kỳ đồ đá đến thời đại công nghệ, với những quan điểm độc đáo và sâu sắc.',
            price: 120000
        }
    ];
    
    // Hàm load sản phẩm từ localStorage
    function loadProductsFromStorage() {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            const products = JSON.parse(storedProducts);
            // Thêm ID nếu sản phẩm cũ chưa có ID
            return products.map(p => ({
                ...p,
                id: p.id || Date.now() + Math.random()
            }));
        } else {
            localStorage.setItem('products', JSON.stringify(defaultProducts));
            return defaultProducts;
        }
    }
    
    // Hàm lưu sản phẩm vào localStorage
    function saveProductsToStorage(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Hàm format giá tiền (thêm dấu chấm phân cách hàng nghìn)
    function formatPrice(price) {
        const priceNumber = Number(price);
        return priceNumber.toLocaleString('vi-VN') + 'đ';
    }
    
    // Hàm tạo phần tử HTML cho sản phẩm
    function createProductElement(product) {
        const productElement = document.createElement('article');
        productElement.className = 'product-item';
        productElement.dataset.productId = product.id;
        productElement.innerHTML = `
            <button class="delete-btn" data-id="${product.id}" title="Xóa sản phẩm">✕</button>
            <img src="${product.image}" alt="${product.name}">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="price">${formatPrice(product.price)}</p>
        `;
        
        // Xử lý click vào sản phẩm để xem chi tiết
        productElement.addEventListener('click', function(e) {
            // Không mở modal nếu click vào nút delete
            if (!e.target.classList.contains('delete-btn')) {
                showProductModal(product);
            }
        });
        
        // Xử lý nút xóa
        const deleteBtn = productElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Ngăn event bubble để không mở modal
            deleteProduct(product.id);
        });
        
        return productElement;
    }
    
    // Hàm hiển thị danh sách sản phẩm
    function displayProducts(productsToDisplay) {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
        
        if (productsToDisplay.length === 0) {
            productList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px; grid-column: 1/-1;">Không tìm thấy sản phẩm nào</p>';
            return;
        }
        
        productsToDisplay.forEach(function(product) {
            const productElement = createProductElement(product);
            productList.appendChild(productElement);
        });
    }
    
    // Load và hiển thị sản phẩm khi trang được tải
    let products = loadProductsFromStorage();
    displayProducts(products);
    
    
    // 1. CHỨC NĂNG XÓA SẢN PHẨM
    
    function deleteProduct(productId) {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            // Tìm và xóa sản phẩm khỏi mảng
            products = products.filter(p => p.id !== productId);
            
            // Lưu vào localStorage
            saveProductsToStorage(products);
            
            // Cập nhật giao diện
            applyFiltersAndSort();
        }
    }
    
    
    // 2. CHỨC NĂNG MODAL CHI TIẾT SẢN PHẨM
    
    const modal = document.getElementById('productModal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    function showProductModal(product) {
        document.getElementById('modalImage').src = product.image;
        document.getElementById('modalImage').alt = product.name;
        document.getElementById('modalName').textContent = product.name;
        document.getElementById('modalDescription').textContent = product.description;
        document.getElementById('modalPrice').textContent = formatPrice(product.price);
        
        modal.classList.remove('hidden');
    }
    
    function closeModal() {
        modal.classList.add('hidden');
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    
    // Đóng modal khi click vào backdrop
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Đóng modal khi nhấn ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    
    // 3. CHỨC NĂNG TÌM KIẾM, LỌC VÀ SẮP XẾP
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const priceFilter = document.getElementById('priceFilter');
    const sortBy = document.getElementById('sortBy');
    const productList = document.getElementById('productList');
    
    // Hàm áp dụng tất cả bộ lọc và sắp xếp
    function applyFiltersAndSort() {
        let filteredProducts = [...products];
        
        // 1. Lọc theo tên (tìm kiếm)
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm)
            );
        }
        
        // 2. Lọc theo khoảng giá
        const priceRange = priceFilter.value;
        if (priceRange !== 'all') {
            const [minPrice, maxPrice] = priceRange.split('-').map(Number);
            filteredProducts = filteredProducts.filter(p => 
                p.price >= minPrice && p.price <= maxPrice
            );
        }
        
        // 3. Sắp xếp
        const sortValue = sortBy.value;
        if (sortValue) {
            if (sortValue === 'name-asc') {
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
            } else if (sortValue === 'name-desc') {
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
            } else if (sortValue === 'price-asc') {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (sortValue === 'price-desc') {
                filteredProducts.sort((a, b) => b.price - a.price);
            }
        }
        
        // Hiển thị kết quả
        displayProducts(filteredProducts);
    }
    
    // Gắn sự kiện cho các controls
    searchBtn.addEventListener('click', applyFiltersAndSort);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            applyFiltersAndSort();
        } else {
            applyFiltersAndSort(); // Real-time search
        }
    });
    priceFilter.addEventListener('change', applyFiltersAndSort);
    sortBy.addEventListener('change', applyFiltersAndSort);
    
    // Reset hiển thị khi xóa hết text
    searchInput.addEventListener('input', function() {
        if (searchInput.value === '') {
            applyFiltersAndSort();
        }
    });
    
    
    // 4. CHỨC NĂNG HIỂN THỊ/ẨN FORM THÊM SẢN PHẨM
    
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    const productForm = document.getElementById('productForm');
    const errorMsg = document.getElementById('errorMsg');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Hàm toggle (đảo trạng thái) hiển thị form
    function toggleAddProductForm() {
        addProductForm.classList.toggle('hidden');
        
        // Cuộn xuống form nếu form được hiển thị
        if (!addProductForm.classList.contains('hidden')) {
            setTimeout(() => {
                addProductForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            errorMsg.textContent = '';
        }
    }
    
    // Gắn sự kiện click cho nút "Thêm sản phẩm"
    addProductBtn.addEventListener('click', toggleAddProductForm);
    
    // Gắn sự kiện click cho nút "Hủy"
    cancelBtn.addEventListener('click', function() {
        addProductForm.classList.add('hidden');
        productForm.reset();
        errorMsg.textContent = '';
    });
    
    
    // 5. CHỨC NĂNG XỬ LÝ SUBMIT FORM THÊM SẢN PHẨM VỚI VALIDATION
    
    // Hàm validate dữ liệu form
    function validateProductForm(name, image, description, price) {
        if (name === '') {
            return 'Tên sản phẩm không được để trống!';
        }
        
        if (image === '') {
            return 'URL hình ảnh không được để trống!';
        }
        
        try {
            new URL(image);
        } catch (e) {
            return 'URL hình ảnh không hợp lệ!';
        }
        
        if (description === '') {
            return 'Mô tả sản phẩm không được để trống!';
        }
        if (description.length < 10) {
            return 'Mô tả sản phẩm phải có ít nhất 10 ký tự!';
        }
        
        if (price === '') {
            return 'Giá sản phẩm không được để trống!';
        }
        
        const priceNumber = Number(price);
        
        if (isNaN(priceNumber)) {
            return 'Giá sản phẩm phải là số hợp lệ!';
        }
        
        if (priceNumber <= 0) {
            return 'Giá sản phẩm phải lớn hơn 0!';
        }
        
        return null;
    }
    
    // Hàm xử lý khi submit form
    productForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const productName = document.getElementById('productName').value.trim();
        const productImage = document.getElementById('productImage').value.trim();
        const productDescription = document.getElementById('productDescription').value.trim();
        const productPrice = document.getElementById('productPrice').value.trim();
        
        // Validate dữ liệu
        const validationError = validateProductForm(productName, productImage, productDescription, productPrice);
        
        if (validationError) {
            errorMsg.textContent = validationError;
            errorMsg.style.display = 'block';
            return;
        }
        
        errorMsg.textContent = '';
        errorMsg.style.display = 'none';
        
        // Tạo đối tượng sản phẩm mới với ID unique
        const newProductData = {
            id: Date.now(),
            name: productName,
            image: productImage,
            description: productDescription,
            price: Number(productPrice)
        };
        
        // Thêm sản phẩm vào đầu mảng products
        products.unshift(newProductData);
        
        // Lưu vào localStorage
        saveProductsToStorage(products);
        
        // Reset form
        productForm.reset();
        
        // Ẩn form
        addProductForm.classList.add('hidden');
        
        // Reset filters và hiển thị lại
        searchInput.value = '';
        priceFilter.value = 'all';
        sortBy.value = '';
        applyFiltersAndSort();
        
        // Cuộn đến sản phẩm mới
        setTimeout(() => {
            const newProductElement = document.querySelector(`[data-product-id="${newProductData.id}"]`);
            if (newProductElement) {
                newProductElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
        
        // Thông báo thành công
        alert('Đã thêm sản phẩm mới thành công!');
    });
    
});
