<script setup lang="ts">
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Table, TableBody, TableCell, TableRow } from './ui/table'

defineProps<{
  title?: string,
  fields: { name: string, value: string }[],
}>()
</script>

<template>
  <Card>
    <CardHeader v-if="title !== undefined || $slots.header">
      <slot name="header">
        <CardTitle v-if="title !== undefined" class="flex justify-between text-center text-lg">
          {{ title }}
        </CardTitle>
      </slot>
    </CardHeader>
    <CardContent>
      <Table>
        <TableBody>
          <TableRow v-for="field in fields">
            <TableCell>{{ field.name }}</TableCell>
            <TableCell>{{ field.value }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
    <CardFooter v-if="$slots.footer">
      <slot name="footer"></slot>
    </CardFooter>
  </Card>
</template>
