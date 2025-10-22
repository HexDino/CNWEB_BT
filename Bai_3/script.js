// Chờ DOM tải xong
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. CHỨC NĂNG TÌM KIẾM SẢN PHẨM
    
    // Lấy các phần tử cần thiết
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const productItems = document.querySelectorAll('.product-item');
    
    // Hàm tìm kiếm sản phẩm
    function searchProducts() {
        // Lấy giá trị tìm kiếm và chuyển về chữ thường
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Duyệt qua tất cả sản phẩm
        productItems.forEach(function(product) {
            // Lấy tên sản phẩm
            const productName = product.querySelector('.product-name').textContent.toLowerCase();
            
            // Kiểm tra xem tên sản phẩm có chứa từ khóa không
            if (productName.includes(searchTerm)) {
                // Hiển thị sản phẩm
                product.style.display = '';
            } else {
                // Ẩn sản phẩm
                product.style.display = 'none';
            }
        });
    }
    
    // Gắn sự kiện click cho nút tìm kiếm
    searchBtn.addEventListener('click', searchProducts);
    
    // Gắn sự kiện keyup cho ô tìm kiếm (tìm kiếm real-time khi gõ)
    searchInput.addEventListener('keyup', function(event) {
        // Nếu nhấn Enter thì tìm kiếm
        if (event.key === 'Enter') {
            searchProducts();
        } else {
            // Tìm kiếm real-time khi gõ
            searchProducts();
        }
    });
    
    
    // 2. CHỨC NĂNG HIỂN THỊ/ẨN FORM THÊM SẢN PHẨM
    
    // Lấy phần tử nút "Thêm sản phẩm" và form
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    
    // Hàm toggle (đảo trạng thái) hiển thị form
    function toggleAddProductForm() {
        // Sử dụng classList.toggle để thêm/xóa class 'hidden'
        addProductForm.classList.toggle('hidden');
        
        // Cuộn xuống form nếu form được hiển thị
        if (!addProductForm.classList.contains('hidden')) {
            addProductForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Gắn sự kiện click cho nút "Thêm sản phẩm"
    addProductBtn.addEventListener('click', toggleAddProductForm);
    
    
    // 3. CHỨC NĂNG XỬ LÝ SUBMIT FORM THÊM SẢN PHẨM (Tùy chọn)
    
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    
    // Hàm xử lý khi submit form
    productForm.addEventListener('submit', function(event) {
        // Ngăn form submit mặc định (không reload trang)
        event.preventDefault();
        
        // Lấy giá trị từ form
        const productName = document.getElementById('productName').value;
        const productImage = document.getElementById('productImage').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = document.getElementById('productPrice').value;
        
        // Tạo phần tử sản phẩm mới
        const newProduct = document.createElement('article');
        newProduct.className = 'product-item';
        
        newProduct.innerHTML = `
            <img src="${productImage}" alt="${productName}">
            <h3 class="product-name">${productName}</h3>
            <p class="product-description">${productDescription}</p>
            <p class="price">${productPrice}</p>
        `;
        
        // Thêm sản phẩm mới vào danh sách
        productList.appendChild(newProduct);
        
        // Reset form
        productForm.reset();
        
        // Ẩn form sau khi thêm
        addProductForm.classList.add('hidden');
        
        // Cuộn đến sản phẩm mới
        newProduct.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Thông báo thành công
        alert('Đã thêm sản phẩm mới thành công!');
        
        // Cập nhật lại danh sách sản phẩm để tìm kiếm hoạt động với sản phẩm mới
    });
    
    
    // 4. CHỨC NĂNG BỔ SUNG: Reset tìm kiếm khi xóa hết text
    searchInput.addEventListener('input', function() {
        if (searchInput.value === '') {
            // Hiển thị lại tất cả sản phẩm khi xóa hết text
            productItems.forEach(function(product) {
                product.style.display = '';
            });
        }
    });
    
});

