import type { AIMode, Message } from '@/types';

/**
 * A local fallback keeps the workspace useful before a user connects a provider.
 * It deliberately makes no claim that a remote model was contacted.
 */
export function generateOfflineReply(
  prompt: string,
  agentName: string,
  mode: AIMode,
  providerNotice?: string,
): Message {
  const cleanPrompt = prompt.trim();
  const lowerPrompt = cleanPrompt.toLowerCase();
  const modeNote = mode === 'deepsearch'
    ? 'DeepSearch is available after connecting OpenRouter; this local preview cannot browse the web.'
    : mode === 'think'
      ? 'Think mode is running locally, so the response is a structured planning aid rather than remote model reasoning.'
      : 'This is a local workspace response; connect a provider in Settings when you want live model output.';

  let content = `**${agentName} · Offline mode**\n\n${modeNote}\n\n`;
  if (providerNotice) {
    content += `> Live provider unavailable: ${providerNotice}\n\nI kept the local assistant active so you can continue working.\n\n`;
  }

  if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('مرحبا') || lowerPrompt.includes('السلام')) {
    content += 'مرحباً! أنا جاهز للعمل داخل مساحة Xm3AI. اكتب فكرة أو مهمة وسأحوّلها إلى خطوات واضحة.';
  } else if (lowerPrompt.includes('code') || lowerPrompt.includes('كود') || lowerPrompt.includes('برمج')) {
    content += 'لإنجاز هذه المهمة برمجياً، سأبدأ بتحديد المدخلات والمخرجات، ثم أقسم الحل إلى وحدات صغيرة قابلة للاختبار. أضف لغة البرمجة أو الملف المستهدف للحصول على خطة أدق.';
  } else if (lowerPrompt.includes('summar') || lowerPrompt.includes('لخص') || lowerPrompt.includes('تلخيص')) {
    content += 'أرسل النص الذي تريد تلخيصه، وسأرتبه محلياً إلى: الفكرة الرئيسية، أهم النقاط، والإجراءات المقترحة.';
  } else {
    content += `فهمت طلبك: “${cleanPrompt}”\n\nللمتابعة الآن:\n→ حدّد النتيجة المطلوبة بوضوح.\n→ أضف أي قيود أو أمثلة مهمة.\n→ استخدم Settings لربط Gemini أو OpenRouter إذا احتجت إجابة مولّدة مباشرة.`;
  }

  return {
    id: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role: 'assistant',
    content,
    timestamp: new Date(),
    mode,
  };
}
