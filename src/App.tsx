import { useState } from "react"
import {
  Home,
  Settings,
  User,
  Map,
  ChevronRight,
  ExternalLink,
  Pencil,
  MapPin,
  Clock,
  Plus,
  Pin,
  Info,
  Printer,
  FileDown,
  Mail,
  MessageSquare,
  Copy,
  Trash2,
  Check,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Collapsible,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible"
import { ThemeToggle } from "@/components/theme-toggle"
import { DialogTableWrapper } from "@/components/dialog-table-wrapper"

// Sample data untuk table dalam dialog
const routeDetails = [
  { id: 1, code: "54", name: "KPJ Klang", delivery: "Daily" },
  { id: 2, code: "23", name: "Hospital Shah Alam", delivery: "Weekday" },
  { id: 3, code: "89", name: "Pasar Malam", delivery: "Alt 1" },
  { id: 4, code: "45", name: "Stesen KTM Klang", delivery: "Alt 2" },
  { id: 5, code: "67", name: "Terminal Bas Klang", delivery: "Daily" },
]

// Function to format relative time
const getRelativeTime = (timestamp: string) => {
  const now = new Date()
  const past = new Date(timestamp)
  const diffInMs = now.getTime() - past.getTime()
  
  const minutes = Math.floor(diffInMs / (1000 * 60))
  const hours = Math.floor(diffInMs / (1000 * 60 * 60))
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
  return "long time ago"
}

// Function to get breadcrumb items
const getBreadcrumb = (page: string) => {
  switch (page) {
    case "home":
      return [{ label: "Home", link: "home" }]
    case "routelist":
      return [{ label: "Route List", link: "routelist" }]
    case "selangor":
      return [
        { label: "Route List", link: "routelist" },
        { label: "Selangor", link: "selangor" }
      ]
    case "kualalumpur":
      return [
        { label: "Route List", link: "routelist" },
        { label: "Kuala Lumpur", link: "kualalumpur" }
      ]
    case "profile":
      return [{ label: "Profile", link: "profile" }]
    case "settings":
      return [{ label: "Settings", link: "settings" }]
    default:
      return [{ label: "Home", link: "home" }]
  }
}

type Route = {
  id: number
  name: string
  code: string
  shift: string
  lastUpdate: string
  isPinned: boolean
}

export function App() {
  // Data routes untuk Selangor
  const [selangorRoutes, setSelangorRoutes] = useState<Route[]>([
    { 
      id: 1, 
      name: "SEL 1", 
      code: "3AVS01", 
      shift: "PM",
      lastUpdate: "2026-02-13 14:30:00",
      isPinned: false
    },
  ])

  // Data routes untuk Kuala Lumpur
  const [kualaLumpurRoutes, setKualaLumpurRoutes] = useState<Route[]>([
    { 
      id: 5, 
      name: "KL 1", 
      code: "5KLC01", 
      shift: "AM",
      lastUpdate: "2026-02-13 08:15:00",
      isPinned: false
    },
  ])

  const [activePage, setActivePage] = useState("home")
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [editForm, setEditForm] = useState({ name: "", code: "", shift: "" })
  const [initialForm, setInitialForm] = useState({ name: "", code: "", shift: "" })
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [addingToRegion, setAddingToRegion] = useState<"selangor" | "kualalumpur" | null>(null)
  const [routeListOpen, setRouteListOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<typeof routeDetails[0] | null>(null)
  const [deliveryOptions] = useState(["Daily", "Weekday", "Alt 1", "Alt 2"])
  const [routeDetailsState, setRouteDetailsState] = useState(routeDetails)
  const [showMenuModal, setShowMenuModal] = useState(false)

  const hasFormChanged = editForm.name !== initialForm.name || 
                         editForm.code !== initialForm.code || 
                         editForm.shift !== initialForm.shift

  const renderContent = () => {
    if (activePage === "routelist") {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Route List</h2>
          
          {/* Selangor Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Selangor</h3>
              <Button 
                variant="outline"
                onClick={() => setActivePage("selangor")}
                className="text-sm"
              >
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selangorRoutes.slice(0, 3).map((route) => (
                <div
                  key={route.id}
                  className="rounded-lg border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActivePage("selangor")}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-1">{route.name}</h4>
                    </div>
                    {route.isPinned && (
                      <div className="ml-2 p-1.5 rounded-md text-blue-600 bg-blue-50">
                        <Pin className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {route.code} - {route.shift}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Location: {routeDetailsState.length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Update: {getRelativeTime(route.lastUpdate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Kuala Lumpur Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Kuala Lumpur</h3>
              <Button 
                variant="outline"
                onClick={() => setActivePage("kualalumpur")}
                className="text-sm"
              >
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kualaLumpurRoutes.slice(0, 3).map((route) => (
                <div
                  key={route.id}
                  className="rounded-lg border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActivePage("kualalumpur")}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-1">{route.name}</h4>
                    </div>
                    {route.isPinned && (
                      <div className="ml-2 p-1.5 rounded-md text-blue-600 bg-blue-50">
                        <Pin className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {route.code} - {route.shift}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Location: {routeDetailsState.length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Update: {getRelativeTime(route.lastUpdate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (activePage === "selangor") {
      const sortedRoutes = [...selangorRoutes].sort((a, b) => {
        // Pinned routes first
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        // Then alphabetically
        return a.name.localeCompare(b.name)
      })
      
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Route List - Selangor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedRoutes.map((route) => (
              <div
                key={route.id}
                className="rounded-lg border bg-card p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{route.name}</h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelangorRoutes(selangorRoutes.map(r => 
                        r.id === route.id ? { ...r, isPinned: !r.isPinned } : r
                      ))
                    }}
                    className={`ml-2 p-1.5 rounded-md transition-colors ${
                      route.isPinned 
                        ? "text-blue-600 bg-blue-50 hover:bg-blue-100" 
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Pin className="h-4 w-4" />
                  </button>
                </div>
                <div className="-mt-3 mb-3">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-3">
                      {route.code} - {route.shift}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex-1">
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Location: {routeDetailsState.length}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Update: {getRelativeTime(route.lastUpdate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" 
                    onClick={() => {
                      const formData = { name: route.name, code: route.code, shift: route.shift }
                      setEditForm(formData)
                      setInitialForm(formData)
                      setEditingRoute(route)
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent 
                      contentStyle={{ width: '85vw' }}
                      className="flex flex-col"
                    >
                      <DialogHeader className="flex-shrink-0">
                        <DialogTitle>{route.name} - Route Details</DialogTitle>
                        <DialogDescription>
                          Detailed information about stops and schedule for this route.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogTableWrapper>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b-2 border-dashed">
                              <TableHead className="text-center">No</TableHead>
                              <TableHead className="text-center">Code</TableHead>
                              <TableHead className="text-center">Name</TableHead>
                              <TableHead className="text-center">Delivery</TableHead>
                              <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {routeDetailsState.map((detail, index) => (
                              <TableRow key={detail.id} className="border-b border-dashed">
                                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                                <TableCell className="text-center">{detail.code}</TableCell>
                                <TableCell className="text-center">{detail.name}</TableCell>
                                <TableCell className="text-center">
                                  <select
                                    value={detail.delivery}
                                    onChange={(e) => {
                                      const newDetails = [...routeDetailsState]
                                      newDetails[index] = { ...detail, delivery: e.target.value }
                                      setRouteDetailsState(newDetails)
                                    }}
                                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                  >
                                    {deliveryOptions.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        setSelectedDetail(detail)
                                        setShowInfoDialog(true)
                                      }}
                                    >
                                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        setRouteDetailsState(routeDetailsState.filter(d => d.id !== detail.id))
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="border-b border-dashed hover:bg-muted/50">
                              <TableCell colSpan={5} className="text-center py-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full text-green-600 hover:text-green-700 hover:bg-green-50 border-2 border-dashed border-gray-300 hover:border-gray-500"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    const newId = Math.max(...routeDetailsState.map(d => d.id), 0) + 1
                                    setRouteDetailsState([
                                      ...routeDetailsState,
                                      {
                                        id: newId,
                                        code: `NEW${newId}`,
                                        name: `New Location ${newId}`,
                                        delivery: 'Daily'
                                      }
                                    ])
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add New Location
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </DialogTableWrapper>
                      <DialogFooter className="flex-shrink-0 mt-4">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => setShowMenuModal(true)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Menu
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}            
            {/* Add New Card */}
            <div
              className="rounded-lg border-2 border-dashed border-gray-500/50 bg-transparent p-5 hover:border-gray-600 hover:bg-gray-50/30 transition-all cursor-pointer flex items-center justify-center min-h-[250px]"
              onClick={() => {
                setIsAddingNew(true)
                setAddingToRegion("selangor")
                setEditForm({ name: "", code: "", shift: "AM" })
              }}
            >
              <div className="flex flex-col items-center gap-2 text-green-600">
                <Plus className="h-12 w-12" />
                <span className="text-sm font-medium">Add New Route</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activePage === "kualalumpur") {
      const sortedRoutes = [...kualaLumpurRoutes].sort((a, b) => {
        // Pinned routes first
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        // Then alphabetically
        return a.name.localeCompare(b.name)
      })
      
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Route List - Kuala Lumpur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedRoutes.map((route) => (
              <div
                key={route.id}
                className="rounded-lg border bg-card p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{route.name}</h3>
                  </div>
                  <button
                    onClick={() => {
                      setKualaLumpurRoutes(kualaLumpurRoutes.map(r => 
                        r.id === route.id ? { ...r, isPinned: !r.isPinned } : r
                      ))
                    }}
                    className={`ml-2 p-1.5 rounded-md transition-colors ${
                      route.isPinned 
                        ? "text-blue-600 bg-blue-50 hover:bg-blue-100" 
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Pin className="h-4 w-4" />
                  </button>
                </div>
                <div className="-mt-3 mb-3">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-3">
                      {route.code} - {route.shift}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex-1">
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Location: {routeDetailsState.length}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Update: {getRelativeTime(route.lastUpdate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" 
                    onClick={() => {
                      const formData = { name: route.name, code: route.code, shift: route.shift }
                      setEditForm(formData)
                      setInitialForm(formData)
                      setEditingRoute(route)
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent 
                      contentStyle={{ width: '85vw' }}
                      className="flex flex-col"
                    >
                      <DialogHeader className="flex-shrink-0">
                        <DialogTitle>{route.name} - Route Details</DialogTitle>
                        <DialogDescription>
                          Detailed information about stops and schedule for this route.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogTableWrapper>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b-2 border-dashed">
                              <TableHead className="text-center">No</TableHead>
                              <TableHead className="text-center">Code</TableHead>
                              <TableHead className="text-center">Name</TableHead>
                              <TableHead className="text-center">Delivery</TableHead>
                              <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {routeDetailsState.map((detail, index) => (
                              <TableRow key={detail.id} className="border-b border-dashed">
                                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                                <TableCell className="text-center">{detail.code}</TableCell>
                                <TableCell className="text-center">{detail.name}</TableCell>
                                <TableCell className="text-center">
                                  <select
                                    value={detail.delivery}
                                    onChange={(e) => {
                                      const newDetails = [...routeDetailsState]
                                      newDetails[index] = { ...detail, delivery: e.target.value }
                                      setRouteDetailsState(newDetails)
                                    }}
                                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                  >
                                    {deliveryOptions.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        setSelectedDetail(detail)
                                        setShowInfoDialog(true)
                                      }}
                                    >
                                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        setRouteDetailsState(routeDetailsState.filter(d => d.id !== detail.id))
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="border-b border-dashed hover:bg-muted/50">
                              <TableCell colSpan={5} className="text-center py-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full text-green-600 hover:text-green-700 hover:bg-green-50 border-2 border-dashed border-gray-300 hover:border-gray-500"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    const newId = Math.max(...routeDetailsState.map(d => d.id), 0) + 1
                                    setRouteDetailsState([
                                      ...routeDetailsState,
                                      {
                                        id: newId,
                                        code: `NEW${newId}`,
                                        name: `New Location ${newId}`,
                                        delivery: 'Daily'
                                      }
                                    ])
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add New Location
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </DialogTableWrapper>
                      <DialogFooter className="flex-shrink-0 mt-4">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => setShowMenuModal(true)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Menu
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
            
            {/* Add New Card */}
            <div
              className="rounded-lg border-2 border-dashed border-gray-500/50 bg-transparent p-5 hover:border-gray-600 hover:bg-gray-50/30 transition-all cursor-pointer flex items-center justify-center min-h-[250px]"
              onClick={() => {
                setIsAddingNew(true)
                setAddingToRegion("kualalumpur")
                setEditForm({ name: "", code: "", shift: "AM" })
              }}
            >
              <div className="flex flex-col items-center gap-2 text-green-600">
                <Plus className="h-12 w-12" />
                <span className="text-sm font-medium">Add New Route</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activePage === "profile") {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Profil</h2>
          <p className="text-muted-foreground">Halaman profil pengguna.</p>
        </div>
      )
    }

    if (activePage === "settings") {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <p className="text-muted-foreground">Halaman pengaturan aplikasi.</p>
        </div>
      )
    }

    // Default home page
    return (
      <div className="p-6">
        <div className="grid gap-6">
          {/* Welcome Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Home</h2>
            <p className="text-muted-foreground">
              Selamat datang di aplikasi Route Management. Pilih Route List untuk melihat 
              daftar route di Selangor atau Kuala Lumpur.
            </p>
          </div>

          {/* Info Card with Description List */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold">Sistem Maklumat</h3>
            </div>
            
            <dl className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 border-b pb-3">
                <dt className="font-medium text-sm sm:w-1/3 text-muted-foreground">Total Routes</dt>
                <dd className="text-sm sm:w-2/3 font-semibold">
                  {selangorRoutes.length + kualaLumpurRoutes.length} routes
                </dd>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 border-b pb-3">
                <dt className="font-medium text-sm sm:w-1/3 text-muted-foreground">Selangor Routes</dt>
                <dd className="text-sm sm:w-2/3">
                  <span className="inline-flex items-center gap-2">
                    <span className="font-semibold">{selangorRoutes.length}</span>
                    <span className="text-muted-foreground">active routes</span>
                  </span>
                </dd>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 border-b pb-3">
                <dt className="font-medium text-sm sm:w-1/3 text-muted-foreground">Kuala Lumpur Routes</dt>
                <dd className="text-sm sm:w-2/3">
                  <span className="inline-flex items-center gap-2">
                    <span className="font-semibold">{kualaLumpurRoutes.length}</span>
                    <span className="text-muted-foreground">active routes</span>
                  </span>
                </dd>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 border-b pb-3">
                <dt className="font-medium text-sm sm:w-1/3 text-muted-foreground">Last Update</dt>
                <dd className="text-sm sm:w-2/3">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {(() => {
                        const allRoutes = [...selangorRoutes, ...kualaLumpurRoutes]
                        if (allRoutes.length === 0) return "No data"
                        const latest = allRoutes.reduce((prev, current) => 
                          new Date(current.lastUpdate) > new Date(prev.lastUpdate) ? current : prev
                        )
                        return getRelativeTime(latest.lastUpdate)
                      })()}
                    </span>
                  </span>
                </dd>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                <dt className="font-medium text-sm sm:w-1/3 text-muted-foreground">Status</dt>
                <dd className="text-sm sm:w-2/3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    System Active
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pinned Routes</p>
                  <p className="text-2xl font-bold mt-1">
                    {[...selangorRoutes, ...kualaLumpurRoutes].filter(r => r.isPinned).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Pin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Locations</p>
                  <p className="text-2xl font-bold mt-1">
                    {routeDetailsState.length * (selangorRoutes.length + kualaLumpurRoutes.length)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Regions</p>
                  <p className="text-2xl font-bold mt-1">2</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Map className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-center py-4 px-4">
            <img 
              src="/icon/familymart.png" 
              alt="FamilyMart" 
              className="h-24 w-auto object-contain"
            />
          </div>
          <SidebarInput placeholder="Cari menu..." />
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActivePage("home")}
                    isActive={activePage === "home"}
                    className="text-base"
                  >
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <Collapsible 
                  open={routeListOpen} 
                  onOpenChange={setRouteListOpen}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        className="text-base"
                        onClick={() => {
                          setActivePage("routelist")
                          setRouteListOpen(!routeListOpen)
                        }}
                        isActive={activePage === "routelist" || activePage === "selangor" || activePage === "kualalumpur"}
                      >
                        <Map />
                        <span>Route List</span>
                        <ChevronRight className="ml-auto transition-transform duration-200" style={{ transform: routeListOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ 
                      maxHeight: routeListOpen ? '500px' : '0px',
                      opacity: routeListOpen ? 1 : 0
                    }}>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            onClick={() => setActivePage("selangor")}
                            isActive={activePage === "selangor"}
                          >
                            <span>Selangor</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            onClick={() => setActivePage("kualalumpur")}
                            isActive={activePage === "kualalumpur"}
                          >
                            <span>Kuala Lumpur</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </div>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActivePage("profile")}
                    isActive={activePage === "profile"}
                  >
                    <User />
                    <span>Profil</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActivePage("settings")}
                    isActive={activePage === "settings"}
                  >
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="px-4 py-2 text-xs text-muted-foreground">
            © 2026 Dashboard App
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-6 bg-background shadow-sm">
          <SidebarTrigger />
          <nav 
            key={`breadcrumb-nav-${activePage}`}
            className="flex items-center gap-1 text-sm flex-1 min-w-0 isolate" 
            aria-label="Breadcrumb"
          >
            <div className="flex items-center gap-1 min-w-0 max-w-full overflow-hidden">
              {getBreadcrumb(activePage).map((item, index) => (
                <div 
                  key={`bc-${activePage}-${item.link}-${index}`} 
                  className="flex items-center gap-1 flex-shrink-0"
                >
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 mx-0.5" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      if (item.link === "routelist") {
                        setActivePage("home")
                      } else {
                        setActivePage(item.link)
                      }
                    }}
                    className={`
                      px-3 py-1.5 rounded-md transition-all duration-150 whitespace-nowrap select-none
                      ${
                        index === getBreadcrumb(activePage).length - 1
                          ? "font-semibold text-foreground bg-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }
                    `}
                  >
                    <span className="flex items-center gap-1.5 pointer-events-none">
                      {item.link === "home" && index === getBreadcrumb(activePage).length - 1 && (
                        <Home className="h-3.5 w-3.5" />
                      )}
                      <span>{item.label}</span>
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </nav>
          <div className="ml-auto flex-shrink-0">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-background">
          {renderContent()}
        </div>
      </SidebarInset>

      {/* Edit Modal with backdrop blur */}
      {editingRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setEditingRoute(null)}
          />
          <div className="relative bg-background rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Edit Route</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Code</label>
                <Input
                  value={editForm.code}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                  placeholder="Enter code"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Shift</label>
                <select
                  value={editForm.shift}
                  onChange={(e) => setEditForm({ ...editForm, shift: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditingRoute(null)}
              >
                Cancel
              </Button>
              {hasFormChanged ? (
                <Button
                  className="flex-1 bg-transparent text-green-600 border border-green-600 hover:bg-green-50"
                  onClick={() => {
                    if (editingRoute) {
                      const updatedRoute = {
                        ...editingRoute,
                        name: editForm.name,
                        code: editForm.code,
                        shift: editForm.shift,
                        lastUpdate: new Date().toISOString().slice(0, 19).replace('T', ' ')
                      }
                      
                      // Check which region the route belongs to based on activePage
                      if (activePage === "selangor") {
                        setSelangorRoutes(selangorRoutes.map(r => 
                          r.id === editingRoute.id ? updatedRoute : r
                        ))
                      } else if (activePage === "kualalumpur") {
                        setKualaLumpurRoutes(kualaLumpurRoutes.map(r => 
                          r.id === editingRoute.id ? updatedRoute : r
                        ))
                      }
                    }
                    setEditingRoute(null)
                  }}
                >
                  Save Changes
                </Button>
              ) : (
                <Button
                  className="flex-1 bg-transparent text-red-600 border border-red-600 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-background rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Delete Route</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this route? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  if (editingRoute) {
                    // Check which region the route belongs to based on activePage
                    if (activePage === "selangor") {
                      setSelangorRoutes(selangorRoutes.filter(r => r.id !== editingRoute.id))
                    } else if (activePage === "kualalumpur") {
                      setKualaLumpurRoutes(kualaLumpurRoutes.filter(r => r.id !== editingRoute.id))
                    }
                  }
                  setShowDeleteConfirm(false)
                  setEditingRoute(null)
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Modal with backdrop blur */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsAddingNew(false)}
          />
          <div className="relative bg-background rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Add New Route</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Code</label>
                <Input
                  value={editForm.code}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                  placeholder="Enter code"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Shift</label>
                <select
                  value={editForm.shift}
                  onChange={(e) => setEditForm({ ...editForm, shift: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsAddingNew(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  if (addingToRegion === "selangor") {
                    const newId = Math.max(...selangorRoutes.map(r => r.id), 0) + 1
                    const newRoute: Route = {
                      id: newId,
                      name: editForm.name,
                      code: editForm.code,
                      shift: editForm.shift,
                      lastUpdate: new Date().toISOString().slice(0, 19).replace('T', ' '),
                      isPinned: false
                    }
                    setSelangorRoutes([...selangorRoutes, newRoute])
                  } else if (addingToRegion === "kualalumpur") {
                    const newId = Math.max(...kualaLumpurRoutes.map(r => r.id), 0) + 1
                    const newRoute: Route = {
                      id: newId,
                      name: editForm.name,
                      code: editForm.code,
                      shift: editForm.shift,
                      lastUpdate: new Date().toISOString().slice(0, 19).replace('T', ' '),
                      isPinned: false
                    }
                    setKualaLumpurRoutes([...kualaLumpurRoutes, newRoute])
                  }
                  setIsAddingNew(false)
                  setAddingToRegion(null)
                }}
              >
                Add Route
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info Dialog - Outside main dialog portal */}
      {showInfoDialog && selectedDetail && (
        <>
          {/* Backdrop with animation */}
          <div 
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={(e) => {
              e.stopPropagation()
              setShowInfoDialog(false)
            }}
          />
          {/* Content Layer with animation */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4 animate-in zoom-in-95 fade-in duration-200">
            <div 
              className="relative bg-background rounded-xl shadow-2xl w-full max-w-md pointer-events-auto max-h-[85vh] overflow-hidden flex flex-col border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with image/gradient background */}
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCA0LTRzNCAxIDQgNGMwIDItMiA0LTQgNHMtNC0yLTQtNHptMC0zMGMwLTIgMi00IDQtNHM0IDIgNCA0YzAgMi0yIDQtNCA0cy00LTItNC00ek0xMiAyYzAtMiAyLTQgNC00czQgMiA0IDRjMCAyLTIgNC00IDRzLTQtMi00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                <button
                  onClick={() => setShowInfoDialog(false)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all z-10"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Avatar/Icon section overlapping header */}
              <div className="relative px-6 -mt-12 mb-4">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg border-4 border-background">
                  <MapPin className="h-10 w-10 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-2 overflow-y-auto flex-1">
                {/* Title Section */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1">{selectedDetail.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono bg-muted px-2 py-0.5 rounded">
                      {selectedDetail.code}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Active
                    </span>
                  </div>
                </div>

                {/* Description List - Single Column */}
                <div className="space-y-3">
                  <div className="group">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Location Information
                    </dt>
                    <dd className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                        <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-muted-foreground mb-0.5">Location Name</div>
                          <div className="font-medium truncate">{selectedDetail.name}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                        <div className="h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-lg">#</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-muted-foreground mb-0.5">Location ID</div>
                          <div className="font-mono font-medium">
                            {selectedDetail.id.toString().padStart(4, '0')}
                          </div>
                        </div>
                      </div>
                    </dd>
                  </div>

                  <div className="group">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Delivery Details
                    </dt>
                    <dd className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                        <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-muted-foreground mb-1">Schedule Type</div>
                          <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold ${
                            selectedDetail.delivery === 'Daily' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : selectedDetail.delivery === 'Weekday'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          }`}>
                            {selectedDetail.delivery}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-muted/40">
                        <div className="text-xs text-muted-foreground mb-1">Description</div>
                        <div className="text-sm">
                          {selectedDetail.delivery === 'Daily' && 'Delivery setiap hari termasuk hujung minggu'}
                          {selectedDetail.delivery === 'Weekday' && 'Delivery Isnin hingga Jumaat sahaja'}
                          {selectedDetail.delivery === 'Alt 1' && 'Delivery selang-seli (hari ganjil)'}
                          {selectedDetail.delivery === 'Alt 2' && 'Delivery selang-seli (hari genap)'}
                        </div>
                      </div>
                    </dd>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="flex gap-3">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                      Maklumat lengkap mengenai lokasi delivery ini. Pastikan kod lokasi dan jadual delivery adalah betul.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="px-6 py-4 bg-muted/30 border-t flex items-center justify-between gap-3">
                <Button 
                  variant="outline"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowInfoDialog(false)
                  }}
                >
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="icon"
                    type="button"
                    className="h-9 w-9"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowInfoDialog(false)
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    OK
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Menu Modal */}
      <Dialog open={showMenuModal} onOpenChange={setShowMenuModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Menu Options</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowMenuModal(false)}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowMenuModal(false)}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export as Excel
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowMenuModal(false)}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowMenuModal(false)}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowMenuModal(false)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => setShowMenuModal(false)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowMenuModal(false)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Share via Email
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowMenuModal(false)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Share via WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

export default App
