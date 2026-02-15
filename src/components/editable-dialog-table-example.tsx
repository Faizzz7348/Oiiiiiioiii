import { useState } from "react"
import { EditableDialogTable } from "./editable-dialog-table"
import type { TableDataRow } from "./editable-dialog-table"
import { Button } from "./ui/button"

// Example data
const initialData: TableDataRow[] = [
  { id: 1, name: "Ahmad", email: "ahmad@email.com", role: "Developer" },
  { id: 2, name: "Siti", email: "siti@email.com", role: "Designer" },
  { id: 3, name: "Kumar", email: "kumar@email.com", role: "Manager" },
  { id: 4, name: "Faizal", email: "faizal@email.com", role: "Tester" },
  { id: 5, name: "Nurul", email: "nurul@email.com", role: "Developer" },
]

export function EditableDialogTableExample() {
  const [data, setData] = useState<TableDataRow[]>(initialData)

  const handleEdit = (id: string | number, key: string, value: unknown) => {
    console.log("Edited:", { id, key, value })
    // You can update server/database here
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    )
  }

  return (
    <div className="p-8">
      <EditableDialogTable
        title="Editable User Table"
        description="Click the edit icon to modify any row"
        data={data}
        columns={[
          { key: "name", label: "Name", editable: true },
          { key: "email", label: "Email", editable: true },
          { key: "role", label: "Role", editable: true },
        ]}
        onEdit={handleEdit}
        trigger={<Button>View & Edit Users</Button>}
      />
    </div>
  )
}
