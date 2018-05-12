export const hasTitle = content => /^#{1,6} [^#\n]+$/gm.test(content);
