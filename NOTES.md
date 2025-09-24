### Note ngày 24/9/2025:
- Chức năng thực hiện: Login, register, logout, refresh token, protected route (đường dẫn cần đăng nhập)
- Những thay đổi:
    + Redux: sử dụng `userSlice` thay vì `authSlice`, viết `useDispatch` và `useSelector` theo [chuẩn](https://redux.js.org/tutorials/typescript-quick-start#define-root-state-and-dispatch-types) trên doc của Redux.
    + Gọi API: các hàm axios được viết trong `lib/services`, có đơn giản hóa, không viết thêm hook ngoài mà viết trực tiếp trong component.
    + Luồng: 
        * B1: Login/register -> `Notify.tsx` (đóng)
        * B2: Mở email, nhấn vào link confirm -> sửa thành 5173 -> `VerifyRedirect.tsx`-> `Verify.tsx` -> `MainLayout` (tại route "/")
    + Các đoạn code cũ không sử dụng tới (cân nhắc xem xóa những cái nào)
        * Folder `api`
        * Folder `config`
        * Folder `hooks`
        * Các file `api, cookies, storage` trong folder `lib`
        * File `authSlice` trong `redux`, file `WaitingForMagicLink` trong `pages/Auth`
        * Những đoạn code comment lại trong `auth.services.ts`, `user.services.ts`, page `Login.tsx`, `Register.tsx`, `Verify.tsx`

