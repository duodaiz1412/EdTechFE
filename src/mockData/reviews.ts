import {Review} from "@/types";

export const reviews: Review[] = [
    {
        id: "review-1",
        courseId: "course-1",
        courseName: "JavaScript Fundamentals",
        studentId: "student-1",
        studentName: "Nguyễn Văn An",
        rating: 5,
        comment: "Khóa học rất hay và dễ hiểu. Giảng viên giải thích rất chi tiết và có nhiều ví dụ thực tế. Tôi đã học được rất nhiều kiến thức bổ ích.",
        isApproved: true,
        creation: "2024-01-15T10:30:00Z",
        modified: "2024-01-15T10:30:00Z"
    },
    {
        id: "review-2",
        courseId: "course-2",
        courseName: "React Advanced Concepts",
        studentId: "student-2",
        studentName: "Trần Thị Bình",
        rating: 4,
        comment: "Khóa học khá tốt, nội dung phong phú. Tuy nhiên một số phần hơi khó hiểu và cần thêm ví dụ minh họa.",
        isApproved: true,
        creation: "2024-01-20T14:15:00Z",
        modified: "2024-01-20T14:15:00Z"
    },
    {
        id: "review-3",
        courseId: "course-1",
        courseName: "JavaScript Fundamentals",
        studentId: "student-3",
        studentName: "Lê Minh Châu",
        rating: 3,
        comment: "Khóa học ổn nhưng thiếu bài tập thực hành. Video có phần hơi dài và nhàm chán.",
        isApproved: false,
        creation: "2024-01-25T09:45:00Z",
        modified: "2024-01-25T09:45:00Z"
    },
    {
        id: "review-4",
        courseId: "course-3",
        courseName: "Node.js Backend Development",
        studentId: "student-4",
        studentName: "Phạm Quốc Dũng",
        rating: 5,
        comment: "Xuất sắc! Khóa học rất chất lượng với nhiều project thực tế. Sau khi hoàn thành tôi đã có thể tự tin làm việc với Node.js.",
        isApproved: true,
        creation: "2024-02-01T16:20:00Z",
        modified: "2024-02-01T16:20:00Z"
    }
]