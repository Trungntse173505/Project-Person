export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Hàm chuyển chuỗi tiêu đề thành ID chuẩn anchor link (hỗ trợ tiếng Việt đầy đủ)
 */
export function createHeadingId(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Hàm bóc tách danh sách các đề mục từ chuỗi nội dung Markdown:
 * 1. Ưu tiên các thẻ chuẩn Markdown: ## (H2) và ### (H3)
 * 2. Hỗ trợ dự phòng các phân đoạn số La Mã: I. , II. , III. nếu tác giả không dùng cú pháp ##
 */
export function extractTableOfContents(markdown: string): TocItem[] {
  if (!markdown) return [];
  const items: TocItem[] = [];

  // 1. Regex tìm các dòng bắt đầu bằng ## hoặc ###
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim().replace(/[*_`]/g, '');
    const id = createHeadingId(text);
    if (text && id) {
      items.push({ id, text, level });
    }
  }

  // 2. Dự phòng: Nếu bài viết không có thẻ ## / ### mà dùng phong cách La Mã (I., II., III...)
  if (items.length < 2) {
    const romanItems: TocItem[] = [];
    const romanRegex = /^((?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+.*)$/gm;
    while ((match = romanRegex.exec(markdown)) !== null) {
      const text = match[1].trim().replace(/[*_`]/g, '');
      const id = createHeadingId(text);
      if (text && id) {
        romanItems.push({ id, text, level: 2 });
      }
    }
    if (romanItems.length >= 2) {
      return romanItems;
    }
  }

  return items;
}
