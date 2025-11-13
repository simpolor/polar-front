import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

// Markdown-it 인스턴스 생성
const md: MarkdownIt = new MarkdownIt({
  html: false, // HTML 태그 비활성화 (XSS 방지)
  linkify: true, // URL을 자동으로 링크로 변환
  typographer: true, // 타이포그래피 개선
  highlight: (str: string, lang: string): string => {
    // 코드 하이라이팅
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch (error) {
        console.error('Highlight error:', error)
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

export function useMarkdown() {
  const renderMarkdown = (content: string): string => {
    if (!content) return ''

    try {
      return md.render(content)
    } catch (error) {
      console.error('Markdown rendering error:', error)
      return '<p>마크다운 렌더링 오류</p>'
    }
  }

  const renderInline = (content: string): string => {
    if (!content) return ''

    try {
      return md.renderInline(content)
    } catch (error) {
      console.error('Markdown inline rendering error:', error)
      return content
    }
  }

  return {
    renderMarkdown,
    renderInline
  }
}