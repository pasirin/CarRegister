# Car Register
### Cài đặt môi trường để chạy được
- Phải có cài MySQL (có thể thay thế bằng PostGres được, đang nghiên cứu tích hợp cả MongoDB)
- Trong MySQL phải có cài đặt sẵn một schema mang tên như sau (không thể tự động phần này được, phải là người dùng tạo):

![Screenshot 2023-04-12 174249](https://user-images.githubusercontent.com/63360413/231434521-27683e85-06ca-4e88-9c78-c149fd896bb9.png)

- Sau khi tạo được một schema như trên rồi thì tiếp tục mở file dưới đường dẫn sau:
- 
>src/main/resources/application.properties
>
- Thay đổi 2 mục `username` và `password` bằng tài khoản và mật khẩu để đăng nhập vào csdl của mình.
- **Lưu ý** đường `url` `localhost:3307` có thể được cài đặt khác ở các csdl khác nhau nên hãy lấy giá trị này ở cửa sổ MySQL Workbench để được giá trị chuẩn nhất của máy mình

![Screenshot 2023-04-12 175052](https://user-images.githubusercontent.com/63360413/231436174-e4c11654-6346-4700-8942-bfe7d67eba32.png)

- Sau khi làm các bước trên thì hãy mở thư mục bằng Intellij và mở file pom.xml lên, nếu như intellij có hiển thị nút sau thì hãy bấm nó để đảm bảo các thư viện được tải đầy đủ

![Screenshot 2023-04-12 175337](https://user-images.githubusercontent.com/63360413/231436928-8657a0d6-2d5a-413b-857a-d481a0bcea17.png)

- Sau đó có thể bấm chạy trực tiếp trên intellij, nếu như nút bấm chạy ko hiển thị thì hãy mở file theo đường dẫn sau:

>src/main/java/com/testing/carregister/CarRegisterApplication.java

- Sẽ có nút bấm chạy, sau khi bấm thì nếu mọi thứ đều ok thì cửa sổ chạy sẽ ko bị ngừng lại và sẽ ko có câu lệnh lỗi trong cửa sổ chạy

### Sử dụng API

- có thể sử dụng các thư viện fetch để truy cập và gửi dữ liệu theo các đường link dưới đây (có thể thử nghiệm trực tiếp bằng PostMan):

`http://localhost:8080/api/test/{all/user/mod}`

Tất cả request về link này đều là GET
Đường link này để thử nghiệm các mức độ quyền của người dùng đi từ all < user < mod
Đường link này có thể sẽ bị bỏ đi trong tương lai vì nó chỉ có mục đích để debug

`http://localhost:8080/api/auth/signup`

Đường link này để đăng ký tài khoản mới cho người dùng (sử dụng POST)
Khi muốn đăng ký một người dùng mới hãy gửi vào đường link này body có định dạng raw, JSON như sau:
```
{
    "username": "tên người dùng",
    "email": "email của người dùng",
    "password": "mật khẩu của người dùng",
    "role": ["một mảng chứa các quyền của người dùng này"],
    "region": "Địa phận mà họ quản lý"
}
```
- Ví dụ một người dùng có 2 mức độ quyền là user và mod, quản lý tại AN_GIANG:
```
{
    "username": "mod",
    "email": "mod@test.com",
    "password": "31415926",
    "role": ["mod", "user"],
    "region": "AN_GIANG"
}
```
- Có 3 mức độ cấp bậc là `user`, `mod`, và `admin` thứ tự đặc quyền cũng theo như vậy.
- với địa phân quản lý hãy vào file theo đường dẫn sau để có một danh sách đầy đủ:
>src/main/java/com/testing/carregister/models/user/ERegion.java

- Nếu tạo tài khoản thành công sẽ có phản hồi lại `Đăng ký người dùng thành công`

- Hãy sử dụng đường link sau để thử đăng nhập vào tài khoản này và để lấy token về để sử dụng các API khác:
`http://localhost:8080/api/auth/signin`
Cũng gửi về đường link này dưới dạng POST, có body đặt dưới dạng JSON với giá trị như sau:
```
{
    "username": "tên đăng nhập",
    "password": "mật khẩu"
}
```
Sau khi đăng nhập xong thì các thông tin của người dùng sẽ được gửi về và đồng thời là token được lưu dưới tiêu đề `accessToken`
Hãy lưu token này lại vào local Storage để tái sử dụng lại vào các lần đăng nhập tiếp theo
Lưu ý là token có thời gian hết hạn sử dụng, sau khoảng thời gian này người dùng sẽ phải đăng nhập lại để lấy token mới
### Cách sử dụng token
- Các header của các request sẽ phải thêm mục `Authorization` và gán với nội dung là `Bearer ` + token **phải có dấu cách dữa cụm từ Bearer và token đoạn sau**. VD:
```
Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtb2QiLCJpYXQiOjE2ODEyNTk4NTYsImV4cCI6MTY4MTI4ODY1Nn0.T9IsOGnVvLNgz7byWeo2F0MS16nFAwx6eCjOrGbPoI1q1z2dFWqVfYf03pnMe4k6iZBOdcXCWFnPNr5oR-b1tw
```

#### Các đường link dưới đây sẽ phải sử dụng token thì mới có thể truy cập được:
POST: `http://localhost:8080/api/add/vehicle` Thêm một phương tiện vào csdl (user, mod, admin có quyền)

POST: `http://localhost:8080/api/add/vehicles` Thêm nhiều phương tiện cùng một lúc vào csdl (dùng cho việc import) (admin có quyền)

GET: `http://localhost:8080/api/get/vehicle` Lấy danh sách toàn bộ các phương tiện trong csdl (user, mod, admin có quyền)

POST: `http://localhost:8080/api/check/vehicle` Đánh dấu là phương tiện đã được kiểm duyệt (mod, admin có quyền)

DELETE: `http://localhost:8080/api/delete/vehicles` Xóa toàn bộ danh sách các phương tiện trong csdl (admin có quyền)

### Cách thêm phương tiện vào csdl
- Gửi request với body dưới dạng raw, JSON:
```
{
    "plateNumber": "biển số xe",
    "createdDate": "ngày được tạo ra của xe",
    "newestDate": "Ngày gần nhất xe được đăng kiểm", (mục này có thể ko gửi kèm nếu xe mới toanh :v)
    "lastRegion": "Địa phận gần nhất xe đi đăng kiểm",
    "ownerName": "Tên chử sở hữu",
    "type": "Loại xe"
}
```
- **Lưu ý là thời gian newestDate và createdDate sẽ case Sensitive** tức là sẽ phải gửi dữ liệu đi dưới đúng định dạng không là hệ thống sẽ không nhận
- Biển số xe plateNumber sẽ không được trùng với các xe khác
- Định dạng dưới dạng là `yyyy-MM-dd` tức năm rồi tháng rồi ngày
- createdDate sẽ ko được mới hơn newestDate
- createdDate và newestDate sẽ không được lớn hơn ngày hôm nay
- lastRegion có thể tra như mục region khi tạo người dùng mới
- type thì có 5 loại xe: TYPE_1, TYPE_2, TYPE_3, TYPE_4, TYPE_5
- Ví dụ mẫu:
**Có newestDate**
```
{
    "plateNumber": "51F88839",
    "createdDate": "2023-01-10",
    "newestDate": "2023-04-10",
    "lastRegion": "AN_GIANG",
    "ownerName": "Trần Đình Nhẫn",
    "type": "TYPE_1"
}
```
**Không có newestDate**
```
{
    "plateNumber": "40F99990",
    "createdDate": "2023-04-11",
    "lastRegion": "BA_RIA_VUNG_TAU",
    "ownerName": "Nguyễn Trường Thành",
    "type": "TYPE_5"
}
```
Nếu đăng ký thành công sẽ có tin nhắn được gửi lại thông báo thành công
### Cách kiểm duyệt cho phương tiện
- Gửi request lần này sẽ yêu cầu dưới dạng `form-data` (nếu bất tiện hãy báo lại để mình đổi)
- Trong form sẽ yêu cầu có mục `plateNumber` gán biển số xe muốn kiểm duyệt vào đây để csdl kiểm duyệt
### Thêm nhiều phương tiện cùng một lúc / xóa toàn bộ dữ liệu phương tiện
>TODO
