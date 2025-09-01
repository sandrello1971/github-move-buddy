import DOMPurify from 'dompurify';

// Configurazione sicura per sanitizzare HTML dei post del blog
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    // Permetti solo tag sicuri per il contenuto del blog
    ALLOWED_TAGS: [
      'p', 'br', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'b', 'em', 'i', 'u', 'del', 's', 'strike',
      'a', 'img', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'video', 'audio', 'source', 'iframe'
    ],
    // Permetti solo attributi sicuri
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'width', 'height', 'class', 'id',
      'target', 'rel', 'allowfullscreen', 'frameborder', 'controls',
      'style' // Solo per alcuni casi specifici
    ],
    // Configurazioni aggiuntive per sicurezza
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    // Permetti solo protocolli sicuri
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
};