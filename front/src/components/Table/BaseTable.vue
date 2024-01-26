<template>
  <div class="mx-auto">
    <div class="shadow-sm border rounded-lg overflow-x-auto dark:border-[#cbd5e11a]">
      <table class="w-full table-auto text-sm">
        <thead class="bg-gray-50 dark:bg-dark-600 font-medium border-b dark:border-b-[#cbd5e11a]">
          <tr>
            <th
              v-for="(header, index) in headers"
              :key="index"
              :colspan="header.colspan"
              :rowspan="header.rowspan"
              class="p-3"
            >
              <div
                :class="{ 'cursor-pointer': header.sortable }"
                class="flex items-center justify-center gap-2"
                @click="onHeaderClick(header)"
              >
                <div>
                  {{ header.label }}
                </div>
                <div v-if="header.sortable">
                  <IconSortDesc
                    v-if="header.sort === TableSortDirection.Desc"
                    class="w-5 h-5 cursor-pointer 'dark:text-primary'"
                  />
                  <IconSortAsc
                    v-else-if="header.sort === TableSortDirection.Asc"
                    class="w-5 h-5 cursor-pointer 'dark:text-primary'"
                  />
                  <IconSortNone v-else />
                </div>
              </div>
            </th>
          </tr>

          <tr v-if="subHeaders">
            <th
              v-for="(header, index) in subHeaders"
              :key="index"
              :colspan="header.colspan"
              :rowspan="header.rowspan"
              class="p-3"
            >
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-[#cbd5e11a] dark:bg-dark-800">
          <slot></slot>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { TableHeader, TableProps } from '@/components/Table/types'
import { TableSortDirection } from '@/components/Table/types'
import IconSortAsc from '@/assets/icon/IconSortAsc.vue'
import IconSortDesc from '@/assets/icon/IconSortDesc.vue'
import IconSortNone from '@/assets/icon/IconSortNone.vue'

const props = defineProps<TableProps>()
const emit = defineEmits<{
  sort: [{ key: string; sort: TableSortDirection }]
}>()

function onHeaderClick(header: TableHeader) {
  if (header.sortable) {
    if (header.sort === TableSortDirection.Desc) {
      header.sort = TableSortDirection.Asc
    } else if (header.sort === TableSortDirection.Asc) {
      header.sort = TableSortDirection.Desc
    } else {
      header.sort = TableSortDirection.Desc
    }

    props.headers.forEach((el) => {
      el.sort = el.key === header.key ? header.sort : undefined
    })

    emit('sort', { key: header.key, sort: header.sort })
  }
}
</script>