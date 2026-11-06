/**
 * Hàm tối ưu hóa URL ảnh Cloudinary:
 * - Tự động thêm f_auto để trình duyệt nhận định dạng tối ưu nhất (WebP hoặc AVIF)
 * - Tự động thêm q_auto để nén thông minh, giảm dung lượng tới 70% mà không vỡ hạt
 * - Thêm w_${maxWidth},c_limit để giới hạn kích thước ảnh tải về đúng với kích thước hiển thị
 */
export function optimizeCloudinaryUrl(url?: string, maxWidth = 1200): string {
  if (!url || typeof url !== 'string') return '';

  // Chỉ can thiệp với ảnh lưu trên Cloudinary
  if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
    return url;
  }

  // Nếu đã chứa tham số chuyển đổi f_auto thì giữ nguyên
  if (url.includes('/f_auto') || url.includes('f_auto,')) {
    return url;
  }

  const transformation = `f_auto,q_auto,w_${maxWidth},c_limit`;
  return url.replace('/image/upload/', `/image/upload/${transformation}/`);
}

