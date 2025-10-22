// Chờ DOM tải xong
document.addEventListener('DOMContentLoaded', function() {
    
    // 0. CHỨC NĂNG LOCALSTORAGE - KHỞI TẠO VÀ LOAD SẢN PHẨM
    
    // Sản phẩm mẫu mặc định
    const defaultProducts = [
        {
            name: 'Đắc Nhân Tâm',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9ErOxeEjtfP8LPooprGj3YwPaOgPaiAmFyQ&s',
            description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử, giúp bạn hiểu rõ bản thân và cải thiện mối quan hệ với mọi người xung quanh.',
            price: 89000
        },
        {
            name: 'Nhà Giả Kim',
            image: 'https://nhasachmienphi.com/images/thumbnail/nhasachmienphi-nha-gia-kim.jpg',
            description: 'Tác phẩm nổi tiếng của Paulo Coelho kể về hành trình tìm kiếm ước mơ và ý nghĩa cuộc sống qua câu chuyện của cậu bé chăn cừu Santiago.',
            price: 75000
        },
        {
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
            // Nếu có dữ liệu trong localStorage, parse và trả về
            return JSON.parse(storedProducts);
        } else {
            // Nếu chưa có, khởi tạo với sản phẩm mẫu và lưu vào localStorage
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
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="price">${formatPrice(product.price)}</p>
        `;
        return productElement;
    }
    
    // Hàm hiển thị danh sách sản phẩm
    function displayProducts(products) {
        const productList = document.getElementById('productList');
        // Xóa tất cả sản phẩm hiện tại
        productList.innerHTML = '';
        // Thêm từng sản phẩm vào danh sách
        products.forEach(function(product) {
            const productElement = createProductElement(product);
            productList.appendChild(productElement);
        });
    }
    
    // Load và hiển thị sản phẩm khi trang được tải
    let products = loadProductsFromStorage();
    displayProducts(products);
    
    
    // 1. CHỨC NĂNG TÌM KIẾM SẢN PHẨM
    
    // Lấy các phần tử cần thiết
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const productList = document.getElementById('productList');
    
    // Hàm tìm kiếm sản phẩm - lấy danh sách sản phẩm động
    function searchProducts() {
        // Lấy giá trị tìm kiếm và chuyển về chữ thường
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Lấy danh sách sản phẩm hiện tại (bao gồm cả sản phẩm mới)
        const productItems = document.querySelectorAll('.product-item');
        
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
    const productForm = document.getElementById('productForm');
    const errorMsg = document.getElementById('errorMsg');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Hàm toggle (đảo trạng thái) hiển thị form
    function toggleAddProductForm() {
        // Sử dụng classList.toggle để thêm/xóa class 'hidden'
        addProductForm.classList.toggle('hidden');
        
        // Cuộn xuống form nếu form được hiển thị
        if (!addProductForm.classList.contains('hidden')) {
            addProductForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Xóa thông báo lỗi khi mở form
            errorMsg.textContent = '';
        }
    }
    
    // Gắn sự kiện click cho nút "Thêm sản phẩm"
    addProductBtn.addEventListener('click', toggleAddProductForm);
    
    // Gắn sự kiện click cho nút "Hủy"
    cancelBtn.addEventListener('click', function() {
        // Ẩn form
        addProductForm.classList.add('hidden');
        // Reset form
        productForm.reset();
        // Xóa thông báo lỗi
        errorMsg.textContent = '';
    });
    
    
    // 3. CHỨC NĂNG XỬ LÝ SUBMIT FORM THÊM SẢN PHẨM VỚI VALIDATION
    
    // Hàm validate dữ liệu form
    function validateProductForm(name, image, description, price) {
        // Kiểm tra tên sản phẩm không được rỗng
        if (name === '') {
            return 'Tên sản phẩm không được để trống!';
        }
        
        // Kiểm tra URL hình ảnh không được rỗng
        if (image === '') {
            return 'URL hình ảnh không được để trống!';
        }
        
        // Kiểm tra URL hình ảnh hợp lệ
        try {
            new URL(image);
        } catch (e) {
            return 'URL hình ảnh không hợp lệ!';
        }
        
        // Kiểm tra mô tả không được rỗng và không quá ngắn (tối thiểu 10 ký tự)
        if (description === '') {
            return 'Mô tả sản phẩm không được để trống!';
        }
        if (description.length < 10) {
            return 'Mô tả sản phẩm phải có ít nhất 10 ký tự!';
        }
        
        // Kiểm tra giá không được rỗng
        if (price === '') {
            return 'Giá sản phẩm không được để trống!';
        }
        
        // Chuyển giá sang số và kiểm tra
        const priceNumber = Number(price);
        
        // Kiểm tra giá phải là số hợp lệ
        if (isNaN(priceNumber)) {
            return 'Giá sản phẩm phải là số hợp lệ!';
        }
        
        // Kiểm tra giá phải lớn hơn 0
        if (priceNumber <= 0) {
            return 'Giá sản phẩm phải lớn hơn 0!';
        }
        
        // Tất cả đều hợp lệ
        return null;
    }
    
    // Hàm xử lý khi submit form
    productForm.addEventListener('submit', function(event) {
        // Ngăn form submit mặc định (không reload trang)
        event.preventDefault();
        
        // Lấy giá trị từ form và trim (loại bỏ khoảng trắng thừa)
        const productName = document.getElementById('productName').value.trim();
        const productImage = document.getElementById('productImage').value.trim();
        const productDescription = document.getElementById('productDescription').value.trim();
        const productPrice = document.getElementById('productPrice').value.trim();
        
        // Validate dữ liệu
        const validationError = validateProductForm(productName, productImage, productDescription, productPrice);
        
        // Nếu có lỗi, hiển thị thông báo và dừng lại
        if (validationError) {
            errorMsg.textContent = validationError;
            errorMsg.style.display = 'block';
            return; // Dừng không thêm sản phẩm
        }
        
        // Xóa thông báo lỗi nếu tất cả đều hợp lệ
        errorMsg.textContent = '';
        errorMsg.style.display = 'none';
        
        // Tạo đối tượng sản phẩm mới
        const newProductData = {
            name: productName,
            image: productImage,
            description: productDescription,
            price: Number(productPrice)
        };
        
        // Thêm sản phẩm vào đầu mảng products
        products.unshift(newProductData);
        
        // Lưu vào localStorage
        saveProductsToStorage(products);
        
        // Tạo phần tử HTML cho sản phẩm mới
        const newProductElement = createProductElement(newProductData);
        
        // Thêm sản phẩm mới vào đầu danh sách hiển thị
        productList.prepend(newProductElement);
        
        // Reset form (xóa nội dung các trường)
        productForm.reset();
        
        // Ẩn form sau khi thêm
        addProductForm.classList.add('hidden');
        
        // Cuộn đến sản phẩm mới với hiệu ứng mượt mà
        newProductElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Thông báo thành công
        alert('Đã thêm sản phẩm mới thành công! Dữ liệu đã được lưu vào LocalStorage.');
    });
    
    
    // 4. CHỨC NĂNG BỔ SUNG: Reset tìm kiếm khi xóa hết text
    searchInput.addEventListener('input', function() {
        if (searchInput.value === '') {
            // Hiển thị lại tất cả sản phẩm khi xóa hết text
            const productItems = document.querySelectorAll('.product-item');
            productItems.forEach(function(product) {
                product.style.display = '';
            });
        }
    });
    
});

