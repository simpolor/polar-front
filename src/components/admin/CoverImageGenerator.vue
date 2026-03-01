<template>
  <div class="space-y-4">
    <!-- 시각적 미리보기 (HTML 표시 전용) -->
    <div
      class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
      style="height: 315px;"
    >
      <div style="transform: scale(0.5); transform-origin: top left; width: 1200px; height: 630px;">
        <div :style="cardStyle">
          <!-- 상단: 브랜딩 -->
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 6px; height: 28px; background: #6366f1; border-radius: 3px;"></div>
            <span style="color: #94a3b8; font-size: 22px; font-weight: 500; letter-spacing: 0.08em;">단순하고 색있게</span>
          </div>
          <!-- 중앙: 제목·설명 -->
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 48px 0 32px;">
            <div style="color: #fff; font-size: 66px; font-weight: 700; line-height: 1.25; margin-bottom: 28px; word-break: keep-all;">
              {{ title || '포스트 제목' }}
            </div>
            <div style="color: #94a3b8; font-size: 30px; line-height: 1.6; word-break: keep-all;">
              {{ description || '' }}
            </div>
          </div>
          <!-- 하단: 태그 -->
          <div style="display: flex; flex-wrap: wrap; gap: 14px;">
            <span
              v-for="tag in parsedTags.slice(0, 5)"
              :key="tag"
              style="padding: 10px 24px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.35); border-radius: 999px; color: #a5b4fc; font-size: 22px; font-weight: 500;"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 생성 버튼 -->
    <button
      type="button"
      @click="generate"
      :disabled="generating || !title"
      class="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      <LoadingSpinner v-if="generating" size="sm" />
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span>{{ generating ? '이미지 생성 중...' : '커버 이미지 자동 생성' }}</span>
    </button>

    <ErrorMessage v-if="error" :message="error" type="error" @dismiss="error = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { uploadImage } from '@/api/file.api'
import type { FileInfo } from '@/types/common.types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

interface Props {
  title: string
  description?: string
  tags?: string
}

interface Emits {
  (e: 'generated', value: FileInfo): void
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  tags: ''
})

const emit = defineEmits<Emits>()

const generating = ref(false)
const error = ref<string | null>(null)

const cardStyle = {
  width: '1200px',
  height: '630px',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  padding: '80px',
  boxSizing: 'border-box' as const,
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'space-between',
  fontFamily: "'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif"
}

const parsedTags = computed(() => {
  if (!props.tags) return []
  return props.tags.split(/[,\s]+/).map((t: string) => t.trim()).filter(Boolean)
})

// 텍스트를 maxWidth 기준으로 줄 배열로 분리
const splitLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] => {
  if (!text) return []
  const chars = text.split('')
  const lines: string[] = []
  let current = ''

  for (const ch of chars) {
    const test = current + ch
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current)
      current = ch
      if (lines.length >= maxLines) break
    } else {
      current = test
    }
  }
  if (current && lines.length < maxLines) lines.push(current)

  // 마지막 줄 말줄임
  if (lines.length === maxLines) {
    let last = lines[maxLines - 1]!
    while (ctx.measureText(last + '…').width > maxWidth && last.length > 0) {
      last = last.slice(0, -1)
    }
    lines[maxLines - 1] = last + '…'
  }
  return lines
}

const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) => {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

const generate = async () => {
  if (generating.value || !props.title) return

  generating.value = true
  error.value = null

  try {
    const W = 1200
    const H = 630
    const PAD = 80

    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    // 배경 그라디언트
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#0f172a')
    grad.addColorStop(1, '#1e293b')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // 브랜딩 액센트 바
    ctx.fillStyle = '#6366f1'
    drawRoundRect(ctx, PAD, PAD, 6, 28, 3)
    ctx.fill()

    // 브랜딩 텍스트
    ctx.font = "500 22px 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif"
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('단순하고 색있게', PAD + 18, PAD + 21)

    // 제목 (최대 3줄)
    ctx.font = "700 62px 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif"
    const titleLines = splitLines(ctx, props.title, W - PAD * 2, 3)
    ctx.fillStyle = '#ffffff'
    titleLines.forEach((line, i) => {
      ctx.fillText(line, PAD, 230 + i * 80)
    })

    // 설명 (최대 2줄)
    if (props.description) {
      ctx.font = "400 28px 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif"
      ctx.fillStyle = '#94a3b8'
      const titleBottom = 230 + titleLines.length * 80
      const descY = Math.max(titleBottom + 32, 460)
      const descLines = splitLines(ctx, props.description, W - PAD * 2, 2)
      descLines.forEach((line, i) => {
        ctx.fillText(line, PAD, descY + i * 44)
      })
    }

    // 태그
    ctx.font = "500 20px 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif"
    let tagX = PAD
    const tagY = H - PAD - 10
    for (const tag of parsedTags.value.slice(0, 5)) {
      const label = `#${tag}`
      const textW = ctx.measureText(label).width
      const tagW = textW + 44
      const tagH = 38

      // 태그 배경
      ctx.fillStyle = 'rgba(99, 102, 241, 0.15)'
      drawRoundRect(ctx, tagX, tagY - tagH + 6, tagW, tagH, tagH / 2)
      ctx.fill()

      // 태그 테두리
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)'
      ctx.lineWidth = 1
      ctx.stroke()

      // 태그 텍스트
      ctx.fillStyle = '#a5b4fc'
      ctx.fillText(label, tagX + 22, tagY)

      tagX += tagW + 12
      if (tagX > W - PAD - 100) break
    }

    // Canvas → Blob → File → 업로드
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b)
        else reject(new Error('Canvas toBlob 실패'))
      }, 'image/png')
    })

    const file = new File([blob], 'cover.png', { type: 'image/png' })
    const response = await uploadImage(file)

    if (response.success && response.data) {
      emit('generated', response.data)
    } else {
      error.value = '이미지 업로드에 실패했습니다.'
    }
  } catch (err: any) {
    error.value = err.message || '커버 이미지 생성에 실패했습니다.'
    console.error('Cover image generation error:', err)
  } finally {
    generating.value = false
  }
}
</script>
