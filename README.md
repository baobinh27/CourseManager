# Getting Started

### `npm install`

Install all dependencies to run the app (will be saved in node_modules)
Dependencies using: body-parser, cors, dotenv, express, mongoose, react, react-dom, react-router-dom, react-scripts

## Available Scripts

### `npm start`

Runs the app in the development mode, both backend and frontend at the same time

### `react-scripts start`

Runs frontend only

### `node src/backend/server.js`

Runs backend only

### back-end 6/4

#### UserAPI: 
gồm có sign-up, change-password, login, chi tiết về method và params tôi note o đầu file
Usermodel: không có trường UserId, mà trưònng này lấy ở id_object của mongodb. 
Khi user đăng nhập thành công, tiến hành lưu token. truy vấn userId từ token (trường _id) 
Để phục vụ các truy vấn cần userId sau này

#### DraftCourseAPI: 
CRUD (của riêng mỗi người dùng (tác giả): cần userId, đã xử lý ở file authMiddleware.js, frontend chỉ cần lưu token khi người dùng đăng nhập là được)
quyền admin: getAll DraftCourse, approve or reject các draftcourse.

#### CourseAPI: 
các hàm getcourse cho nhiệm vụ tìm kiếm chung
Hàm get các course mà người dùng tạo và người dùng enroll 
Hàm người dùng enroll course
Hàm người dùng xem 1 course da enroll (vào khoá học)
Ham nguoi dung xoa/sua course da tao của mình



