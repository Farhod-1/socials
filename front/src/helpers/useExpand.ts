import { ref } from 'vue'

export function useExpanded() {
  const expanded = ref(new Set<string>())

  function toggleExpand(id: string) {
    if (expanded.value.has(id)) {
      expanded.value.delete(id)
    } else {
      expanded.value.add(id)
    }
  }

  function isExpanded(id: string) {
    return expanded.value.has(id)
  }

  return {
    toggleExpand,
    isExpanded
  }
}
